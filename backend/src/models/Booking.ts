import mongoose, { Document, Schema } from 'mongoose';

interface IBookingTimelineItem {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Paid';
  title: string;
  date: string;
  description: string;
}

interface IBooking extends Document {
  id: string;
  hallId: string;
  hallName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  duration: string;
  guests: number;
  eventType: string;
  serviceType: 'SalleHub' | 'ChurchTrack';
  amount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  additionalNotes: string;
  brideName?: string;
  groomName?: string;
  brideEmail?: string;
  groomEmail?: string;
  bridePhone?: string;
  groomPhone?: string;
  weddingIdentity?: string;
  createdAt: Date;
  timeline: IBookingTimelineItem[];
}

const BookingTimelineSchema = new Schema<IBookingTimelineItem>({
  status: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
});

const BookingSchema = new Schema<IBooking>(
  {
    id: { type: String, required: true, unique: true },
    hallId: { type: String, required: true },
    hallName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    duration: { type: String, required: true },
    guests: { type: Number, required: true },
    eventType: { type: String, required: true },
    serviceType: { type: String, enum: ['SalleHub', 'ChurchTrack'], default: 'SalleHub' },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
    additionalNotes: { type: String, default: '' },
    brideName: { type: String, default: '' },
    groomName: { type: String, default: '' },
    brideEmail: { type: String, default: '' },
    groomEmail: { type: String, default: '' },
    bridePhone: { type: String, default: '' },
    groomPhone: { type: String, default: '' },
    weddingIdentity: { type: String, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now },
    timeline: [BookingTimelineSchema],
  },
  { timestamps: true }
);

BookingSchema.index({ serviceType: 1, date: 1, timeSlot: 1, status: 1 });
BookingSchema.index({ hallId: 1, date: 1, timeSlot: 1, status: 1 });
BookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
