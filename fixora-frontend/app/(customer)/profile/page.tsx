"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  CalendarCheck,
  Mail,
  Pencil,
  Phone,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";
import { formatRelativeTime } from "@/lib/format";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    status,
    authenticated,
    profile,
    unreadCount,
    sessions,
    logout,
    revokeSession,
    requestAccountDeletion,
    refreshPrivate,
  } = useApp();

  const [showSessions, setShowSessions] = useState(false);
  const [signOutBusy, setSignOutBusy] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [deletionBusy, setDeletionBusy] = useState(false);
  const [deletionDone, setDeletionDone] = useState(false);
  const [deletionError, setDeletionError] = useState("");
  const [revokeError, setRevokeError] = useState("");

  useEffect(() => {
    if (status === "ready" && !authenticated) {
      router.replace("/auth?next=/profile");
    }
    if (authenticated) void refreshPrivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, authenticated]);

  if (status === "loading" || !authenticated || !profile) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Profile" />
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="mt-4 h-64 rounded-xl" />
      </PageContainer>
    );
  }

  async function handleSignOut() {
    setSignOutBusy(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setSignOutBusy(false);
    }
  }

  async function handleRevoke(id: string) {
    setRevokeError("");
    const res = await revokeSession(id);
    if (!res.ok) setRevokeError(res.error ?? "Could not revoke the session.");
  }

  async function handleDeletion() {
    setDeletionBusy(true);
    setDeletionError("");
    try {
      const res = await requestAccountDeletion();
      if (res.ok) {
        setDeletionOpen(false);
        setDeletionDone(true);
      } else {
        setDeletionError(res.error ?? "Could not submit the request.");
      }
    } finally {
      setDeletionBusy(false);
    }
  }

  const menu = [
    { href: "/bookings", label: "My bookings", icon: CalendarCheck },
    { href: "/profile/addresses", label: "My addresses", icon: MapPin },
    {
      href: "/notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount,
    },
    { href: "/legal#support", label: "Help & support", icon: HelpCircle },
    { href: "/legal#about", label: "About Fixora", icon: Shield },
    { href: "/legal#privacy", label: "Privacy policy", icon: FileText },
    { href: "/legal#terms", label: "Terms & conditions", icon: FileText },
  ];

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Profile" />

      {/* Identity */}
      <section className="relative overflow-hidden rounded-xl bg-[linear-gradient(150deg,#eef7eb_0%,#e3f2df_100%)] p-6 text-center shadow-card">
        {/* Corner patterns — palette pinned by the profile card direction */}
        <svg
          width="360"
          height="400"
          viewBox="0 0 360 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-20 h-64 w-72"
        >
          <ellipse cx="205" cy="200" rx="220" ry="200" fill="#EAF6DF" />
        </svg>
        <svg
          width="360"
          height="400"
          viewBox="0 0 360 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-72 rotate-180"
        >
          <ellipse cx="205" cy="200" rx="220" ry="200" fill="#EAF6DF" />
        </svg>

        <div className="relative">
          {/* Avatar */}
          <div className="relative mx-auto h-24 w-24">
            <span
              aria-hidden
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#c9e7c0] bg-white text-3xl font-black text-[#16703a]"
            >
              {initials(profile.name)}
            </span>
            <span
              aria-hidden
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#2f9e4f]"
            >
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </span>
          </div>

          <h1 className="mt-4 text-page-title text-ink">
            {profile.name}
          </h1>

          <p className="mt-3 flex items-center justify-center gap-2 text-body-sm text-body">
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            <span className="min-w-0 truncate">{profile.email}</span>
          </p>
          <p className="mt-1.5 flex items-center justify-center gap-2 text-body-sm text-body tnum">
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            <span className="min-w-0 truncate">{profile.phone}</span>
          </p>

          <hr className="my-5 border-t border-[#d9e6d5]" />

          <LinkButton
            href="/profile/edit"
            variant="tertiary"
            size="sm"
            className="rounded-full! font-bold!"
          >
            <Pencil className="h-4 w-4" aria-hidden />
            Edit Profile
          </LinkButton>
        </div>
      </section>

      {/* Menu */}
      <nav aria-label="Profile sections" className="mt-4">
        <ul className="divide-y divide-canvas-soft overflow-hidden rounded-xl bg-canvas shadow-card">
          {menu.map(({ href, label, icon: Icon, badge }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-canvas-soft/50"
              >
                <Icon className="h-5 w-5 shrink-0 text-ink" aria-hidden />
                <span className="flex-1 text-body-sm text-ink">{label}</span>
                {badge ? (
                  <span
                    aria-label={`${badge} unread`}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-negative px-1.5 text-caption text-canvas"
                  >
                    {badge}
                  </span>
                ) : null}
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-mute"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sessions */}
      <section className="mt-4 rounded-xl bg-canvas p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-body-md-strong text-ink">Active sessions</h2>
          <button
            type="button"
            onClick={() => setShowSessions((v) => !v)}
            aria-expanded={showSessions}
            className="text-body-sm-strong text-ink underline-offset-4 hover:underline"
          >
            {showSessions ? "Hide" : "Manage"}
          </button>
        </div>
        {revokeError && (
          <p role="alert" className="mt-2 text-body-sm text-negative-darkest">
            {revokeError}
          </p>
        )}
        {showSessions && (
          <ul className="mt-3 space-y-3">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 border-t border-canvas-soft pt-3 first:border-0 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-body-sm text-ink">{s.device}</p>
                  <p className="text-caption text-mute">
                    {s.current ? "This device · " : ""}
                    Active {formatRelativeTime(s.lastActiveAt)}
                  </p>
                </div>
                {!s.current && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(s.id)}
                    className="text-body-sm-strong text-negative-darkest underline-offset-4 hover:underline"
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Account actions */}
      <div className="mt-4 flex flex-col gap-3">
        <Button
          variant="secondary"
          onClick={handleSignOut}
          loading={signOutBusy}
        >
          <LogOut className="h-5 w-5" aria-hidden />
          Sign out
        </Button>
        <button
          type="button"
          onClick={() => setDeletionOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-button-md text-negative-darkest transition-colors hover:bg-negative-bg/5"
        >
          <Trash2 className="h-5 w-5" aria-hidden />
          Request account deletion
        </button>
      </div>

      {deletionDone && (
        <p
          role="status"
          className="mt-3 rounded-md bg-primary-pale px-4 py-3 text-body-sm text-positive-deep"
        >
          Deletion request received. We&apos;ll contact you at {profile.phone}{" "}
          to confirm.
        </p>
      )}

      <ConfirmationDialog
        open={deletionOpen}
        title="Request account deletion?"
        body="Your profile, addresses and booking history will be scheduled for deletion. Bookings already completed may be retained for legal and accounting requirements."
        confirmLabel="Submit request"
        cancelLabel="Keep my account"
        destructive
        loading={deletionBusy}
        onConfirm={handleDeletion}
        onCancel={() => {
          setDeletionOpen(false);
          setDeletionError("");
        }}
      />
      {deletionError && (
        <p role="alert" className="mt-2 text-body-sm text-negative-darkest">
          {deletionError}
        </p>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 text-caption text-mute">
        <UserRound className="h-3.5 w-3.5" aria-hidden />
        Signed in as {profile.phone}
      </p>
    </PageContainer>
  );
}
