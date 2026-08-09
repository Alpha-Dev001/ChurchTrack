import mongoose, { Document, Schema } from 'mongoose';

interface ISlotLock extends Document {
  key: string;   // e.g. "wedding-2026-08-15-12:00 PM"
  count: number; // how many bookings have been recorded for this slot
}

const SlotLockSchema = new Schema<ISlotLock>(
  {
    key:   { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SlotLock = mongoose.model<ISlotLock>('SlotLock', SlotLockSchema);
export default SlotLock;
