import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
