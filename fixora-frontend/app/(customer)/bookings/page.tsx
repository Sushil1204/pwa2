"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { BookingCard } from "@/components/bookings/BookingCard";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { LinkButton } from "@/components/ui/Button";
import { useApp } from "@/components/providers/AppProviders";
import { isUpcoming } from "@/components/bookings/BookingStatusBadge";
import type { BookingTab } from "@/lib/types";

const tabs: { id: BookingTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const { status, authenticated, bookings, refreshPrivate } = useApp();
  const [tab, setTab] = useState<BookingTab>("upcoming");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authenticated) {
      refreshPrivate().catch(() => setError(true));
    }
  }, [authenticated, refreshPrivate, reloadKey]);

  const filtered = useMemo(() => {
    if (tab === "upcoming") return bookings.filter((b) => isUpcoming(b.status));
    if (tab === "completed") return bookings.filter((b) => b.status === "COMPLETED");
    return bookings.filter((b) => b.status === "CANCELLED" || b.status === "REJECTED");
  }, [bookings, tab]);

  if (status === "loading") {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="My bookings" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="mt-4 h-28 rounded-xl" />
        <Skeleton className="mt-3 h-28 rounded-xl" />
      </PageContainer>
    );
  }

  if (!authenticated) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="My bookings" />
        <EmptyState
          icon={CalendarCheck}
          title="Sign in to see your bookings"
          body="Verify your mobile number to view upcoming and past services."
          action={<LinkButton href="/auth?next=/bookings">Sign in</LinkButton>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader title="My bookings" />

      <div
        role="tablist"
        aria-label="Booking status"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-body-sm-strong transition-colors ${
              tab === t.id
                ? "bg-primary text-on-primary"
                : "bg-canvas text-ink hover:bg-canvas-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {error ? (
          <ErrorState
            body="We couldn't load your bookings."
            onRetry={() => {
              setError(false);
              setReloadKey((k) => k + 1);
            }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={
              tab === "upcoming"
                ? "No upcoming bookings"
                : tab === "completed"
                  ? "No completed bookings yet"
                  : "No cancelled bookings"
            }
            body={
              tab === "upcoming"
                ? "When you book a service it will show up here."
                : tab === "completed"
                  ? "Finished jobs and your reviews live here."
                  : "Cancelled or rejected bookings are kept here for reference."
            }
            action={
              tab === "upcoming" ? (
                <LinkButton href="/services">Browse services</LinkButton>
              ) : undefined
            }
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((b) => (
              <li key={b.id}>
                <BookingCard booking={b} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
