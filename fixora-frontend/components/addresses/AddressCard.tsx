"use client";

import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import type { Address } from "@/lib/types";

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  busy = false,
}: {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  busy?: boolean;
}) {
  return (
    <article className="rounded-xl bg-canvas p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-0.5 text-caption font-semibold ${
              address.isDefault ? "bg-primary text-on-primary" : "bg-canvas-soft text-ink"
            }`}
          >
            {address.label}
          </span>
          {address.isDefault && (
            <span className="text-caption text-positive-deep">Default</span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              disabled={busy}
              aria-label={`Edit ${address.label} address`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas-soft disabled:opacity-50"
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              aria-label={`Delete ${address.label} address`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-negative transition-colors hover:bg-negative-bg/10 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mute" aria-hidden />
        <p className="text-body-sm text-body">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}
          <br />
          {address.city}, {address.state} {address.pincode}
          {address.accessInstructions && (
            <>
              <br />
              <span className="text-mute">Note: {address.accessInstructions}</span>
            </>
          )}
        </p>
      </div>

      {onSetDefault && !address.isDefault && (
        <button
          type="button"
          onClick={onSetDefault}
          disabled={busy}
          className="mt-3 inline-flex items-center gap-1.5 text-body-sm-strong text-ink underline-offset-4 hover:underline disabled:opacity-50"
        >
          <Star className="h-4 w-4" aria-hidden />
          Set as default
        </button>
      )}
    </article>
  );
}
