import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Brand } from "@/components/layout/Brand";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas-soft px-6 text-center">
      <Brand />
      <span className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-canvas">
        <WifiOff className="h-8 w-8 text-ink" aria-hidden />
      </span>
      <h1 className="display-md mt-6 text-ink">You&apos;re offline</h1>
      <p className="mt-3 max-w-sm text-body-sm text-body">
        Fixora needs a connection for bookings, payments and live updates. You can
        browse the services you already loaded, and we&apos;ll retry automatically
        when you&apos;re back online.
      </p>
      <div className="mt-6 flex gap-3">
        <LinkButton href="/">Try again</LinkButton>
        <LinkButton href="/services" variant="secondary">
          Browse services
        </LinkButton>
      </div>
      <p className="mt-8 text-caption text-mute">
        Still stuck?{" "}
        <Link href="/legal#support" className="underline underline-offset-2">
          Contact support
        </Link>
      </p>
    </div>
  );
}
