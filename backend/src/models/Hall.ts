import mongoose, { Document, Schema } from 'mongoose';

interface IHall extends Document {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  status: 'Active' | 'Inactive';
  images: string[];
  description: string;
  facilities: string[];
  workingHours: string;
  size: string;
  securityDeposit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const HallSchema = new Schema<IHall>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    images: [{ type: String }],
    description: { type: String, required: true },
    facilities: [{ type: String }],
    workingHours: { type: String, required: true },
    size: { type: String, required: true },
    securityDeposit: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Hall = mongoose.model<IHall>('Hall', HallSchema);
export default Hall;
