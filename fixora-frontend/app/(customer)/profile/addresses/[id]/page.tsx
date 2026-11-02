"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AddressForm } from "@/components/addresses/AddressForm";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { useApp } from "@/components/providers/AppProviders";

function EditAddressContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { status, authenticated, addresses, saveAddress } = useApp();
  const [busy, setBusy] = useState(false);

  const address = addresses.find((a) => a.id === params.id);

  useEffect(() => {
    if (status === "ready" && !authenticated) {
      router.replace(`/auth?next=/profile/addresses/${params.id}`);
    }
  }, [status, authenticated, router, params.id]);

  if (status === "loading" || !authenticated) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Edit address" backHref="/profile/addresses" />
        <Skeleton className="h-96 rounded-xl" />
      </PageContainer>
    );
  }

  if (!address) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="Edit address" backHref="/profile/addresses" />
        <ErrorState
          title="Address not found"
          body="This address may have been deleted."
          onRetry={() => router.push("/profile/addresses")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader title="Edit address" backHref="/profile/addresses" />
      <AddressForm
        key={address.id}
        initial={{
          label: address.label,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          accessInstructions: address.accessInstructions,
          isDefault: address.isDefault,
        }}
        submitLabel="Update address"
        busy={busy}
        onCancel={() => router.push("/profile/addresses")}
        onSubmit={async (draft) => {
          setBusy(true);
          try {
            const res = await saveAddress({ ...draft, id: address.id });
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

function EditAddressFallback() {
  return (
    <PageContainer className="pt-4">
      <PageHeader title="Edit address" backHref="/profile/addresses" />
      <Skeleton className="h-96 rounded-xl" />
    </PageContainer>
  );
}

export default function EditAddressPage() {
  return (
    <Suspense fallback={<EditAddressFallback />}>
      <EditAddressContent />
    </Suspense>
  );
}
