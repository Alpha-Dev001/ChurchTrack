// ========== Core Data Models ==========

export interface Hall {
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
}

export interface BookingTimelineItem {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Paid';
  title: string;
  date: string;
  description: string;
}

export interface Booking {
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
  createdAt: string;
  timeline: BookingTimelineItem[];
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
}

export interface Notification {
  id: string;
  type: 'booking_received' | 'payment_received' | 'maintenance' | 'general';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SystemSettings {
  siteName: string;
  siteTagline: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  workingHours: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface BookingLog {
  id: string;
  bookingId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

// ========== Navigation / Routing ==========

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
  date?: string;
  timeSlot?: string;
  duration?: string;
  guests?: number;
  booking?: any;
  searchCode?: string;
}

// ========== Search & Filters ==========

export interface SearchFilters {
  location?: string;
  eventType?: string;
  maxGuests?: number;
  maxPrice?: number;
  query?: string;
}

// ========== Dashboard Stats ==========

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalHalls: number;
  occupancyRate: number;
}

// ========== Admin User ==========

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
  admin: AdminUser;
}

// ========== Calendar ==========

export interface CalendarEvent {
  id: string;
  hallName: string;
  customerName: string;
  date: string;
  timeSlot: string;
  eventType: string;
  status: 'Pending' | 'Approved' | 'Cancelled';
}

// ========== Language ==========

export type SupportedLang = 'EN' | 'FR' | 'RW';