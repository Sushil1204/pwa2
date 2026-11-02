"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AddressCard } from "@/components/addresses/AddressCard";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { EmptyState, Skeleton } from "@/components/ui/States";
import { LinkButton } from "@/components/ui/Button";
import { useApp } from "@/components/providers/AppProviders";
import type { Address } from "@/lib/types";

export default function AddressesPage() {
  const router = useRouter();
  const { status, authenticated, addresses, deleteAddress, setDefaultAddress } = useApp();

  const [pendingDelete, setPendingDelete] = useState<Address | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (status === "ready" && !authenticated) {
      router.replace("/auth?next=/profile/addresses");
    }
  }, [status, authenticated, router]);

  if (status === "loading" || !authenticated) {
    return (
      <PageContainer className="pt-4">
        <PageHeader title="My addresses" backHref="/profile" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="mt-3 h-24 rounded-xl" />
      </PageContainer>
    );
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setBusy(true);
    setActionError("");
    try {
      const res = await deleteAddress(pendingDelete.id);
      if (res.ok) setPendingDelete(null);
      else setActionError(res.error ?? "Could not delete the address.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSetDefault(id: string) {
    setBusy(true);
    setActionError("");
    try {
      const res = await setDefaultAddress(id);
      if (!res.ok) setActionError(res.error ?? "Could not update the default.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageContainer className="pt-4">
      <PageHeader
        title="My addresses"
        backHref="/profile"
        right={
          <LinkButton href="/profile/addresses/new" variant="secondary" size="sm">
            Add
          </LinkButton>
        }
      />

      {actionError && (
        <p role="alert" className="mb-3 rounded-md bg-negative-bg px-4 py-3 text-body-sm text-canvas">
          {actionError}
        </p>
      )}

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          body="Add a service address so booking a repair takes seconds."
          action={
            <LinkButton href="/profile/addresses/new">Add address</LinkButton>
          }
        />
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li key={a.id}>
              <AddressCard
                address={a}
                busy={busy}
                onEdit={() => router.push(`/profile/addresses/${a.id}`)}
                onDelete={() => setPendingDelete(a)}
                onSetDefault={a.isDefault ? undefined : () => handleSetDefault(a.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-xl bg-primary-pale p-5 text-center">
        <p className="text-body-sm-strong text-ink">Add another address</p>
        <p className="mt-1 text-body-sm text-body">Save a second location for faster booking.</p>
        <LinkButton href="/profile/addresses/new" size="sm" className="mt-3">
          Add address
        </LinkButton>
      </div>

      <ConfirmationDialog
        open={!!pendingDelete}
        title="Delete this address?"
        body={`“${pendingDelete?.label}” will be removed from your saved addresses. Bookings already made keep their address snapshot.`}
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </PageContainer>
  );
}
