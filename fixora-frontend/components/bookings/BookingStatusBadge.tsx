import type { BookingStatus } from "@/lib/types";

const styles: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-primary-pale text-positive-deep" },
  CONFIRMED: { label: "Confirmed", className: "bg-primary text-on-primary" },
  TECHNICIAN_ASSIGNED: { label: "Assigned", className: "bg-primary text-on-primary" },
  ON_THE_WAY: { label: "On the way", className: "bg-primary text-on-primary" },
  ARRIVED: { label: "Arrived", className: "bg-primary text-on-primary" },
  IN_PROGRESS: { label: "In progress", className: "bg-primary text-on-primary" },
  COMPLETED: { label: "Completed", className: "bg-canvas-soft text-body" },
  CANCELLED: { label: "Cancelled", className: "bg-negative-bg text-canvas" },
  REJECTED: { label: "Rejected", className: "bg-negative-bg text-canvas" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-body-sm-strong ${className}`}
    >
      {label}
    </span>
  );
}

export function isCancellable(status: BookingStatus): boolean {
  return ["PENDING", "CONFIRMED", "TECHNICIAN_ASSIGNED"].includes(status);
}

export function isUpcoming(status: BookingStatus): boolean {
  return !["COMPLETED", "CANCELLED", "REJECTED"].includes(status);
}
