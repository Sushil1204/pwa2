"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, ShieldCheck, Star } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { BookingStatusBadge, isCancellable } from "@/components/bookings/BookingStatusBadge";
import { BookingTimeline } from "@/components/bookings/BookingTimeline";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { FormField, TextArea } from "@/components/ui/FormField";
import { ServiceArt } from "@/components/illustrations/ServiceArt";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";
import { formatDateLong, formatINR } from "@/lib/format";

function BookingDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    status,
    authenticated,
    bookings,
    cancelBooking,
    submitReview,
    refreshPrivate,
  } = useApp();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  const booking = bookings.find((b) => b.id === params.id);

  useEffect(() => {
    if (status === "ready" && !authenticated) {
      router.replace(`/auth?next=/bookings/${params.id}`);
    }
  }, [status, authenticated, router, params.id]);

  useEffect(() => {
    if (authenticated) void refreshPrivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (status === "loading" || (authenticated && !booking)) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Booking details" backHref="/bookings" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="mt-4 h-44 rounded-xl" />
        <Skeleton className="mt-4 h-40 rounded-xl" />
      </PageContainer>
    );
  }

  if (!authenticated || !booking) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Booking details" backHref="/bookings" />
        <ErrorState
          title="Booking not found"
          body="This booking doesn't exist or you don't have access to it."
          onRetry={() => router.push("/bookings")}
        />
      </PageContainer>
    );
  }

  async function handleCancel() {
    setCancelling(true);
    setCancelError("");
    try {
      const res = await cancelBooking(booking!.id);
      if (res.ok) {
        setDialogOpen(false);
      } else {
        setCancelError(res.error ?? "Could not cancel this booking.");
      }
    } finally {
      setCancelling(false);
    }
  }

  async function handleReviewSubmit() {
    setReviewError("");
    if (comment.trim().length < 3) {
      setReviewError("Write a few words about the service.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await submitReview(booking!.id, { rating, comment: comment.trim() });
      if (res.ok) {
        setReviewOpen(false);
        setReviewDone(true);
        setComment("");
      } else {
        setReviewError(res.error ?? "Could not submit the review.");
      }
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Booking details" backHref="/bookings" />

      {/* Summary */}
      <div className="rounded-xl bg-canvas p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md">
              <ServiceArt variant={booking.illustration} className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <h1 className="text-body-md-strong text-ink [overflow-wrap:anywhere]">
                {booking.serviceName}
              </h1>
              <p className="mt-0.5 text-body-sm text-body">
                {formatDateLong(booking.scheduledDate)} · {booking.timeSlot}
              </p>
              <p className="mt-0.5 text-caption text-mute tnum">{booking.reference}</p>
            </div>
          </div>
          <span className="shrink-0">
            <BookingStatusBadge status={booking.status} />
          </span>
        </div>
      </div>

      {/* Technician */}
      {booking.technician && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-canvas p-4 shadow-card">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-body-md-strong text-on-primary"
            style={{
              background: `hsl(${booking.technician.hue} 45% 72%)`,
            }}
          >
            {booking.technician.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-body-md-strong text-ink">
              {booking.technician.name}
              {booking.technician.verified && (
                <ShieldCheck className="h-4 w-4 text-positive" aria-label="Verified technician" />
              )}
            </p>
            <p className="text-body-sm text-body">
              Verified technician · {booking.technician.jobsCompleted} jobs
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${booking.technician.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${booking.technician.name}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary-active"
            >
              <Phone className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>
      )}

      {/* Address */}
      <div className="mt-3 rounded-xl bg-canvas p-4 shadow-card">
        <h2 className="text-body-md-strong text-ink">Service address</h2>
        <p className="mt-2 text-body-sm text-body">
          {booking.address.line1}
          {booking.address.line2 ? `, ${booking.address.line2}` : ""}
          <br />
          {booking.address.city}, {booking.address.state} {booking.address.pincode}
        </p>
        {booking.notes && (
          <>
            <h3 className="mt-4 text-body-sm-strong text-ink">Your notes</h3>
            <p className="mt-1 text-body-sm text-body">{booking.notes}</p>
          </>
        )}
      </div>

      {/* Price */}
      <div className="mt-3 rounded-xl bg-canvas p-4 shadow-card">
        <h2 className="text-body-md-strong text-ink">Price breakdown</h2>
        <dl className="mt-3 space-y-2">
          <div className="flex justify-between text-body-sm">
            <dt className="text-body">Service charge</dt>
            <dd className="tnum text-ink">{formatINR(booking.price.servicePaise)}</dd>
          </div>
          {booking.price.inspectionPaise > 0 && (
            <div className="flex justify-between text-body-sm">
              <dt className="text-body">Inspection fee</dt>
              <dd className="tnum text-ink">{formatINR(booking.price.inspectionPaise)}</dd>
            </div>
          )}
          <div className="flex justify-between text-body-sm">
            <dt className="text-body">Convenience fee</dt>
            <dd className="tnum text-ink">{formatINR(booking.price.conveniencePaise)}</dd>
          </div>
          <div className="flex justify-between text-body-sm">
            <dt className="text-body">Taxes</dt>
            <dd className="tnum text-ink">{formatINR(booking.price.taxPaise)}</dd>
          </div>
          {booking.price.discountPaise > 0 && (
            <div className="flex justify-between text-body-sm">
              <dt className="text-body">Discount</dt>
              <dd className="tnum text-positive-deep">
                −{formatINR(booking.price.discountPaise)}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-canvas-soft pt-2 text-body-md-strong">
            <dt className="text-ink">Total</dt>
            <dd className="tnum text-ink">{formatINR(booking.price.totalPaise)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-caption text-mute">
          Payment:{" "}
          {booking.paymentStatus === "paid"
            ? "Paid"
            : booking.paymentMethod === "upi"
              ? "UPI — pending confirmation"
              : "Pay after service"}
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-3">
        <BookingTimeline booking={booking} />
      </div>

      {/* Review */}
      {booking.status === "COMPLETED" && (
        <div className="mt-3 rounded-xl bg-canvas p-4 shadow-card">
          <h2 className="text-body-md-strong text-ink">Your review</h2>
          {booking.review ? (
            <div className="mt-2">
              <div className="flex gap-0.5" aria-label={`${booking.review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < booking.review!.rating ? "fill-warning text-warning" : "text-canvas-soft"}`}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-2 text-body-sm text-body">{booking.review.comment}</p>
            </div>
          ) : reviewDone ? (
            <p className="mt-2 text-body-sm text-positive-deep">Thanks — your review is submitted.</p>
          ) : reviewOpen ? (
            <div className="mt-3 space-y-3">
              <div>
                <span id="rating-label" className="text-body-sm-strong text-ink">
                  Rating
                </span>
                <div className="mt-1 flex gap-1" role="group" aria-labelledby="rating-label">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={rating === n}
                      onClick={() => setRating(n)}
                      className="rounded p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${n <= rating ? "fill-warning text-warning" : "text-canvas-soft"}`}
                        aria-hidden
                      />
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Comment" required error={reviewError}>
                {(p) => (
                  <TextArea
                    {...p}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the service?"
                  />
                )}
              </FormField>
              <div className="flex gap-3">
                <Button onClick={handleReviewSubmit} loading={submittingReview} className="flex-1">
                  Submit review
                </Button>
                <Button variant="secondary" onClick={() => setReviewOpen(false)} disabled={submittingReview}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" className="mt-2" onClick={() => setReviewOpen(true)}>
              Rate this service
            </Button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3">
        {isCancellable(booking.status) && (
          <Button variant="tertiary" onClick={() => setDialogOpen(true)}>
            Cancel booking
          </Button>
        )}
        <LinkButton href="/services" variant="secondary">
          Book another service
        </LinkButton>
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title="Cancel this booking?"
        body={`Your booking ${booking.reference} for ${formatDateLong(booking.scheduledDate)} will be cancelled. This cannot be undone.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => {
          setDialogOpen(false);
          setCancelError("");
        }}
      />
      {cancelError && (
        <p role="alert" className="mt-2 text-body-sm text-negative-darkest">
          {cancelError}
        </p>
      )}
    </PageContainer>
  );
}

function BookingDetailFallback() {
  return (
    <PageContainer className="pt-4">
      <PageHeader title="Booking details" backHref="/bookings" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="mt-4 h-44 rounded-xl" />
      <Skeleton className="mt-4 h-40 rounded-xl" />
    </PageContainer>
  );
}

export default function BookingDetailPage() {
  return (
    <Suspense fallback={<BookingDetailFallback />}>
      <BookingDetailContent />
    </Suspense>
  );
}
