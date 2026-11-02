import type { IllustrationKey } from "@/lib/types";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <rect width="40" height="40" rx="10" fill="#9fe870" />
      <path
        d="M12 9h17v6H19v5h8v6h-8v6h-7V9z"
        fill="#0e0f0c"
      />
      <circle cx="30.5" cy="30.5" r="3" fill="#0e0f0c" />
    </svg>
  );
}

export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8" />
      <span className="text-lg font-black tracking-tight text-ink">Fixora</span>
    </span>
  );
}

export const categoryArtKeys: Record<string, IllustrationKey> = {
  plumbing: "plumbing",
  electrical: "electrical",
  appliances: "appliances",
  ac: "ac",
  cleaning: "cleaning",
  painting: "painting",
};
