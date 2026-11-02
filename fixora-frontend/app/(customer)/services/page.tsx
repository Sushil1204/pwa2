"use client";

import { Suspense, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState, Skeleton } from "@/components/ui/States";
import { LinkButton } from "@/components/ui/Button";
import { useApp } from "@/components/providers/AppProviders";
import type { CategorySlug } from "@/lib/types";

function ServicesContent() {
  const searchParams = useSearchParams();
  const { status, categories, services } = useApp();
  const loading = status === "loading";
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(
    searchParams.get("category") ?? "all",
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      const catOk = active === "all" || s.categorySlug === active;
      const qOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.longDescription.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [services, query, active]);

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Services" />

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mute"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          aria-label="Search services"
          className="w-full rounded-md border border-ink bg-canvas py-3 pl-12 pr-4 text-body-md text-ink placeholder:text-mute focus:outline-none focus-visible:outline-2 focus-visible:outline-ink"
        />
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-4 mt-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
      >
        <div className="flex w-max gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            aria-pressed={active === "all"}
            className={`rounded-full px-4 py-2 text-body-sm-strong transition-colors ${
              active === "all"
                ? "bg-primary text-on-primary"
                : "bg-canvas text-ink hover:bg-canvas-soft"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.slug as CategorySlug)}
              aria-pressed={active === c.slug}
              className={`rounded-full px-4 py-2 text-body-sm-strong whitespace-nowrap transition-colors ${
                active === c.slug
                  ? "bg-primary text-on-primary"
                  : "bg-canvas text-ink hover:bg-canvas-soft"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="sr-only">All services</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No services found"
            body={
              query
                ? `Nothing matches “${query}”. Try a different search or category.`
                : "No services in this category yet."
            }
            action={
              query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActive("all");
                  }}
                  className="text-body-sm-strong text-ink underline underline-offset-4"
                >
                  Clear filters
                </button>
              ) : (
                <LinkButton href="/services" variant="secondary" size="sm">
                  Browse all services
                </LinkButton>
              )
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((s) => (
              <li key={s.id}>
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="pt-4">
          <PageHeader title="Services" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </PageContainer>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
