import mongoose, { Document, Schema } from 'mongoose';

interface IBookingLog extends Document {
  id: string;
  bookingId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details: string;
}

const BookingLogSchema = new Schema<IBookingLog>(
  {
    id: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

const BookingLog = mongoose.model<IBookingLog>('BookingLog', BookingLogSchema);
export default BookingLog;
