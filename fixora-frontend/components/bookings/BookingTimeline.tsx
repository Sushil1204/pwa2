import type { Booking, BookingStatus } from "@/lib/types";

const STAGES: { key: string; label: string; reach: BookingStatus[] }[] = [
  { key: "booked", label: "Booked", reach: ["PENDING", "CONFIRMED", "TECHNICIAN_ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"] },
  { key: "assigned", label: "Assigned", reach: ["TECHNICIAN_ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"] },
  { key: "onway", label: "On my way", reach: ["ON_THE_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"] },
  { key: "completed", label: "Completed", reach: ["COMPLETED"] },
];

function stageIndex(status: BookingStatus): number {
  if (status === "CANCELLED" || status === "REJECTED") return -1;
  if (status === "ARRIVED" || status === "IN_PROGRESS") return 2;
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (STAGES[i].reach.includes(status)) return i;
  }
  return 0;
}

export function BookingTimeline({ booking }: { booking: Booking }) {
  if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
    return (
      <div className="rounded-xl bg-canvas p-4 shadow-card">
        <h2 className="text-body-md-strong text-ink">Booking status</h2>
        <p className="mt-2 text-body-sm text-body">
          This booking was {booking.status === "CANCELLED" ? "cancelled" : "rejected"}.
          {booking.statusHistory.at(-1)?.note ? ` ${booking.statusHistory.at(-1)!.note}.` : ""}
        </p>
      </div>
    );
  }

  const current = stageIndex(booking.status);

  return (
    <div className="rounded-xl bg-canvas p-4 shadow-card">
      <h2 className="text-body-md-strong text-ink">Booking status</h2>
      <ol className="mt-4 grid grid-cols-4">
        {STAGES.map((stage, i) => {
          const done = i <= current;
          const active = i === current;
          return (
            <li key={stage.key} className="flex flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={`h-px flex-1 ${i === 0 ? "opacity-0" : i < current ? "bg-positive" : "bg-canvas-soft"}`}
                />
                <span
                  aria-hidden
                  className={`h-3.5 w-3.5 shrink-0 rounded-full ${
                    done ? "bg-positive" : "bg-canvas-soft"
                  }`}
                />
                <span
                  aria-hidden
                  className={`h-px flex-1 ${i === STAGES.length - 1 ? "opacity-0" : i < current ? "bg-positive" : "bg-canvas-soft"}`}
                />
              </div>
              <span
                className={`text-center text-caption ${
                  active ? "font-semibold text-ink" : done ? "text-body" : "text-mute"
                }`}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>

      <ul className="mt-5 space-y-3 border-t border-canvas-soft pt-4">
        {booking.statusHistory.map((event, i) => (
          <li key={`${event.status}-${i}`} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
            <div className="min-w-0">
              <p className="text-body-sm-strong text-ink">
                {labelFor(event.status)}
                {event.note ? ` — ${event.note}` : ""}
              </p>
              <p className="text-caption text-mute">
                {new Date(event.at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only">{`Current stage: ${STAGES[Math.max(current, 0)].label}`}</p>
    </div>
  );
}

function labelFor(status: BookingStatus): string {
  const map: Partial<Record<BookingStatus, string>> = {
    PENDING: "Booking created",
    CONFIRMED: "Confirmed",
    TECHNICIAN_ASSIGNED: "Technician assigned",
    ON_THE_WAY: "Technician on the way",
    ARRIVED: "Technician arrived",
    IN_PROGRESS: "Work in progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
  };
  return map[status] ?? status;
}
