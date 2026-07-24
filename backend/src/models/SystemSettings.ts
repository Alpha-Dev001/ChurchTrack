import mongoose, { Document, Schema } from 'mongoose';

interface ISystemSettings extends Document {
  siteName: string;
  siteTagline: string;
  email: string;
  phone: string;
  address: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  workingHours: string;
  logoUrl: string;
  faviconUrl: string;
}

const SystemSettingsSchema = new Schema<ISystemSettings>(
  {
    siteName: { type: String, required: true },
    siteTagline: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    timeZone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' },
    timeFormat: { type: String, default: '12h' },
    currency: { type: String, default: 'RWF' },
    workingHours: { type: String, required: true },
    logoUrl: { type: String },
    faviconUrl: { type: String },
  },
  { timestamps: true }
);

const SystemSettings = mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);
export default SystemSettings;