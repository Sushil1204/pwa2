import type { PriceBreakdown, Service } from "@/lib/types";

/**
 * Client-side price ESTIMATE for display before confirmation.
 * The backend remains the source of truth — the confirmed
 * breakdown returned by POST /bookings replaces this estimate.
 */
export function estimatePrice(service: Service): PriceBreakdown {
  const servicePaise = service.pricePaise;
  const inspectionPaise = service.pricingModel === "inspection" ? service.inspectionFeePaise : 0;
  const conveniencePaise = 4900;
  const discountPaise = 0;
  const taxPaise = Math.round((servicePaise + inspectionPaise) * 0.18);
  const totalPaise =
    servicePaise + inspectionPaise + conveniencePaise + taxPaise - discountPaise;
  return {
    servicePaise,
    inspectionPaise,
    conveniencePaise,
    taxPaise,
    discountPaise,
    totalPaise,
    currency: "INR",
  };
}
