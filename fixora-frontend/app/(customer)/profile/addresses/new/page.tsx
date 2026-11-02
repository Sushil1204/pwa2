"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AddressForm } from "@/components/addresses/AddressForm";
import { Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";

export default function NewAddressPage() {
  const router = useRouter();
  const { status, authenticated, saveAddress, addresses } = useApp();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "ready" && !authenticated) {
      router.replace("/auth?next=/profile/addresses/new");
    }
  }, [status, authenticated, router]);

  if (status === "loading" || !authenticated) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Add address" backHref="/profile/addresses" />
        <Skeleton className="h-96 rounded-xl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Add address" backHref="/profile/addresses" />
      <AddressForm
        initial={{ state: "", isDefault: addresses.length === 0 }}
        submitLabel="Save address"
        busy={busy}
        onCancel={() => router.push("/profile/addresses")}
        onSubmit={async (draft) => {
          setBusy(true);
          try {
            const res = await saveAddress(draft);
            if (res.ok) router.push("/profile/addresses");
            return res;
          } finally {
            setBusy(false);
          }
        }}
      />
    </PageContainer>
  );
}
