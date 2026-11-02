import type {
  Address,
  AppNotification,
  Booking,
  Category,
  CustomerProfile,
  DeviceSession,
  Service,
} from "@/lib/types";

export interface CreateBookingInput {
  serviceId: string;
  addressId: string;
  scheduledDate: string;
  timeSlot: string;
  notes?: string;
  paymentMethod: "pay_after_service" | "upi";
}

export interface CatalogFilter {
  query?: string;
  categorySlug?: string;
}

/**
 * Customer-facing repository contract.
 * The UI only talks to this interface — the development adapter
 * (lib/api/dev-adapter) implements it today; a real backend
 * client (REST /api/v1) can replace it without touching screens.
 */
export interface CustomerRepository {
  // Auth (development adapter — real OTP goes through the backend)
  sendOtp(phone: string): Promise<{ ok: true }>;
  verifyOtp(phone: string, otp: string): Promise<{ ok: true; profile: CustomerProfile }>;
  logout(): Promise<void>;
  getSession(): Promise<{ authenticated: boolean; profile: CustomerProfile | null }>;
  updateProfile(patch: Partial<Pick<CustomerProfile, "name" | "email">>): Promise<CustomerProfile>;
  listSessions(): Promise<DeviceSession[]>;
  revokeSession(id: string): Promise<void>;
  requestAccountDeletion(): Promise<{ ok: true }>;

  // Catalogue
  listCategories(): Promise<Category[]>;
  listServices(filter?: CatalogFilter): Promise<Service[]>;
  getService(idOrSlug: string): Promise<Service | null>;

  // Addresses
  listAddresses(): Promise<Address[]>;
  saveAddress(address: Omit<Address, "id"> & { id?: string }): Promise<Address>;
  deleteAddress(id: string): Promise<void>;
  setDefaultAddress(id: string): Promise<void>;

  // Bookings
  listBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | null>;
  createBooking(input: CreateBookingInput): Promise<Booking>;
  cancelBooking(id: string): Promise<Booking>;
  submitReview(
    id: string,
    review: { rating: number; comment: string },
  ): Promise<Booking>;

  // Notifications
  listNotifications(): Promise<AppNotification[]>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
}
