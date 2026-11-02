"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { FormField, TextField } from "@/components/ui/FormField";
import { Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";
import type { CustomerProfile } from "@/lib/types";

function ProfileForm({
  profile,
  updateProfile,
}: {
  profile: CustomerProfile;
  updateProfile: (
    patch: Partial<Pick<CustomerProfile, "name" | "email">>,
  ) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setFormError("");
    const next: { name?: string; email?: string } = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const res = await updateProfile({ name: name.trim(), email: email.trim() });
      if (res.ok) setSaved(true);
      else setFormError(res.error ?? "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl bg-canvas p-5 shadow-card">
      <FormField label="Full name" required error={errors.name}>
        {(p) => (
          <TextField
            {...p}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </FormField>

      <FormField
        label="Email"
        optional
        error={errors.email}
        hint="Used for receipts and booking summaries."
      >
        {(p) => (
          <TextField
            {...p}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </FormField>

      <FormField label="Mobile number" hint="Contact support to change your verified number.">
        {(p) => <TextField {...p} value={profile.phone} readOnly disabled />}
      </FormField>

      {formError && (
        <p role="alert" className="rounded-md bg-negative-bg px-4 py-3 text-body-sm text-canvas">
          {formError}
        </p>
      )}

      {saved && (
        <p
          role="status"
          className="inline-flex items-center gap-2 rounded-md bg-primary-pale px-4 py-3 text-body-sm text-positive-deep"
        >
          <Check className="h-4 w-4" aria-hidden />
          Profile updated.
        </p>
      )}

      <Button type="submit" loading={saving} className="w-full">
        Save changes
      </Button>
    </form>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const { status, authenticated, profile, updateProfile } = useApp();

  useEffect(() => {
    if (status === "ready" && !authenticated) router.replace("/auth?next=/profile/edit");
  }, [status, authenticated, router]);

  if (status === "loading" || !profile) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Edit profile" backHref="/profile" />
        <Skeleton className="h-64 rounded-xl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Edit profile" backHref="/profile" />
      <ProfileForm key={profile.phone} profile={profile} updateProfile={updateProfile} />
    </PageContainer>
  );
}
