import mongoose, { Document, Schema } from 'mongoose';

interface INotification extends Document {
  id: string;
  type: 'booking_received' | 'payment_received' | 'maintenance' | 'general';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
