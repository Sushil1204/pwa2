import Link from "next/link";
import type { ReactNode } from "react";

export function PageContainer({
  children,
  className = "",
  padBottom = true,
}: {
  children: ReactNode;
  className?: string;
  padBottom?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 ${
        padBottom
          ? "pb-[calc(var(--bottom-nav-height)+32px+env(safe-area-inset-bottom))] md:pb-16"
          : "pb-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
  actionHref,
}: {
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="display-md text-ink">{title}</h2>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="text-body-sm-strong text-ink underline-offset-4 hover:underline"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas text-ink transition-colors hover:bg-canvas-soft"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        )}
        <h1 className="truncate text-page-title text-ink">
          {title}
        </h1>
      </div>
      {right}
    </div>
  );
}
