"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button, LinkButton } from "@/components/ui/Button";
import { FormField, TextArea, TextField } from "@/components/ui/FormField";
import { ServiceArt } from "@/components/illustrations/ServiceArt";
import { EmptyState, Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";
import { estimatePrice } from "@/lib/pricing";
import { TIME_SLOTS, formatDateLong, formatINR, nextDays } from "@/lib/format";
import type { Address, Booking } from "@/lib/types";

type Step = "form" | "success";

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    status,
    authenticated,
    services,
    addresses,
    createBooking,
    saveAddress,
  } = useApp();

  const serviceSlug = searchParams.get("service");
  const service = services.find((s) => s.slug === serviceSlug || s.id === serviceSlug);

  const [addressId, setAddressId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pay_after_service" | "upi">(
    "pay_after_service",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const days = useMemo(() => nextDays(5), []);
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const effectiveAddressId = addressId || defaultAddress?.id || "";
  const effectiveDate = date || days[0]?.iso || "";

  useEffect(() => {
    if (status === "ready" && !authenticated) {
      const next = encodeURIComponent(
        `/bookings/new${serviceSlug ? `?service=${serviceSlug}` : ""}`,
      );
      router.replace(`/auth?next=${next}`);
    }
  }, [status, authenticated, router, serviceSlug]);

  if (status === "loading") {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Book Service" backHref="/services" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="mt-4 h-32 rounded-xl" />
        <Skeleton className="mt-4 h-40 rounded-xl" />
      </PageContainer>
    );
  }

  if (!authenticated) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Book Service" backHref="/services" />
        <EmptyState
          icon={ShieldCheck}
          title="Sign in to book"
          body="You need to verify your mobile number before creating a booking."
          action={<LinkButton href="/auth">Sign in</LinkButton>}
        />
      </PageContainer>
    );
  }

  if (!service) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Book Service" backHref="/services" />
        <EmptyState
          title="Choose a service"
          body="Start from the service catalogue to book a repair."
          action={<LinkButton href="/services">Browse services</LinkButton>}
        />
      </PageContainer>
    );
  }

  const price = estimatePrice(service);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!effectiveAddressId) next.address = "Select a service address.";
    if (!effectiveDate) next.date = "Choose a date.";
    if (!slot) next.slot = "Choose a time slot.";
    if (notes.length > 500) next.notes = "Keep notes under 500 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await createBooking({
        serviceId: service!.id,
        addressId: effectiveAddressId,
        scheduledDate: effectiveDate,
        timeSlot: slot,
        notes: notes.trim() || undefined,
        paymentMethod,
      });
      if (result.ok && result.booking) {
        setBooking(result.booking);
        setStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setFormError(result.error ?? "Could not create the booking.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveAddress() {
    setFormError("");
    const next: Record<string, string> = {};
    if (!newAddress.label.trim()) next.nlabel = "Give this address a label.";
    if (!newAddress.line1.trim()) next.nline1 = "Enter the street address.";
    if (!newAddress.city.trim()) next.ncity = "Enter the city.";
    if (!newAddress.state.trim()) next.nstate = "Enter the state.";
    if (!/^\d{6}$/.test(newAddress.pincode.trim())) next.npin = "PIN code must be 6 digits.";
    setErrors((e) => ({ ...e, ...next }));
    if (Object.keys(next).length) return;

    setSavingAddress(true);
    try {
      const res = await saveAddress({
        label: newAddress.label.trim(),
        line1: newAddress.line1.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pincode: newAddress.pincode.trim(),
        isDefault: addresses.length === 0,
      });
      if (res.ok) {
        setShowAddAddress(false);
        setNewAddress({ label: "", line1: "", city: "", state: "", pincode: "" });
        setErrors((e) => {
          const { nlabel, nline1, ncity, nstate, npin, ...rest } = e;
          void nlabel;
          void nline1;
          void ncity;
          void nstate;
          void npin;
          return rest;
        });
      } else {
        setFormError(res.error ?? "Could not save the address.");
      }
    } finally {
      setSavingAddress(false);
    }
  }

  if (step === "success" && booking) {
    return (
      <PageContainer className="pt-4" padBottom={false}>
        <div className="mx-auto flex max-w-md flex-col items-center pt-6 text-center">
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-pale">
            <CheckCircle2 className="h-14 w-14 text-positive" aria-hidden strokeWidth={2.2} />
          </span>
          <h1 className="display-md mt-6 text-ink">Booking confirmed!</h1>
          <p className="mt-3 text-body-lg text-body">
            Your service has been booked successfully. We&apos;ll notify you when a
            technician is assigned.
          </p>

          <dl className="mt-6 w-full space-y-3 rounded-xl bg-canvas p-5 text-left shadow-card">
            <div className="flex items-center justify-between gap-3">
              <dt className="inline-flex items-center gap-2 text-body-sm text-body">
                <Calendar className="h-4 w-4" aria-hidden />
                Booking ID
              </dt>
              <dd className="text-body-md-strong text-ink tnum">{booking.reference}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="inline-flex items-center gap-2 text-body-sm text-body">
                <Clock className="h-4 w-4" aria-hidden />
                Date &amp; time
              </dt>
              <dd className="text-body-sm-strong text-ink">
                {formatDateLong(booking.scheduledDate)} · {booking.timeSlot}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="inline-flex items-center gap-2 text-body-sm text-body">
                <MapPin className="h-4 w-4" aria-hidden />
                Address
              </dt>
              <dd className="max-w-[60%] text-right text-body-sm text-ink">
                {booking.address.line1}, {booking.address.pincode}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex w-full flex-col gap-3">
            <LinkButton href={`/bookings/${booking.id}`} variant="dark">
              View booking details
            </LinkButton>
            <LinkButton href="/" variant="tertiary">
              Back to home
            </LinkButton>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Book Service" backHref={`/services/${service.slug}`} />

      {/* Service summary */}
      <div className="flex items-center gap-3 rounded-xl bg-canvas p-3 shadow-card">
        <div className="h-14 w-16 shrink-0 overflow-hidden rounded-md">
          <ServiceArt variant={service.illustration} className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-body-md-strong text-ink">{service.name}</p>
          <p className="text-body-sm text-body tnum">
            {service.pricingModel === "fixed" ? "" : "From "}
            {formatINR(service.pricePaise)}
          </p>
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-4 rounded-md bg-negative-bg px-4 py-3 text-body-sm text-canvas">
          {formError}
        </p>
      )}

      {/* Address */}
      <section aria-labelledby="addr-heading" className="mt-6">
        <h2 id="addr-heading" className="text-body-md-strong text-ink">
          Service address
        </h2>
        {errors.address && (
          <p role="alert" className="mt-1 text-body-sm text-negative-darkest">
            {errors.address}
          </p>
        )}
        <div className="mt-3 space-y-2">
          {addresses.map((a: Address) => (
            <label
              key={a.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                effectiveAddressId === a.id
                  ? "border-ink bg-primary-pale"
                  : "border-canvas-soft bg-canvas hover:border-mute"
              }`}
            >
              <input
                type="radio"
                name="address"
                value={a.id}
                checked={effectiveAddressId === a.id}
                onChange={() => setAddressId(a.id)}
                className="mt-1 h-4 w-4 accent-[#0e0f0c]"
              />
              <span className="min-w-0">
                <span className="block text-body-sm-strong text-ink">{a.label}</span>
                <span className="block text-body-sm text-body">
                  {a.line1}, {a.city} {a.state} {a.pincode}
                </span>
              </span>
            </label>
          ))}
        </div>
        {!showAddAddress ? (
          <button
            type="button"
            onClick={() => setShowAddAddress(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-body-sm-strong text-ink underline-offset-4 hover:underline"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add new address
          </button>
        ) : (
          <div className="mt-3 space-y-3 rounded-xl bg-canvas p-4 shadow-card">
            <FormField label="Label" required error={errors.nlabel}>
              {(p) => (
                <TextField
                  {...p}
                  placeholder="Home, Office…"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress((s) => ({ ...s, label: e.target.value }))}
                />
              )}
            </FormField>
            <FormField label="Street address" required error={errors.nline1}>
              {(p) => (
                <TextField
                  {...p}
                  placeholder="123 Main Street"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress((s) => ({ ...s, line1: e.target.value }))}
                />
              )}
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="City" required error={errors.ncity}>
                {(p) => (
                  <TextField
                    {...p}
                    value={newAddress.city}
                    onChange={(e) => setNewAddress((s) => ({ ...s, city: e.target.value }))}
                  />
                )}
              </FormField>
              <FormField label="State" required error={errors.nstate}>
                {(p) => (
                  <TextField
                    {...p}
                    value={newAddress.state}
                    onChange={(e) => setNewAddress((s) => ({ ...s, state: e.target.value }))}
                  />
                )}
              </FormField>
            </div>
            <FormField label="PIN code" required error={errors.npin}>
              {(p) => (
                <TextField
                  {...p}
                  inputMode="numeric"
                  maxLength={6}
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress((s) => ({ ...s, pincode: e.target.value }))}
                />
              )}
            </FormField>
            <div className="flex gap-3">
              <Button onClick={handleSaveAddress} loading={savingAddress} className="flex-1">
                Save address
              </Button>
              <Button variant="secondary" onClick={() => setShowAddAddress(false)} disabled={savingAddress}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Date */}
      <section aria-labelledby="date-heading" className="mt-6">
        <h2 id="date-heading" className="text-body-md-strong text-ink">
          Select date
        </h2>
        {errors.date && (
          <p role="alert" className="mt-1 text-body-sm text-negative-darkest">
            {errors.date}
          </p>
        )}
        <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          <div className="flex w-max gap-2">
            {days.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDate(d.iso)}
                aria-pressed={effectiveDate === d.iso}
                className={`flex min-w-16 flex-col items-center gap-0.5 rounded-md border px-3 py-2.5 transition-colors ${
                  effectiveDate === d.iso
                    ? "border-ink bg-primary text-on-primary"
                    : "border-canvas-soft bg-canvas text-ink hover:border-mute"
                }`}
              >
                <span className="text-caption">{d.dayLabel}</span>
                <span className="text-body-sm-strong tnum">{d.dateLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Time */}
      <section aria-labelledby="time-heading" className="mt-6">
        <h2 id="time-heading" className="text-body-md-strong text-ink">
          Select time
        </h2>
        {errors.slot && (
          <p role="alert" className="mt-1 text-body-sm text-negative-darkest">
            {errors.slot}
          </p>
        )}
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSlot(t)}
              aria-pressed={slot === t}
              className={`rounded-md border px-2 py-2.5 text-body-sm-strong transition-colors ${
                slot === t
                  ? "border-ink bg-primary text-on-primary"
                  : "border-canvas-soft bg-canvas text-ink hover:border-mute"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section aria-labelledby="notes-heading" className="mt-6">
        <h2 id="notes-heading" className="mb-3 text-body-md-strong text-ink">
          Issue description
        </h2>
        <FormField
          label="Notes for the technician"
          optional
          error={errors.notes}
          hint="Describe the problem — e.g. “Kitchen sink draining slowly”."
        >
          {(p) => (
            <TextArea
              {...p}
              placeholder="Any special instructions…"
              value={notes}
              maxLength={500}
              onChange={(e) => setNotes(e.target.value)}
            />
          )}
        </FormField>
      </section>

      {/* Price estimate */}
      <section aria-labelledby="price-heading" className="mt-6">
        <h2 id="price-heading" className="text-body-md-strong text-ink">
          Price estimate
        </h2>
        <dl className="mt-3 space-y-2 rounded-xl bg-canvas p-4 shadow-card">
          <div className="flex justify-between text-body-sm">
            <dt className="text-body">Service charge</dt>
            <dd className="text-ink tnum">{formatINR(price.servicePaise)}</dd>
          </div>
          {price.inspectionPaise > 0 && (
            <div className="flex justify-between text-body-sm">
              <dt className="text-body">Inspection fee</dt>
              <dd className="text-ink tnum">{formatINR(price.inspectionPaise)}</dd>
            </div>
          )}
          <div className="flex justify-between text-body-sm">
            <dt className="text-body">Convenience fee</dt>
            <dd className="text-ink tnum">{formatINR(price.conveniencePaise)}</dd>
          </div>
          <div className="flex justify-between text-body-sm">
            <dt className="text-body">Taxes (18% GST)</dt>
            <dd className="text-ink tnum">{formatINR(price.taxPaise)}</dd>
          </div>
          <div className="flex justify-between border-t border-canvas-soft pt-2 text-body-md-strong">
            <dt className="text-ink">Estimated total</dt>
            <dd className="text-ink tnum">{formatINR(price.totalPaise)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-caption text-mute">
          Final amounts are confirmed by the Fixora backend before any charge.
          Additional work always needs your explicit approval.
        </p>
      </section>

      {/* Payment method */}
      <section aria-labelledby="pay-heading" className="mt-6">
        <h2 id="pay-heading" className="text-body-md-strong text-ink">
          Payment preference
        </h2>
        <div className="mt-3 space-y-2">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
              paymentMethod === "pay_after_service" ? "border-ink bg-primary-pale" : "border-canvas-soft bg-canvas"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "pay_after_service"}
              onChange={() => setPaymentMethod("pay_after_service")}
              className="mt-1 h-4 w-4 accent-[#0e0f0c]"
            />
            <span>
              <span className="block text-body-sm-strong text-ink">Pay after service</span>
              <span className="block text-body-sm text-body">
                Settle up once the job is completed.
              </span>
            </span>
          </label>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
              paymentMethod === "upi" ? "border-ink bg-primary-pale" : "border-canvas-soft bg-canvas"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
              className="mt-1 h-4 w-4 accent-[#0e0f0c]"
            />
            <span>
              <span className="block text-body-sm-strong text-ink">UPI on confirmation</span>
              <span className="block text-body-sm text-body">
                Pay online when the booking is confirmed — gateway connects at launch.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Confirm */}
      <section aria-labelledby="confirm-heading" className="mt-6">
        <div className="rounded-xl bg-primary-pale p-5 text-center">
          <h2 id="confirm-heading" className="text-body-md-strong text-ink">
            Confirm your booking
          </h2>
          <p className="mx-auto mt-1 max-w-xs text-body-sm text-body">
            You&apos;ll receive a confirmation as soon as a technician is assigned.
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          loading={submitting}
          disabled={!effectiveAddressId || !effectiveDate || !slot}
          className="mt-4 w-full shadow-raised"
        >
          Confirm booking
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Button>
        <p className="mt-3 text-center text-caption text-mute">
          By confirming you agree to the cancellation policy:{" "}
          <Link href="/legal/cancellation" className="underline underline-offset-2">
            view terms
          </Link>
          .
        </p>
      </section>
    </PageContainer>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="pt-4">
          <PageHeader title="Book Service" backHref="/services" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="mt-4 h-40 rounded-xl" />
        </PageContainer>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
