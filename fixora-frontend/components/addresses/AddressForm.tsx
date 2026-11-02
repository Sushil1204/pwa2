"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, TextField, TextArea } from "@/components/ui/FormField";
import type { Address } from "@/lib/types";

type Draft = Omit<Address, "id">;

const empty: Draft = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  accessInstructions: "",
  isDefault: false,
};

export function AddressForm({
  initial,
  submitLabel = "Save address",
  onSubmit,
  onCancel,
  busy = false,
  serverError,
}: {
  initial?: Partial<Draft>;
  submitLabel?: string;
  onSubmit: (draft: Draft) => Promise<{ ok: boolean; error?: string }>;
  onCancel?: () => void;
  busy?: boolean;
  serverError?: string;
}) {
  const [draft, setDraft] = useState<Draft>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState(serverError ?? "");

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const next: Record<string, string> = {};
    if (!draft.label.trim()) next.label = "Label is required (Home, Office…).";
    if (!draft.line1.trim()) next.line1 = "Street address is required.";
    if (!draft.city.trim()) next.city = "City is required.";
    if (!draft.state.trim()) next.state = "State is required.";
    if (!/^\d{6}$/.test(draft.pincode.trim())) next.pincode = "PIN code must be 6 digits.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const res = await onSubmit({
      ...draft,
      label: draft.label.trim(),
      line1: draft.line1.trim(),
      line2: draft.line2?.trim() || undefined,
      city: draft.city.trim(),
      state: draft.state.trim(),
      pincode: draft.pincode.trim(),
      accessInstructions: draft.accessInstructions?.trim() || undefined,
    });
    if (!res.ok) setError(res.error ?? "Could not save the address.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl bg-canvas p-5 shadow-card">
      <FormField label="Label" required error={errors.label}>
        {(p) => (
          <TextField
            {...p}
            placeholder="Home, Office, Other…"
            value={draft.label}
            onChange={(e) => set("label", e.target.value)}
          />
        )}
      </FormField>

      <FormField label="Street address" required error={errors.line1}>
        {(p) => (
          <TextField
            {...p}
            autoComplete="address-line1"
            placeholder="123 Main Street"
            value={draft.line1}
            onChange={(e) => set("line1", e.target.value)}
          />
        )}
      </FormField>

      <FormField label="Apartment, floor (optional)" optional>
        {(p) => (
          <TextField
            {...p}
            autoComplete="address-line2"
            value={draft.line2 ?? ""}
            onChange={(e) => set("line2", e.target.value)}
          />
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="City" required error={errors.city}>
          {(p) => (
            <TextField
              {...p}
              autoComplete="address-level2"
              value={draft.city}
              onChange={(e) => set("city", e.target.value)}
            />
          )}
        </FormField>
        <FormField label="State" required error={errors.state}>
          {(p) => (
            <TextField
              {...p}
              autoComplete="address-level1"
              value={draft.state}
              onChange={(e) => set("state", e.target.value)}
            />
          )}
        </FormField>
      </div>

      <FormField label="PIN code" required error={errors.pincode}>
        {(p) => (
          <TextField
            {...p}
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            value={draft.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
          />
        )}
      </FormField>

      <FormField label="Access instructions" optional hint="Gate code, floor, landmark…">
        {(p) => (
          <TextArea
            {...p}
            value={draft.accessInstructions ?? ""}
            onChange={(e) => set("accessInstructions", e.target.value)}
          />
        )}
      </FormField>

      <label className="flex cursor-pointer items-center gap-3 rounded-md bg-canvas-soft px-4 py-3">
        <input
          type="checkbox"
          checked={draft.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
          className="h-4 w-4 accent-[#0e0f0c]"
        />
        <span className="text-body-sm text-ink">Set as my default address</span>
      </label>

      {error && (
        <p role="alert" className="rounded-md bg-negative-bg px-4 py-3 text-body-sm text-canvas">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" loading={busy} className="flex-1">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
