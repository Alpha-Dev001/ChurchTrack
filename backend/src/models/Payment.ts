import mongoose, { Document, Schema } from 'mongoose';

interface IPayment extends Document {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Pending' | 'Failed';
  date: Date;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    id: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
