import type {
  Address,
  AppNotification,
  Booking,
  CustomerProfile,
  DeviceSession,
  Service,
} from "@/lib/types";
import {
  categories,
  seedAddresses,
  seedBookings,
  seedNotifications,
  seedProfile,
  seedSessions,
  services,
} from "@/lib/data/catalog";
import type { CatalogFilter, CustomerRepository } from "@/lib/api/repository";
import { estimatePrice } from "@/lib/pricing";

/**
 * DEVELOPMENT ADAPTER
 * ────────────────────
 * Simulates the Fixora REST API in the browser so the customer
 * portal can be built and reviewed before the backend exists.
 *  • Clearly isolated: swap `repo` in lib/api/index.ts for a
 *    real HTTP client implementing CustomerRepository.
 *  • Persists to localStorage under `fixora.dev.*` keys only.
 *  • NOT a security boundary — OTP is accepted as any 6 digits,
 *    sessions are not signed, and nothing here may ship as
 *    production authentication.
 */

const STORAGE_KEY = "fixora.dev.store.v1";
const LATENCY_MS = 350;

interface DevStore {
  authenticated: boolean;
  profile: CustomerProfile | null;
  phone: string | null;
  addresses: Address[];
  bookings: Booking[];
  notifications: AppNotification[];
  sessions: DeviceSession[];
  reviewByBooking: Record<string, { rating: number; comment: string; at: string }>;
}

function seedStore(): DevStore {
  return {
    authenticated: false,
    profile: null,
    phone: null,
    addresses: seedAddresses.map((a) => ({ ...a })),
    bookings: seedBookings.map((b) => ({
      ...b,
      address: { ...b.address },
      price: { ...b.price },
      statusHistory: b.statusHistory.map((h) => ({ ...h })),
    })),
    notifications: seedNotifications.map((n) => ({ ...n })),
    sessions: seedSessions.map((s) => ({ ...s })),
    reviewByBooking: {},
  };
}

function load(): DevStore {
  if (typeof window === "undefined") return seedStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedStore();
    const parsed = JSON.parse(raw) as DevStore;
    return { ...seedStore(), ...parsed };
  } catch {
    return seedStore();
  }
}

function save(store: DevStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage full or unavailable — in-memory state still works */
  }
}

function wait(ms = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeReference(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `#FX${n}`;
}

let store: DevStore | null = null;
function db(): DevStore {
  if (!store) store = load();
  return store;
}

function persist(): void {
  save(db());
}

function priceFor(service: Service) {
  return estimatePrice(service);
}

function requireAuth(): DevStore {
  const s = db();
  if (!s.authenticated || !s.profile) {
    throw new RepositoryError("AUTH_REQUIRED", "Sign in to continue.");
  }
  return s;
}

export class RepositoryError extends Error {
  code: "AUTH_REQUIRED" | "NOT_FOUND" | "VALIDATION" | "CONFLICT";
  constructor(
    code: RepositoryError["code"],
    message: string,
  ) {
    super(message);
    this.name = "RepositoryError";
    this.code = code;
  }
}

export const devRepository: CustomerRepository = {
  async sendOtp(phone) {
    await wait(400);
    if (!/^\+?[\d\s-]{10,16}$/.test(phone.trim())) {
      throw new RepositoryError("VALIDATION", "Enter a valid mobile number.");
    }
    const s = db();
    s.phone = phone.trim();
    persist();
    return { ok: true };
  },

  async verifyOtp(phone, otp) {
    await wait(450);
    if (!/^\d{6}$/.test(otp)) {
      throw new RepositoryError("VALIDATION", "Enter the 6-digit code.");
    }
    const s = db();
    s.authenticated = true;
    s.phone = phone;
    if (!s.profile) s.profile = { ...seedProfile, phone };
    else s.profile = { ...s.profile, phone };
    const current = s.sessions.find((x) => x.current);
    if (current) current.lastActiveAt = new Date().toISOString();
    persist();
    return { ok: true, profile: s.profile };
  },

  async logout() {
    await wait(200);
    const s = db();
    s.authenticated = false;
    persist();
  },

  async getSession() {
    await wait(120);
    const s = db();
    // DEV-ONLY screenshot/preview hook: `?__auth=1` signs the demo session in
    // without walking the OTP flow (headless browsers cannot fill forms).
    if (
      typeof window !== "undefined" &&
      /[?&]__auth=1(&|$)/.test(window.location.search) &&
      !s.authenticated
    ) {
      s.authenticated = true;
      s.profile = s.profile ?? { ...seedProfile };
      s.phone = s.phone ?? s.profile.phone;
      persist();
    }
    return { authenticated: s.authenticated, profile: s.profile };
  },

  async updateProfile(patch) {
    await wait(350);
    const s = requireAuth();
    if (patch.name !== undefined && patch.name.trim().length < 2) {
      throw new RepositoryError("VALIDATION", "Name must be at least 2 characters.");
    }
    if (patch.email !== undefined && patch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.email)) {
      throw new RepositoryError("VALIDATION", "Enter a valid email address.");
    }
    s.profile = {
      ...s.profile!,
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.email !== undefined ? { email: patch.email.trim() } : {}),
    };
    persist();
    return s.profile;
  },

  async listSessions() {
    await wait(200);
    const s = requireAuth();
    return s.sessions.map((x) => ({ ...x }));
  },

  async revokeSession(id) {
    await wait(250);
    const s = requireAuth();
    const target = s.sessions.find((x) => x.id === id);
    if (!target) throw new RepositoryError("NOT_FOUND", "Session not found.");
    if (target.current) throw new RepositoryError("CONFLICT", "You cannot revoke the current session here.");
    s.sessions = s.sessions.filter((x) => x.id !== id);
    persist();
  },

  async requestAccountDeletion() {
    await wait(400);
    requireAuth();
    return { ok: true };
  },

  async listCategories() {
    await wait(150);
    return categories.map((c) => ({ ...c }));
  },

  async listServices(filter: CatalogFilter = {}) {
    await wait(250);
    const q = filter.query?.trim().toLowerCase();
    return services
      .filter((s) => (filter.categorySlug && filter.categorySlug !== "all" ? s.categorySlug === filter.categorySlug : true))
      .filter((s) =>
        q
          ? s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.longDescription.toLowerCase().includes(q)
          : true,
      )
      .map((s) => ({ ...s }));
  },

  async getService(idOrSlug) {
    await wait(200);
    const found = services.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
    return found ? { ...found } : null;
  },

  async listAddresses() {
    await wait(200);
    const s = requireAuth();
    return s.addresses.map((a) => ({ ...a }));
  },

  async saveAddress(input) {
    await wait(350);
    const s = requireAuth();
    const errors: string[] = [];
    if (!input.label.trim()) errors.push("Label is required.");
    if (!input.line1.trim()) errors.push("Address line is required.");
    if (!input.city.trim()) errors.push("City is required.");
    if (!/^\d{6}$/.test(input.pincode.trim())) errors.push("PIN code must be 6 digits.");
    if (errors.length) throw new RepositoryError("VALIDATION", errors[0]);

    let saved: Address;
    if (input.id) {
      const idx = s.addresses.findIndex((a) => a.id === input.id);
      if (idx === -1) throw new RepositoryError("NOT_FOUND", "Address not found.");
      saved = { ...(s.addresses[idx] as Address), ...input, id: input.id } as Address;
      s.addresses[idx] = saved;
    } else {
      saved = {
        ...(input as Omit<Address, "id">),
        id: `addr_${Date.now().toString(36)}`,
      } as Address;
      s.addresses.push(saved);
    }
    if (saved.isDefault) {
      s.addresses.forEach((a) => {
        if (a.id !== saved.id) a.isDefault = false;
      });
    }
    if (s.addresses.length === 1) saved.isDefault = true;
    persist();
    return { ...saved };
  },

  async deleteAddress(id) {
    await wait(300);
    const s = requireAuth();
    const target = s.addresses.find((a) => a.id === id);
    if (!target) throw new RepositoryError("NOT_FOUND", "Address not found.");
    s.addresses = s.addresses.filter((a) => a.id !== id);
    if (target.isDefault && s.addresses[0]) s.addresses[0].isDefault = true;
    persist();
  },

  async setDefaultAddress(id) {
    await wait(250);
    const s = requireAuth();
    if (!s.addresses.some((a) => a.id === id)) {
      throw new RepositoryError("NOT_FOUND", "Address not found.");
    }
    s.addresses.forEach((a) => {
      a.isDefault = a.id === id;
    });
    persist();
  },

  async listBookings() {
    await wait(300);
    const s = requireAuth();
    return s.bookings
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((b) => ({ ...b }));
  },

  async getBooking(id) {
    await wait(250);
    const s = requireAuth();
    const found = s.bookings.find((b) => b.id === id);
    return found ? { ...found } : null;
  },

  async createBooking(input) {
    await wait(700);
    const s = requireAuth();
    const service = services.find((x) => x.id === input.serviceId);
    if (!service) throw new RepositoryError("NOT_FOUND", "Service not found.");
    const address = s.addresses.find((a) => a.id === input.addressId);
    if (!address) throw new RepositoryError("VALIDATION", "Select a service address.");
    if (!input.scheduledDate || !input.timeSlot) {
      throw new RepositoryError("VALIDATION", "Choose a date and time slot.");
    }

    const now = new Date().toISOString();
    const booking: Booking = {
      id: `bk_${Date.now().toString(36)}`,
      reference: makeReference(),
      serviceId: service.id,
      serviceName: service.name,
      categorySlug: service.categorySlug,
      illustration: service.illustration,
      address: { ...address },
      scheduledDate: input.scheduledDate,
      timeSlot: input.timeSlot,
      notes: input.notes?.trim() || undefined,
      status: "PENDING",
      price: priceFor(service),
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "upi" ? "awaiting_confirmation" : "pay_at_service",
      createdAt: now,
      statusHistory: [{ status: "PENDING", at: now, note: "Booking created" }],
    };

    s.bookings.unshift(booking);
    s.notifications.unshift({
      id: `ntf_${Date.now().toString(36)}`,
      kind: "booking",
      title: "Booking created",
      body: `We received your booking ${booking.reference} for ${service.name}.`,
      at: now,
      read: false,
      href: `/bookings/${booking.id}`,
    });
    persist();
    return { ...booking };
  },

  async cancelBooking(id) {
    await wait(500);
    const s = requireAuth();
    const booking = s.bookings.find((b) => b.id === id);
    if (!booking) throw new RepositoryError("NOT_FOUND", "Booking not found.");
    const cancellable = ["PENDING", "CONFIRMED", "TECHNICIAN_ASSIGNED"];
    if (!cancellable.includes(booking.status)) {
      throw new RepositoryError("CONFLICT", "This booking can no longer be cancelled.");
    }
    const now = new Date().toISOString();
    booking.status = "CANCELLED";
    booking.statusHistory.push({ status: "CANCELLED", at: now, note: "Cancelled by customer" });
    s.notifications.unshift({
      id: `ntf_${Date.now().toString(36)}`,
      kind: "booking",
      title: "Booking cancelled",
      body: `${booking.reference} has been cancelled.`,
      at: now,
      read: false,
      href: `/bookings/${booking.id}`,
    });
    persist();
    return { ...booking };
  },

  async submitReview(id, review) {
    await wait(450);
    const s = requireAuth();
    const booking = s.bookings.find((b) => b.id === id);
    if (!booking) throw new RepositoryError("NOT_FOUND", "Booking not found.");
    if (booking.status !== "COMPLETED") {
      throw new RepositoryError("CONFLICT", "Reviews are only available for completed bookings.");
    }
    if (s.reviewByBooking[id]) {
      throw new RepositoryError("CONFLICT", "You have already reviewed this booking.");
    }
    if (review.rating < 1 || review.rating > 5) {
      throw new RepositoryError("VALIDATION", "Choose a rating from 1 to 5.");
    }
    const at = new Date().toISOString();
    booking.review = { ...review, at };
    s.reviewByBooking[id] = { ...review, at };
    persist();
    return { ...booking };
  },

  async listNotifications() {
    await wait(250);
    const s = db();
    return s.notifications.map((n) => ({ ...n }));
  },

  async markNotificationRead(id) {
    await wait(120);
    const s = db();
    const n = s.notifications.find((x) => x.id === id);
    if (n) n.read = true;
    persist();
  },

  async markAllNotificationsRead() {
    await wait(200);
    const s = db();
    s.notifications.forEach((n) => {
      n.read = true;
    });
    persist();
  },
};

export function resetDevStore(): void {
  store = seedStore();
  persist();
}
