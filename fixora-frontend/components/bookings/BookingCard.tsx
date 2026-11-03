import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { ServiceArt } from "@/components/illustrations/ServiceArt";
import { BookingStatusBadge, isUpcoming } from "@/components/bookings/BookingStatusBadge";
import { formatDateLong } from "@/lib/format";
import type { Booking } from "@/lib/types";

export function BookingCard({ booking }: { booking: Booking }) {
  return (
    <article className="rounded-xl bg-canvas p-4 shadow-card">
      <div className="flex gap-3">
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md">
          <ServiceArt variant={booking.illustration} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 [overflow-wrap:anywhere] text-body-md-strong text-ink">{booking.serviceName}</h3>
            <span className="shrink-0"><BookingStatusBadge status={booking.status} /></span>
          </div>
          <p className="mt-1 text-body-sm text-body">
            {formatDateLong(booking.scheduledDate)} · {booking.timeSlot}
          </p>
          <p className="mt-0.5 text-caption text-mute tnum">{booking.reference}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-canvas-soft pt-3">
        {booking.status === "COMPLETED" ? (
          <span className="inline-flex items-center gap-1.5 text-body-sm text-positive-deep">
            <Check className="h-4 w-4" aria-hidden />
            {booking.review ? "Reviewed" : "Ready to review"}
          </span>
        ) : isUpcoming(booking.status) ? (
          <span className="text-body-sm text-body">
            {booking.technician ? `With ${booking.technician.name}` : "Technician being assigned"}
          </span>
        ) : (
          <span className="text-body-sm text-body">No longer active</span>
        )}
        <Link
          href={`/bookings/${booking.id}`}
          className="inline-flex items-center gap-1 text-body-sm-strong text-ink underline-offset-4 hover:underline"
        >
          View details
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
