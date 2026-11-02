import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Legal & support",
};

const sections = [
  {
    id: "about",
    title: "About Fixora",
    body: [
      "Fixora is a repair-services marketplace connecting customers with verified technicians for plumbing, electrical, appliance, AC, cleaning and painting work.",
      "This build is the customer portal running on development data. Catalogue, prices and bookings shown in the app are synthetic until the Fixora API is connected.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy policy",
    body: [
      "We collect your name, mobile number, email (optional), service addresses and booking history to provide the service.",
      "Payment card data is never stored by Fixora — payments are processed by the payment gateway.",
      "You can request account deletion from Profile → Request account deletion. Deleted accounts are removed according to our retention schedule.",
      "This development build stores data only in your browser's local storage and does not transmit it to a server.",
    ],
  },
  {
    id: "terms",
    title: "Terms of service",
    body: [
      "Bookings are confirmed only when Fixora assigns a technician. Prices shown before confirmation are estimates; the confirmed breakdown from the backend is authoritative.",
      "No chargeable additional work proceeds unless you explicitly approve an itemised quotation.",
      "You agree to be present or provide access instructions for the scheduled slot.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation policy",
    body: [
      "Free cancellation up to the window stated on each service (typically 4–24 hours before the slot).",
      "Cancellations inside the window may attract a convenience fee, shown at confirmation.",
      "If a technician cancels, you are not charged and you may rebook at no cost.",
    ],
  },
  {
    id: "refunds",
    title: "Refund policy",
    body: [
      "If you paid online and the service was not delivered, raise a support request and refunds are processed to the original payment method.",
      "Refund status is tracked server-side and confirmed by the payment gateway — the app never marks a refund complete on its own.",
    ],
  },
  {
    id: "support",
    title: "Help & support",
    body: [
      "Email: support@fixora.example — we aim to respond within one business day.",
      "Have your booking reference (#FX…) ready so we can help faster.",
    ],
  },
];

export default function LegalPage() {
  return (
    <PageContainer
      className="pt-[calc(env(safe-area-inset-top)+16px)] md:pt-8"
      padBottom={false}
    >
      <PageHeader title="Legal & support" backHref="/profile" />
      <div className="mx-auto max-w-[560px]">
        <div className="space-y-4">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-20 rounded-xl bg-canvas p-5 shadow-card"
            >
              <h2 className="display-xs text-ink">{s.title}</h2>
              <div className="mt-2 space-y-2">
                {s.body.map((p) => (
                  <p key={p} className="text-body-sm text-body">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-6 text-center text-caption text-mute">
          <Link href="/profile" className="underline underline-offset-2">
            Back to profile
          </Link>
        </p>
      </div>
      <div className="h-8" />
    </PageContainer>
  );
}
