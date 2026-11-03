"use client";

import {
  BadgeCheck,
  CalendarClock,
  Headphones,
  ReceiptIndianRupee,
  ArrowRight,
} from "lucide-react";
import {
  PageContainer,
  SectionHeading,
} from "@/components/layout/PageContainer";
import { LinkButton } from "@/components/ui/Button";
import {
  ServiceCard,
  ServiceCategoryCard,
} from "@/components/services/ServiceCard";
import { Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified technicians",
    body: "Every technician is checked and approved before receiving jobs.",
  },
  {
    icon: ReceiptIndianRupee,
    title: "Transparent pricing",
    body: "See the full price breakdown before you confirm anything.",
  },
  {
    icon: CalendarClock,
    title: "Fast scheduling",
    body: "Same-day slots and quick assignment when you need a fix.",
  },
  {
    icon: Headphones,
    title: "Real support",
    body: "Help with bookings, reschedules and service issues.",
  },
];

export default function HomePage() {
  const { status, categories, services, authenticated } = useApp();
  const loading = status === "loading";
  const popular = services.filter((s) => s.popular).slice(0, 4);

  return (
    <PageContainer className="pt-4 sm:pt-6">
      {/* Hero — palette pinned by the approved hero direction */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden rounded-xl bg-[#fbfbf7] bg-[linear-gradient(115deg,#d5f2cd_0%,#eaf7e8_62%)] p-4 shadow-card sm:p-6 lg:p-8"
      >
        {/* Out-of-focus foliage, top-left corner */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-6 -top-8 h-28 w-40 opacity-70 blur-[8px] sm:h-32 sm:w-44"
        >
          <svg viewBox="0 0 160 120" className="h-full w-full">
            <path
              d="M20 118 C4 96 6 66 26 48 C44 70 44 98 34 118 Z"
              fill="#3f8f4f"
            />
            <path
              d="M34 118 C30 88 44 60 68 46 C74 76 60 106 44 118 Z"
              fill="#57a862"
            />
            <path
              d="M8 118 C-6 104 -8 84 2 68 C16 84 18 104 12 118 Z"
              fill="#68b565"
            />
          </svg>
        </div>

        {/* Living-room scene, right side — fades into the gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden md:left-[55%] md:block"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, #000 45%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 45%)",
          }}
        >
          <svg
            viewBox="0 0 640 400"
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full"
          >
            <defs>
              <linearGradient id="hero-floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e9d5b1" />
                <stop offset="100%" stopColor="#dcc49b" />
              </linearGradient>
              <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffe7c4" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ffe7c4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Floor bleeds past the viewBox so it fills the panel at any aspect */}
            <rect
              x="-400"
              y="300"
              width="1600"
              height="300"
              fill="url(#hero-floor)"
            />
            <rect x="-400" y="292" width="1600" height="10" fill="#f3f7ee" />
            <g stroke="#d3b98f" strokeWidth="2" opacity="0.7">
              <line x1="-400" y1="338" x2="1200" y2="338" />
              <line x1="-400" y1="376" x2="1200" y2="376" />
              <line x1="-400" y1="414" x2="1200" y2="414" />
              <line x1="-400" y1="452" x2="1200" y2="452" />
              <line x1="-400" y1="490" x2="1200" y2="490" />
            </g>
            <ellipse
              cx="235"
              cy="312"
              rx="165"
              ry="14"
              fill="#000000"
              opacity="0.08"
            />
            <ellipse
              cx="525"
              cy="384"
              rx="135"
              ry="14"
              fill="#000000"
              opacity="0.1"
            />

            {/* Sofa with green accent pillow */}
            <rect
              x="120"
              y="150"
              width="230"
              height="104"
              rx="22"
              fill="#b2b9b3"
            />
            <rect
              x="106"
              y="200"
              width="44"
              height="102"
              rx="20"
              fill="#a6ada7"
            />
            <rect
              x="320"
              y="200"
              width="44"
              height="102"
              rx="20"
              fill="#a6ada7"
            />
            <rect
              x="112"
              y="236"
              width="246"
              height="62"
              rx="16"
              fill="#c7cdc8"
            />
            <rect
              x="166"
              y="182"
              width="64"
              height="58"
              rx="12"
              fill="#7cc476"
              transform="rotate(-7 198 211)"
            />
            <rect
              x="132"
              y="296"
              width="16"
              height="20"
              rx="5"
              fill="#3f4441"
            />
            <rect
              x="322"
              y="296"
              width="16"
              height="20"
              rx="5"
              fill="#3f4441"
            />

            {/* Side table with potted plant */}
            <rect
              x="400"
              y="238"
              width="98"
              height="13"
              rx="6"
              fill="#cd9f6a"
            />
            <rect
              x="410"
              y="251"
              width="12"
              height="58"
              rx="5"
              fill="#b9874f"
            />
            <rect
              x="476"
              y="251"
              width="12"
              height="58"
              rx="5"
              fill="#b9874f"
            />
            <path d="M424 206 H476 L470 238 H430 Z" fill="#c8734f" />
            <path
              d="M450 206 C439 198 433 188 435 178 C447 184 453 196 450 206 Z"
              fill="#2c6b3f"
            />
            <path
              d="M450 206 C447 192 451 180 459 172 C466 184 462 198 450 206 Z"
              fill="#2c6b3f"
            />
            <path
              d="M450 206 C459 202 469 198 476 190 C465 186 454 194 450 206 Z"
              fill="#7cc476"
            />

            {/* Pendant lamp with warm bulb */}
            <line
              x1="562"
              y1="-20"
              x2="562"
              y2="76"
              stroke="#2f3934"
              strokeWidth="3"
            />
            <path d="M530 78 Q562 62 594 78 L608 124 H516 Z" fill="#46975a" />
            <ellipse cx="562" cy="124" rx="46" ry="8" fill="#2f6b3f" />
            <circle cx="562" cy="132" r="36" fill="url(#hero-glow)" />
            <circle cx="562" cy="132" r="10" fill="#ffd9a0" />

            {/* Toolbox with tools, foreground */}
            <g transform="rotate(-10 472 292)">
              <rect
                x="465"
                y="266"
                width="14"
                height="52"
                rx="6"
                fill="#9aa0a6"
              />
            </g>
            <g transform="rotate(9 600 292)">
              <rect
                x="594"
                y="264"
                width="12"
                height="54"
                rx="6"
                fill="#dfe3e6"
              />
              <rect
                x="590"
                y="242"
                width="20"
                height="28"
                rx="8"
                fill="#f5c518"
              />
            </g>
            <rect
              x="434"
              y="304"
              width="190"
              height="28"
              rx="9"
              fill="#3b4046"
            />
            <rect
              x="440"
              y="326"
              width="178"
              height="58"
              rx="8"
              fill="#2c2f33"
            />
            <path
              d="M494 304 q28 -26 56 0"
              fill="none"
              stroke="#2c2f33"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect
              x="516"
              y="326"
              width="26"
              height="20"
              rx="5"
              fill="#b0f073"
            />
          </svg>
        </div>

        <div className="relative max-w-md md:max-w-lg">
          <h1 id="hero-heading" className="display-xl text-ink">
            Home repairs,{" "}
            <span className="block text-positive-deep">done right.</span>
          </h1>
          <p className="mt-4 sm:text-body-md lg:text-body-lg text-body">
            Book reliable technicians for all your home needs.
          </p>
          <div className="mt-5 flex flex-nowrap gap-2 sm:gap-3">
            <LinkButton
              href="/services"
              size="sm"
              className="group shrink-0 rounded-lg bg-positive text-canvas hover:bg-positive-deep px-2 sm:px-6 sm:py-3 sm:min-h-12 text-button-sm lg:text-button-md"
            >
              Book a Repair
              <ArrowRight
                className="hidden h-4 w-4 text-body transition-transform duration-fast ease-out-soft group-hover:translate-x-0.5 min-[360px]:block sm:h-5 sm:w-5"
                aria-hidden
              />
            </LinkButton>
            <LinkButton
              href={authenticated ? "/bookings" : "/auth?next=/bookings"}
              variant="secondary"
              size="sm"
              className="shrink-0 rounded-lg bg-canvas text-ink hover:bg-canvas-soft px-2 sm:px-6 sm:py-3 sm:min-h-12 text-button-sm lg:text-button-md"
            >
              My bookings
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section aria-label="Browse categories" className="mt-8">
        <SectionHeading
          title="Browse categories"
          action="View all"
          actionHref="/services"
        />
        {loading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories.map((c) => (
              <ServiceCategoryCard
                key={c.id}
                slug={c.slug}
                name={c.name}
                description={c.description}
                illustration={c.illustration}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular services */}
      <section aria-label="Popular services" className="mt-8">
        <SectionHeading
          title="Popular services"
          action="View all"
          actionHref="/services"
        />
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {popular.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
        {!loading && popular.length === 0 && (
          <p className="rounded-xl bg-canvas p-4 text-body-sm text-body shadow-card">
            No services available right now.
          </p>
        )}
      </section>

      {/* Trust & benefits */}
      <section aria-label="Why book with Fixora" className="mt-8">
        <div className="rounded-xl bg-primary-pale p-5 sm:p-6">
          <h2 className="display-md text-ink">Built on verified trust</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas">
                  <Icon className="h-5 w-5 text-ink" aria-hidden />
                </span>
                <div>
                  <h3 className="text-body-sm-strong text-ink">{title}</h3>
                  <p className="text-body-sm text-body">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Booking entry points */}
      <section aria-labelledby="cta-heading" className="mt-8">
        <div className="rounded-xl bg-ink p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="cta-heading" className="display-md text-primary">
                Something broken? Get it fixed.
              </h2>
              <p className="mt-2 max-w-md text-body-sm text-canvas-soft">
                Pick a service, choose a slot and track every step — you&apos;ll
                know the price before work starts.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <LinkButton href="/services" variant="dark">
                Book a Repair
              </LinkButton>
              <LinkButton
                href={authenticated ? "/bookings" : "/auth?next=/bookings"}
                variant="dark"
                className="border border-primary/40 hover:bg-ink/80"
              >
                View my bookings
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-8 mx-auto max-w-[440px] text-center text-caption text-mute">
        Demo catalogue — services, prices and bookings shown here are
        development data until the Fixora API is connected.
      </p>
    </PageContainer>
  );
}
