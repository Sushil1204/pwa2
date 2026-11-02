"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { repository, RepositoryError } from "@/lib/api";
import type {
  Address,
  AppNotification,
  Booking,
  Category,
  CustomerProfile,
  DeviceSession,
  Service,
} from "@/lib/types";
import type { CreateBookingInput } from "@/lib/api/repository";

type Status = "loading" | "ready";

interface ActionResult {
  ok: boolean;
  error?: string;
}

interface AppState {
  status: Status;
  authenticated: boolean;
  profile: CustomerProfile | null;
  categories: Category[];
  services: Service[];
  addresses: Address[];
  bookings: Booking[];
  notifications: AppNotification[];
  sessions: DeviceSession[];
}

const initialState: AppState = {
  status: "loading",
  authenticated: false,
  profile: null,
  categories: [],
  services: [],
  addresses: [],
  bookings: [],
  notifications: [],
  sessions: [],
};

interface AppStore extends AppState {
  unreadCount: number;
  sendOtp: (phone: string) => Promise<ActionResult>;
  verifyOtp: (phone: string, otp: string) => Promise<ActionResult>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<CustomerProfile, "name" | "email">>) => Promise<ActionResult>;
  saveAddress: (address: Omit<Address, "id"> & { id?: string }) => Promise<ActionResult>;
  deleteAddress: (id: string) => Promise<ActionResult>;
  setDefaultAddress: (id: string) => Promise<ActionResult>;
  createBooking: (input: CreateBookingInput) => Promise<{ ok: boolean; booking?: Booking; error?: string }>;
  cancelBooking: (id: string) => Promise<ActionResult>;
  submitReview: (id: string, review: { rating: number; comment: string }) => Promise<ActionResult>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  revokeSession: (id: string) => Promise<ActionResult>;
  requestAccountDeletion: () => Promise<ActionResult>;
  refreshPrivate: () => Promise<void>;
}

const StoreContext = createContext<AppStore | null>(null);

function toError(e: unknown): string {
  if (e instanceof RepositoryError) return e.message;
  if (e instanceof Error) return e.message;
  return "Something went wrong. Please try again.";
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const authRef = useRef(false);

  useEffect(() => {
    authRef.current = state.authenticated;
  }, [state.authenticated]);

  const refreshPrivate = useCallback(async () => {
    if (!authRef.current) {
      setState((s) => ({ ...s, addresses: [], bookings: [], notifications: [], sessions: [] }));
      return;
    }
    try {
      const [addresses, bookings, notifications, sessions] = await Promise.all([
        repository.listAddresses(),
        repository.listBookings(),
        repository.listNotifications(),
        repository.listSessions(),
      ]);
      setState((s) => ({ ...s, addresses, bookings, notifications, sessions }));
    } catch {
      /* private data unavailable — screens render their own error states on next action */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [session, categories, services] = await Promise.all([
          repository.getSession(),
          repository.listCategories(),
          repository.listServices(),
        ]);
        if (cancelled) return;
        authRef.current = session.authenticated;
        setState((s) => ({
          ...s,
          categories,
          services,
          authenticated: session.authenticated,
          profile: session.profile,
          status: "ready",
        }));
        if (session.authenticated) {
          await refreshPrivate();
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, status: "ready" }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshPrivate]);

  const sendOtp = useCallback(async (phone: string): Promise<ActionResult> => {
    try {
      await repository.sendOtp(phone);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string): Promise<ActionResult> => {
      try {
        const { profile } = await repository.verifyOtp(phone, otp);
        authRef.current = true;
        setState((s) => ({ ...s, authenticated: true, profile }));
        await refreshPrivate();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: toError(e) };
      }
    },
    [refreshPrivate],
  );

  const logout = useCallback(async () => {
    try {
      await repository.logout();
    } finally {
      authRef.current = false;
      setState((s) => ({
        ...s,
        authenticated: false,
        profile: null,
        addresses: [],
        bookings: [],
        notifications: [],
        sessions: [],
      }));
    }
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<CustomerProfile, "name" | "email">>): Promise<ActionResult> => {
      try {
        const profile = await repository.updateProfile(patch);
        setState((s) => ({ ...s, profile }));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: toError(e) };
      }
    },
    [],
  );

  const saveAddress = useCallback(
    async (address: Omit<Address, "id"> & { id?: string }): Promise<ActionResult> => {
      try {
        await repository.saveAddress(address);
        const addresses = await repository.listAddresses();
        setState((s) => ({ ...s, addresses }));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: toError(e) };
      }
    },
    [],
  );

  const deleteAddress = useCallback(async (id: string): Promise<ActionResult> => {
    try {
      await repository.deleteAddress(id);
      const addresses = await repository.listAddresses();
      setState((s) => ({ ...s, addresses }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  }, []);

  const setDefaultAddress = useCallback(async (id: string): Promise<ActionResult> => {
    try {
      await repository.setDefaultAddress(id);
      const addresses = await repository.listAddresses();
      setState((s) => ({ ...s, addresses }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  }, []);

  const createBooking = useCallback(
    async (input: CreateBookingInput): Promise<{ ok: boolean; booking?: Booking; error?: string }> => {
      try {
        const booking = await repository.createBooking(input);
        const [bookings, notifications] = await Promise.all([
          repository.listBookings(),
          repository.listNotifications(),
        ]);
        setState((s) => ({ ...s, bookings, notifications }));
        return { ok: true, booking };
      } catch (e) {
        return { ok: false, error: toError(e) };
      }
    },
    [],
  );

  const cancelBooking = useCallback(async (id: string): Promise<ActionResult> => {
    try {
      await repository.cancelBooking(id);
      const bookings = await repository.listBookings();
      setState((s) => ({ ...s, bookings }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  }, []);

  const submitReview = useCallback(
    async (id: string, review: { rating: number; comment: string }): Promise<ActionResult> => {
      try {
        await repository.submitReview(id, review);
        const bookings = await repository.listBookings();
        setState((s) => ({ ...s, bookings }));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: toError(e) };
      }
    },
    [],
  );

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await repository.markNotificationRead(id);
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    } catch {
      /* noop */
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await repository.markAllNotificationsRead();
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch {
      /* noop */
    }
  }, []);

  const revokeSession = useCallback(async (id: string): Promise<ActionResult> => {
    try {
      await repository.revokeSession(id);
      const sessions = await repository.listSessions();
      setState((s) => ({ ...s, sessions }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  }, []);

  const requestAccountDeletion = useCallback(async (): Promise<ActionResult> => {
    try {
      await repository.requestAccountDeletion();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  }, []);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  const value: AppStore = {
    ...state,
    unreadCount,
    sendOtp,
    verifyOtp,
    logout,
    updateProfile,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    createBooking,
    cancelBooking,
    submitReview,
    markNotificationRead,
    markAllNotificationsRead,
    revokeSession,
    requestAccountDeletion,
    refreshPrivate,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useApp(): AppStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useApp must be used within AppProviders");
  return ctx;
}
