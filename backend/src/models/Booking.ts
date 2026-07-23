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
  amount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  additionalNotes: string;
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
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
    additionalNotes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    timeline: [BookingTimelineSchema],
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
