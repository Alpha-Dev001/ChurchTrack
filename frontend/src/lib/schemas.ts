import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits"),
  eventType: z
    .string()
    .min(1, "Please select an event type"),
  guests: z.coerce
    .number()
    .min(1, "Number of guests must be at least 1"),
  notes: z.string().optional(),
  paymentMethod: z.string().default("Bank Transfer"),
  agreed: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the Terms & Conditions and Privacy Policy",
    }),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const addHallSchema = z.object({
  name: z.string().min(2, "Hall name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional(),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1 guest"),
  price: z.coerce
    .number()
    .min(1000, "Price must be at least 1,000 RWF"),
  securityDeposit: z.coerce
    .number()
    .min(0, "Security deposit cannot be negative")
    .optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  size: z.string().optional(),
  workingHours: z.string().optional(),
  images: z
    .array(z.string().min(1, "Image is required"))
    .min(1, "Please upload or add at least one hall image")
    .max(5, "Maximum 5 images allowed"),
});

export type AddHallFormData = z.infer<typeof addHallSchema>;

export const quickAddHallSchema = z.object({
  name: z.string().min(2, "Hall name is required"),
  location: z.string().min(2, "Location is required"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1"),
  price: z.coerce
    .number()
    .min(1000, "Price must be at least 1,000 RWF"),
  description: z.string().optional(),
});

export type QuickAddHallFormData = z.infer<typeof quickAddHallSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export const trackBookingSchema = z.object({
  code: z
    .string()
    .min(2, "Enter a booking reference, email, or full name"),
});

export type TrackBookingFormData = z.infer<typeof trackBookingSchema>;
