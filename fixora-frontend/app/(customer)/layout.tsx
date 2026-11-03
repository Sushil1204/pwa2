import { Suspense } from "react";
import { Bell } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { Brand } from "@/components/layout/Brand";

/** Static twin of the header — keeps the shell prerenderable. */
function HeaderFallback() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-canvas-soft bg-canvas"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas">
          <Bell className="h-5 w-5 text-ink" aria-hidden />
        </span>
      </div>
    </header>
  );
}

const navItems = ["Home", "Services", "Bookings", "Profile"];

function BottomNavFallback() {
  return (
    <nav
      aria-hidden
      className="fixed inset-x-0 bottom-0 z-40 border-t border-canvas-soft bg-canvas md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-16 w-full max-w-lg items-stretch">
        {navItems.map((label) => (
          <li key={label} className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="h-5 w-5 rounded-full bg-canvas-soft" />
            <span className="text-body-sm text-body">{label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={<HeaderFallback />}>
        <AppHeader />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Suspense fallback={<BottomNavFallback />}>
        <MobileBottomNavigation />
      </Suspense>
    </div>
  );
}
