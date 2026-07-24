export type ViewName =
  | 'visitor-home'
  | 'visitor-catalogue'
  | 'visitor-hall-details'
  | 'visitor-booking'
  | 'visitor-success'
  | 'visitor-track'
  | 'admin-login'
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
  eventDate: string;
  timeSlot: string;
  duration: string;
  guests: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  totalAmount: number;
  depositPaid: number;
  paymentStatus: string;
  specialRequests: string;
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