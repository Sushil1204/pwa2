import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ServiceArt } from "@/components/illustrations/ServiceArt";
import { formatINR } from "@/lib/format";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const priceLabel =
    service.pricingModel === "fixed" ? "" : service.pricingModel === "custom_quote" ? "" : "From ";

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full items-center gap-3 rounded-xl bg-canvas p-3 shadow-card transition-transform duration-fast ease-out-soft hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
    >
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md">
        <ServiceArt variant={service.illustration} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-body-md-strong text-ink">{service.name}</h3>
        <p className="line-clamp-2 text-body-sm text-body">{service.description}</p>
        <p className="mt-0.5 text-body-sm-strong text-ink tnum">
          {service.pricingModel === "custom_quote"
            ? "Custom quote"
            : `${priceLabel}${formatINR(service.pricePaise)}`}
        </p>
      </div>
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-colors group-hover:bg-primary-active"
      >
        <ChevronRight className="h-5 w-5" />
      </span>
    </Link>
  );
}

export function ServiceCategoryCard({
  slug,
  name,
  description,
  illustration,
}: {
  slug: string;
  name: string;
  description: string;
  illustration: Service["illustration"];
}) {
  return (
    <Link
      href={`/services?category=${slug}`}
      className="group flex flex-col gap-2 rounded-xl bg-canvas p-3 text-center shadow-card transition-transform duration-fast ease-out-soft hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
    >
      <span className="block aspect-square w-full overflow-hidden rounded-md">
        <ServiceArt variant={illustration} className="h-full w-full" />
      </span>
      <span className="text-body-sm-strong text-ink">{name}</span>
      <span className="sr-only">{description}</span>
    </Link>
  );
}
