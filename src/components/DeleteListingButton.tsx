"use client";

import { useState, useTransition } from "react";
import { deleteListing } from "@/lib/listing-mutations";

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteListing(listingId);
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
          <span className="text-xs text-ink-soft">Delete this listing?</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-clay px-3 py-1 text-xs font-medium text-paper transition-colors hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Yes, delete"}
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
      className="text-xs font-medium text-ink-soft transition-colors hover:text-clay"
    >
      Delete
    </button>
  );
}