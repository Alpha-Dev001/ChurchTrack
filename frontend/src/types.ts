export type ViewName =
  | 'visitor-home'
  | 'visitor-sallehub'
  | 'visitor-wedding-landing'
  | 'visitor-wedding-booking'
  | 'visitor-wedding-track'
  | 'visitor-catalogue'
  | 'visitor-hall-details'
  | 'visitor-booking'
  | 'visitor-success'
  | 'visitor-track'
  | 'admin-login'
  | 'superadmin-dashboard'
  | 'admin-dashboard'
  | 'admin-halls'
  | 'admin-add-hall'
  | 'admin-hall-details'
  | 'admin-bookings'
  | 'admin-booking-details'
  | 'admin-calendar'
  | 'admin-settings';

export interface ViewParams {
  hallId?: string;
  bookingId?: string;
  booking?: any;
  date?: string;
  timeSlot?: string;
  duration?: string;
  guests?: number;
  searchCode?: string;
  serviceType?: 'SalleHub' | 'ChurchTrack';
  [key: string]: any;
}

export interface Hall {
  _id: string;
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
  securityDeposit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  id: string;
  hallId: string;
  hallName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  /** Backend field name — used for sorting/display */
  date: string;
  /** Legacy alias — some pages may still use this; maps to `date` */
  eventDate?: string;
  timeSlot: string;
  duration: string;
  guests: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  /** Backend field name */
  amount: number;
  /** Legacy alias — maps to `amount` */
  totalAmount?: number;
  depositPaid?: number;
  paymentStatus: string;
  paymentMethod?: string;
  additionalNotes?: string;
  specialRequests?: string;
  serviceType?: 'SalleHub' | 'ChurchTrack';
  brideName?: string;
  groomName?: string;
  brideEmail?: string;
  groomEmail?: string;
  bridePhone?: string;
  groomPhone?: string;
  timeline?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalHalls: number;
  occupancyRate: number;
}

export interface SearchFilters {
  location?: string;
  minCapacity?: number;
  maxPrice?: number;
  date?: string;
  [key: string]: any;
}

export interface SystemSettings {
  _id?: string;
  siteName: string;
  siteTagline: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  workingHours: string;
  timeZone?: string;
  dateFormat?: string;
}

export type SupportedLang = 'EN' | 'FR' | 'RW';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user?: AdminUser;
  admin?: AdminUser;
}