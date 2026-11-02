/**
 * Fixora customer domain types.
 * Money is stored in integer minor units (paise for INR).
 */

export type ID = string;

export type CategorySlug =
  | "plumbing"
  | "electrical"
  | "appliances"
  | "ac"
  | "cleaning"
  | "painting";

export type IllustrationKey =
  | "plumbing"
  | "electrical"
  | "appliances"
  | "ac"
  | "cleaning"
  | "painting"
  | "hero";

export interface Category {
  id: ID;
  slug: CategorySlug;
  name: string;
  description: string;
  illustration: IllustrationKey;
}

export type PricingModel = "fixed" | "starting_from" | "inspection" | "custom_quote";

export interface Service {
  id: ID;
  slug: string;
  categoryId: ID;
  categorySlug: CategorySlug;
  name: string;
  description: string;
  longDescription: string;
  pricingModel: PricingModel;
  pricePaise: number;
  inspectionFeePaise: number;
  durationMins: number;
  includes: string[];
  excludes: string[];
  cancellationPolicy: string;
  warrantyTerms: string;
  popular: boolean;
  illustration: IllustrationKey;
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "TECHNICIAN_ASSIGNED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type BookingTab = "upcoming" | "completed" | "cancelled";

export interface Address {
  id: ID;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  accessInstructions?: string;
  isDefault: boolean;
}

export interface PriceBreakdown {
  servicePaise: number;
  inspectionPaise: number;
  conveniencePaise: number;
  taxPaise: number;
  discountPaise: number;
  totalPaise: number;
  currency: "INR";
}

export interface StatusEvent {
  status: BookingStatus;
  at: string;
  note?: string;
}

export interface TechnicianSummary {
  name: string;
  verified: boolean;
  jobsCompleted: number;
  hue: number;
  phone: string;
}

export interface Booking {
  id: ID;
  reference: string;
  serviceId: ID;
  serviceName: string;
  categorySlug: CategorySlug;
  illustration: IllustrationKey;
  address: Address;
  scheduledDate: string;
  timeSlot: string;
  notes?: string;
  status: BookingStatus;
  price: PriceBreakdown;
  paymentMethod: "pay_after_service" | "upi";
  paymentStatus: "awaiting_confirmation" | "pay_at_service" | "paid";
  technician?: TechnicianSummary;
  createdAt: string;
  statusHistory: StatusEvent[];
  review?: { rating: number; comment: string; at: string };
}

export type NotificationKind = "booking" | "offer" | "system";

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
}

export interface DeviceSession {
  id: ID;
  device: string;
  lastActiveAt: string;
  current: boolean;
}

export type OtpChannel = "sms";
