import { Booking, Payment, Hall } from '../models';
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

const generateBookingId = async () => {
  const count = await Booking.countDocuments();
  return `#BK-${count + 1020}`;
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
  const timeSlot = String(payload.timeSlot);

  const conflicting = await Booking.findOne({
    hallId,
    date,
    timeSlot,
    status: { $in: ['Pending', 'Approved'] },
  });

  if (conflicting) {
    throw new AppError('This hall is already booked for the selected date and time slot', 409);
  }

  const amount =
    typeof payload.amount === 'number' && payload.amount > 0
      ? payload.amount
      : hall.price;

  const bookingId = await generateBookingId();
  const paymentId = await generatePaymentId();

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
    eventType: String(payload.eventType),
    amount,
    paymentMethod: String(payload.paymentMethod),
    additionalNotes: payload.additionalNotes ? String(payload.additionalNotes) : '',
    id: bookingId,
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: new Date(),
    timeline: [
      {
        status: 'Pending',
        title: 'Request Submitted',
        date: new Date().toLocaleString(),
        description: 'Booking request has been received and is under review.',
      },
    ],
  });

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

  return booking;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'Approved' | 'Rejected'
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

  await booking.save();
  return booking;
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
});

/** Public lookup by reference code, email, or customer name */
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
