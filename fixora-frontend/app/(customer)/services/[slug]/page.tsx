"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Check, Clock, ShieldCheck, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { LinkButton } from "@/components/ui/Button";
import { ServiceArt } from "@/components/illustrations/ServiceArt";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";
import { formatINR } from "@/lib/format";

function ServiceDetailContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { status, services, authenticated } = useApp();
  const loading = status === "loading";
  const service = services.find((s) => s.slug === params.slug || s.id === params.slug);

  if (loading) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Service details" backHref="/services" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="mt-4 h-8 w-2/3 rounded-lg" />
        <Skeleton className="mt-3 h-5 w-1/2 rounded-lg" />
        <Skeleton className="mt-6 h-40 rounded-xl" />
      </PageContainer>
    );
  }

  if (!service) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Service details" backHref="/services" />
        <ErrorState
          title="Service not found"
          body="This service may have been removed or the link is incorrect."
          onRetry={() => router.push("/services")}
        />
      </PageContainer>
    );
  }

  const bookHref = authenticated
    ? `/bookings/new?service=${service.slug}`
    : `/auth?next=${encodeURIComponent(`/bookings/new?service=${service.slug}`)}`;

  const priceLabel =
    service.pricingModel === "fixed"
      ? formatINR(service.pricePaise)
      : service.pricingModel === "custom_quote"
        ? "Custom quote"
        : `From ${formatINR(service.pricePaise)}`;

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Service details" backHref="/services" />

      <div className="overflow-hidden rounded-xl bg-canvas shadow-card">
        <div className="h-44 sm:h-56">
          <ServiceArt variant={service.illustration} className="h-full w-full" />
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="display-sm text-ink">{service.name}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-display-xs text-ink tnum">{priceLabel}</p>
            <p className="inline-flex items-center gap-1.5 text-body-sm text-body">
              <Clock className="h-4 w-4" aria-hidden />
              ~{Math.round(service.durationMins / 60) || 1} hr estimated
            </p>
            {service.pricingModel === "inspection" && (
              <p className="text-body-sm text-body tnum">
                Inspection fee {formatINR(service.inspectionFeePaise)}
              </p>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-body-md text-body">{service.longDescription}</p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-body-md-strong text-ink">What&apos;s included</h3>
              <ul className="mt-3 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-sm text-body">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-pale">
                      <Check className="h-3.5 w-3.5 text-positive-deep" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-body-md-strong text-ink">Not included</h3>
              <ul className="mt-3 space-y-2">
                {service.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-sm text-body">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-canvas-soft">
                      <X className="h-3.5 w-3.5 text-mute" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <dl className="mt-6 space-y-3 rounded-lg bg-canvas-soft p-4">
            <div>
              <dt className="text-body-sm-strong text-ink">Cancellation</dt>
              <dd className="text-body-sm text-body">{service.cancellationPolicy}</dd>
            </div>
            <div>
              <dt className="text-body-sm-strong text-ink">Warranty</dt>
              <dd className="text-body-sm text-body">{service.warrantyTerms}</dd>
            </div>
          </dl>

          <p className="mt-4 inline-flex items-center gap-2 text-body-sm text-positive-deep">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Admin-verified technicians only
          </p>
        </div>
      </div>

      <div className="sticky bottom-[calc(var(--bottom-nav-height)+12px+env(safe-area-inset-bottom))] z-30 mt-4 md:bottom-4">
        <LinkButton href={bookHref} className="w-full shadow-raised">
          Book Now
          <ArrowRight className="h-5 w-5" aria-hidden />
        </LinkButton>
      </div>
    </PageContainer>
  );
}

function ServiceDetailFallback() {
  return (
    <PageContainer className="pt-4">
      <PageHeader title="Service details" backHref="/services" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="mt-4 h-8 w-2/3 rounded-lg" />
      <Skeleton className="mt-6 h-40 rounded-xl" />
    </PageContainer>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={<ServiceDetailFallback />}>
      <ServiceDetailContent />
    </Suspense>
  );
}
