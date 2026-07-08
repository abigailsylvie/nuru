"use client";

import { useState, useTransition } from "react";
import { cancelBooking } from "@/lib/booking-mutations";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelBooking(bookingId);
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-soft">Cancel this booking?</span>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="rounded-full bg-clay px-3 py-1 text-xs font-medium text-paper transition-colors hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Cancelling..." : "Yes, cancel"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="text-xs font-medium text-ink-soft hover:text-ink"
          >
            Never mind
          </button>
        </div>
        {error && <p className="text-[11px] text-clay">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
    >
      Cancel booking
    </button>
  );
}