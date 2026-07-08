"use client";

import { useState, useTransition } from "react";
import { approveBooking, declineBooking } from "./actions";

export function BookingRequestActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"approve" | "decline" | null>(null);

  function handleApprove() {
    setAction("approve");
    setError(null);
    startTransition(async () => {
      const result = await approveBooking(bookingId);
      if (result?.error) setError(result.error);
    });
  }

  function handleDecline() {
    setAction("decline");
    setError(null);
    startTransition(async () => {
      const result = await declineBooking(bookingId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="rounded-full bg-teal px-3.5 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-teal-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && action === "approve" ? "Approving..." : "Approve"}
        </button>
        <button
          type="button"
          onClick={handleDecline}
          disabled={isPending}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-clay/40 hover:text-clay disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && action === "decline" ? "Declining..." : "Decline"}
        </button>
      </div>
      {error && <p className="text-[11px] text-clay">{error}</p>}
    </div>
  );
}