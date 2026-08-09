import { Booking, Payment, Hall, SlotLock } from '../models';
import { AppError } from '../middlewares/error.middleware';
import { bookingIdVariants, normalizeId } from '../utils/id.utils';

const REQUIRED_FIELDS = [
  'hallId',
  'customerName',
  'customerEmail',
  'customerPhone',
  'date',
  'timeSlot',
  'duration',
  'guests',
  'eventType',
  'paymentMethod',
] as const;

const ALLOWED_SERVICE_TYPES = ['SalleHub', 'ChurchTrack'] as const;
const CHURCHTRACK_ALLOWED_START_TIMES = ['12:00 PM', '02:00 PM', '04:00 PM'];
const MAX_COUPLES_PER_SLOT = 4;

const parseTimeSlotStart = (timeSlot: string) => {
  const match = timeSlot.trim().match(/^\s*([0-9]{1,2}:[0-9]{2}\s*(?:AM|PM))/i);
  if (!match) return null;
  return match[1].toUpperCase().replace(/\s+/g, ' ');
};

const normalizeWeddingIdentityPart = (value: unknown) =>
  String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');

/** Generate a SalleHub booking ID: #BK-XXXX */
const generateSalleHubBookingId = async () => {
  const count = await Booking.countDocuments({ serviceType: { $ne: 'ChurchTrack' } });
  return `#BK-${count + 1020}`;
};

/** Generate a ChurchTrack wedding reference: CT-WED-YYYY-XXXXX */
const generateChurchTrackBookingId = async (weddingDateStr: string) => {
  const year = new Date(weddingDateStr).getFullYear();
  const count = await Booking.countDocuments({ serviceType: 'ChurchTrack' });
  const seq = String(count + 1).padStart(5, '0');
  return `CT-WED-${year}-${seq}`;
};

const generatePaymentId = async () => {
  const count = await Payment.countDocuments();
  return `#PY-${count + 1001}`;
};

const findBookingById = async (bookingId: string) => {
  const variants = bookingIdVariants(bookingId);
  if (!variants.length) return null;
  return Booking.findOne({ id: { $in: variants } });
};

export const listBookings = async () => {
  return Booking.find({}).sort({ createdAt: -1 });
};

export const getBookingById = async (bookingId: string) => {
  return findBookingById(bookingId);
};

/** Increment slot lock atomically. Returns false if already full. */
const acquireSlotLock = async (lockKey: string): Promise<boolean> => {
  try {
    const result = await SlotLock.findOneAndUpdate(
      { key: lockKey, count: { $lt: MAX_COUPLES_PER_SLOT } },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return result !== null;
  } catch (err: any) {
    // Duplicate key on upsert means the lock doc already exists at max capacity
    if (err.code === 11000) return false;
    throw err;
  }
};

/** Release one slot from the lock (used when booking is rejected or creation fails). */
const releaseSlotLock = async (lockKey: string): Promise<void> => {
  await SlotLock.updateOne(
    { key: lockKey, count: { $gt: 0 } },
    { $inc: { count: -1 } }
  );
};

export const createBooking = async (payload: Record<string, unknown>) => {
  for (const field of REQUIRED_FIELDS) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const hallId = String(payload.hallId);
  const hall = await Hall.findOne({ id: hallId });
  if (!hall) {
    throw new AppError('Hall not found', 404);
  }
  if (hall.status !== 'Active') {
    throw new AppError('This hall is not available for booking', 400);
  }

  const guests = Number(payload.guests);
  if (!Number.isFinite(guests) || guests < 1) {
    throw new AppError('guests must be a positive number', 400);
  }
  if (guests > hall.capacity) {
    throw new AppError(`Guest count exceeds hall capacity of ${hall.capacity}`, 400);
  }

  const date = String(payload.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new AppError('date must use YYYY-MM-DD format', 400);
  }
  const timeSlot = String(payload.timeSlot);
  const serviceType = payload.serviceType ? String(payload.serviceType) : 'SalleHub';
  const eventType = String(payload.eventType);

  if (!ALLOWED_SERVICE_TYPES.includes(serviceType as any)) {
    throw new AppError('Invalid serviceType', 400);
  }

  if (serviceType === 'ChurchTrack') {
    for (const field of ['brideName', 'groomName', 'brideEmail', 'groomEmail', 'bridePhone', 'groomPhone']) {
      if (!String(payload[field] || '').trim()) {
        throw new AppError(`${field} is required for ChurchTrack wedding bookings`, 400);
      }
    }
  }

  const weddingIdentity = serviceType === 'ChurchTrack'
    ? [payload.brideName, payload.brideEmail, payload.bridePhone, payload.groomName, payload.groomEmail, payload.groomPhone]
      .map(normalizeWeddingIdentityPart)
      .join('|')
    : undefined;

  if (weddingIdentity && await Booking.exists({ serviceType: 'ChurchTrack', weddingIdentity })) {
    throw new AppError('This couple has already submitted a wedding booking request.', 409);
  }

  const bookingDate = new Date(date);
  if (Number.isNaN(bookingDate.getTime())) {
    throw new AppError('Invalid date', 400);
  }

  let lockKey: string | null = null;

  if (serviceType === 'ChurchTrack') {
    const day = bookingDate.getDay();
    if (day === 0) {
      throw new AppError('ChurchTrack wedding bookings are not allowed on Sundays', 400);
    }

    const startTime = parseTimeSlotStart(timeSlot);
    if (!startTime || !CHURCHTRACK_ALLOWED_START_TIMES.includes(startTime)) {
      throw new AppError('ChurchTrack wedding bookings must use 12:00 PM, 02:00 PM, or 04:00 PM time slots', 400);
    }

    // Verify capacity using the DB count (for display / pre-check)
    const existingSlotCount = await Booking.countDocuments({
      serviceType: 'ChurchTrack',
      date,
      timeSlot,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingSlotCount >= MAX_COUPLES_PER_SLOT) {
      throw new AppError('This ChurchTrack wedding time slot is fully booked. Please select a different time or date.', 409);
    }

    // Concurrency-safe atomic lock
    lockKey = `wedding-${date}-${startTime}`;
    const acquired = await acquireSlotLock(lockKey);
    if (!acquired) {
      throw new AppError('This ChurchTrack wedding time slot is fully booked. Please select a different time or date.', 409);
    }
  } else {
    // SalleHub: check for hall conflicts (same hall, same date, same slot)
    const conflicting = await Booking.findOne({
      hallId,
      date,
      timeSlot,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (conflicting) {
      throw new AppError('This hall is already booked for the selected date and time slot', 409);
    }
  }

  const amount =
    typeof payload.amount === 'number' && payload.amount > 0
      ? payload.amount
      : hall.price;

  const bookingId = serviceType === 'ChurchTrack'
    ? await generateChurchTrackBookingId(date)
    : await generateSalleHubBookingId();
  const paymentId = await generatePaymentId();

  let bookingIdCreated: string | null = null;
  let paymentIdCreated: string | null = null;
  try {
    const booking = await Booking.create({
      hallId,
      hallName: hall.name,
      customerName: String(payload.customerName).trim(),
      customerEmail: String(payload.customerEmail).trim().toLowerCase(),
      customerPhone: String(payload.customerPhone).trim(),
      date,
      timeSlot,
      duration: String(payload.duration),
      guests,
      eventType,
      serviceType,
      amount,
      paymentMethod: String(payload.paymentMethod),
      additionalNotes: payload.additionalNotes ? String(payload.additionalNotes) : '',
      brideName: serviceType === 'ChurchTrack' && payload.brideName ? String(payload.brideName).trim() : '',
      groomName: serviceType === 'ChurchTrack' && payload.groomName ? String(payload.groomName).trim() : '',
      brideEmail: serviceType === 'ChurchTrack' && payload.brideEmail ? String(payload.brideEmail).trim().toLowerCase() : '',
      groomEmail: serviceType === 'ChurchTrack' && payload.groomEmail ? String(payload.groomEmail).trim().toLowerCase() : '',
      bridePhone: serviceType === 'ChurchTrack' && payload.bridePhone ? String(payload.bridePhone).trim() : '',
      groomPhone: serviceType === 'ChurchTrack' && payload.groomPhone ? String(payload.groomPhone).trim() : '',
      ...(weddingIdentity ? { weddingIdentity } : {}),
      id: bookingId,
      paymentStatus: 'Pending',
      status: 'Pending',
      createdAt: new Date(),
      timeline: [
        {
          status: 'Pending',
          title: 'Request Submitted',
          date: new Date().toLocaleString(),
          description: serviceType === 'ChurchTrack'
            ? 'Wedding booking request has been received and is under review.'
            : 'Booking request has been received and is under review.',
        },
      ],
    });
    bookingIdCreated = booking.id;

    await Payment.create({
      id: paymentId,
      bookingId: booking.id,
      customerName: booking.customerName,
      amount: booking.amount,
      method: booking.paymentMethod,
      status: 'Pending',
      date: new Date(),
      createdAt: new Date(),
    });
    paymentIdCreated = paymentId;

    return booking;
  } catch (err) {
    if (bookingIdCreated) {
      await Booking.deleteOne({ id: bookingIdCreated });
    }
    if (paymentIdCreated) {
      await Payment.deleteOne({ id: paymentIdCreated });
    }
    // Release the lock if we acquired one but creation failed
    if (lockKey) {
      await releaseSlotLock(lockKey);
    }
    if (err && typeof err === 'object' && (err as { code?: number }).code === 11000 && weddingIdentity) {
      throw new AppError('This couple has already submitted a wedding booking request.', 409);
    }
    throw err;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'Approved' | 'Rejected' | 'Cancelled'
) => {
  const booking = await findBookingById(bookingId);
  if (!booking) return null;

  if (booking.status !== 'Pending') {
    throw new AppError(`Booking is already ${booking.status}`, 400);
  }

  booking.status = status;
  booking.timeline.push({
    status,
    title: status === 'Approved' ? 'Request Approved' : 'Request Rejected',
    date: new Date().toLocaleString(),
    description:
      status === 'Approved'
        ? 'Church admin approved your reservation slot.'
        : 'Church admin rejected your reservation slot.',
  });

  if (status === 'Approved') {
    booking.paymentStatus = 'Paid';
    const paymentVariants = bookingIdVariants(booking.id);
    await Payment.findOneAndUpdate(
      { bookingId: { $in: paymentVariants } },
      { status: 'Paid', updatedAt: new Date() }
    );
  }

  // Release slot lock on rejection for ChurchTrack bookings
  if ((status === 'Rejected' || status === 'Cancelled') && booking.serviceType === 'ChurchTrack') {
    const startTime = parseTimeSlotStart(booking.timeSlot);
    if (startTime) {
      const lockKey = `wedding-${booking.date}-${startTime}`;
      await releaseSlotLock(lockKey);
    }
  }

  await booking.save();
  return booking;
};

export const getWeddingAvailability = async (date: string) => {
  const slots = [
    { key: '12:00 PM', label: '12:00 PM - 02:00 PM' },
    { key: '02:00 PM', label: '02:00 PM - 04:00 PM' },
    { key: '04:00 PM', label: '04:00 PM - 06:00 PM' },
  ];

  const results = await Promise.all(
    slots.map(async (slot) => {
      const count = await Booking.countDocuments({
        serviceType: 'ChurchTrack',
        date,
        timeSlot: { $regex: new RegExp(`^${slot.key.replace(':', '\\:').replace(' ', '\\s*')}`, 'i') },
        status: { $in: ['Pending', 'Approved'] },
      });
      return {
        key: slot.key,
        label: slot.label,
        booked: count,
        capacity: MAX_COUPLES_PER_SLOT,
        available: MAX_COUPLES_PER_SLOT - count,
        full: count >= MAX_COUPLES_PER_SLOT,
      };
    })
  );

  return results;
};

export const getPublicBookingSummary = async (bookingId: string) => {
  const booking = await findBookingById(bookingId);
  if (!booking) return null;

  return {
    id: booking.id,
    hallName: booking.hallName,
    date: booking.date,
    timeSlot: booking.timeSlot,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    eventType: booking.eventType,
    guests: booking.guests,
    amount: booking.amount,
    timeline: booking.timeline,
    customerName: booking.customerName,
    serviceType: booking.serviceType,
    brideName: (booking as any).brideName,
    groomName: (booking as any).groomName,
    brideEmail: (booking as any).brideEmail,
    groomEmail: (booking as any).groomEmail,
    bridePhone: (booking as any).bridePhone,
    groomPhone: (booking as any).groomPhone,
  };
};

const toPublicSummary = (booking: any) => ({
  id: booking.id,
  hallName: booking.hallName,
  date: booking.date,
  timeSlot: booking.timeSlot,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  eventType: booking.eventType,
  guests: booking.guests,
  amount: booking.amount,
  timeline: booking.timeline,
  customerName: booking.customerName,
  serviceType: booking.serviceType,
  brideName: booking.brideName,
  groomName: booking.groomName,
  brideEmail: booking.brideEmail,
  groomEmail: booking.groomEmail,
  bridePhone: booking.bridePhone,
  groomPhone: booking.groomPhone,
});

/** Public lookup by reference code, partner email, or partner name */
export const trackBookings = async (query: string) => {
  const q = String(query || '').trim();
  if (q.length < 2) return [];

  // Prefer exact / variant ID match first
  const byId = await findBookingById(q);
  if (byId) return [toPublicSummary(byId)];

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');

  const bookings = await Booking.find({
    $or: [
      { serviceType: 'ChurchTrack', brideName: regex },
      { serviceType: 'ChurchTrack', groomName: regex },
      { serviceType: 'ChurchTrack', brideEmail: regex },
      { serviceType: 'ChurchTrack', groomEmail: regex },
      { customerEmail: regex },
      { customerName: regex },
      { id: regex },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(10);

  return bookings.map(toPublicSummary);
};

export { normalizeId };
