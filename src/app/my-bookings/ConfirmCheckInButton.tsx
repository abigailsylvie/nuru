"use client";

import { useState, useTransition } from "react";
import { confirmCheckIn } from "./checkin-actions";

export function ConfirmCheckInButton({ checkInId }: { checkInId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await confirmCheckIn(checkInId);
      if (result?.error) {
        setError(result.error);
      } else {
        setConfirmed(true);
      }
    });
  }

  if (confirmed) {
    return (
      <span className="rounded-full border border-teal/30 bg-teal/5 px-3 py-1 text-xs font-medium text-teal-dim">
        Confirmed
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isPending}
        className="rounded-full bg-teal px-3.5 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-teal-dim disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Confirming..." : "I'm safe — confirm check-in"}
      </button>
      {error && <p className="text-[11px] text-clay">{error}</p>}
    </div>
  );
}