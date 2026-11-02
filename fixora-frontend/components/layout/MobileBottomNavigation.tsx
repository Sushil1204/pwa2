"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Home, LayoutGrid, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { href: string; label: string; icon: LucideIcon; match: (p: string) => boolean }[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { href: "/services", label: "Services", icon: LayoutGrid, match: (p) => p.startsWith("/services") || p.startsWith("/bookings/new") },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck, match: (p) => p.startsWith("/bookings") && !p.startsWith("/bookings/new") },
  { href: "/profile", label: "Profile", icon: User, match: (p) => p.startsWith("/profile") },
];

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-canvas-soft bg-canvas md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-16 w-full max-w-lg items-stretch">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center gap-1 rounded-lg py-2 text-caption transition-colors"
              >
                {/* Active state follows the hero direction: forest fill, white icon */}
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-[#236e3c]" : "bg-transparent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "text-white" : "text-body"}`}
                    aria-hidden
                    strokeWidth={active ? 2.4 : 2}
                  />
                </span>
                <span
                  className={
                    active ? "text-body-sm-strong text-positive-deep" : "text-body-sm text-body"
                  }
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
