"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  Info,
  Tag,
  TicketCheck,
  ChevronRight,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { EmptyState, Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";
import { formatRelativeTime } from "@/lib/format";
import type { AppNotification, NotificationKind } from "@/lib/types";

const kindStyle: Record<
  NotificationKind,
  { icon: typeof TicketCheck; tile: string; label: string }
> = {
  booking: { icon: TicketCheck, tile: "bg-primary-pale", label: "Booking" },
  offer: { icon: Tag, tile: "bg-accent-orange/40", label: "Offer" },
  system: { icon: Info, tile: "bg-accent-cyan/30", label: "System" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const {
    status,
    authenticated,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    refreshPrivate,
  } = useApp();
  const [busyAll, setBusyAll] = useState(false);

  useEffect(() => {
    if (authenticated) void refreshPrivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  async function open(n: AppNotification) {
    if (!n.read) await markNotificationRead(n.id);
    if (n.href) router.push(n.href);
  }

  async function markAll() {
    setBusyAll(true);
    try {
      await markAllNotificationsRead();
    } finally {
      setBusyAll(false);
    }
  }

  if (status === "loading") {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Notifications" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="mt-3 h-20 rounded-xl" />
        <Skeleton className="mt-3 h-20 rounded-xl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader
        title="Notifications"
        right={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAll}
              disabled={busyAll}
              className="text-body-sm-strong text-ink underline-offset-4 hover:underline disabled:opacity-50"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={BellRing}
          title="No notifications"
          body="Booking updates and offers will appear here."
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => {
            const { icon: Icon, tile, label } = kindStyle[n.kind];
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => open(n)}
                  className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition-colors ${
                    n.read ? "bg-canvas" : "bg-canvas shadow-card"
                  } hover:bg-canvas-soft/60`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tile}`}
                  >
                    <Icon className="h-5 w-5 text-ink" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-body-sm-strong text-ink">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span
                          aria-label="Unread"
                          className="h-2 w-2 shrink-0 rounded-full bg-negative"
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block text-body-sm text-body">{n.body}</span>
                    <span className="mt-1 flex items-center gap-2 text-caption text-mute">
                      <span>{label}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={n.at}>{formatRelativeTime(n.at)}</time>
                    </span>
                  </span>
                  {n.href && (
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-mute" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!authenticated && notifications.length > 0 && (
        <p className="mt-4 text-center text-caption text-mute">
          Sign in to sync notifications across devices.
        </p>
      )}
    </PageContainer>
  );
}
