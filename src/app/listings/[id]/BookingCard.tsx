"use client";

import { useActionState, useState } from "react";
import { Listing, formatPrice } from "@/lib/listings";
import { requestBooking, type BookingState } from "./actions";

export function BookingCard({ listing }: { listing: Listing }) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    requestBooking,
    null,
  );
  const [showDates, setShowDates] = useState(false);

  return (
    <aside className="h-fit rounded-2xl border border-line bg-paper-raised p-5 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xl font-semibold text-ink">
          {formatPrice(listing.pricePerMonth, listing.currency)}
        </span>
        <span className="text-xs text-ink-soft">/month</span>
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        {listing.roomType} &middot; {listing.distanceLabel}
      </p>

      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-xs">
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Listing reference</dt>
          <dd className="font-mono text-ink">
            NR-{listing.id.slice(-4).toUpperCase()}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Payment</dt>
          <dd className="text-ink">Held until move-in confirmed</dd>
        </div>
      </dl>

      {state?.success ? (
        <div className="mt-5 rounded-lg border border-teal/30 bg-teal/5 px-3 py-3 text-center">
          <p className="text-sm font-medium text-teal-dim">
            Booking request sent
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            The landlord will confirm your dates shortly.
          </p>
        </div>
      ) : showDates ? (
        <form action={formAction} className="mt-5 space-y-3">
          <input type="hidden" name="listingId" value={listing.id} />
          <div>
            <label
              htmlFor="startDate"
              className="text-xs font-medium uppercase tracking-wide text-ink-soft"
            >
              Move in
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="text-xs font-medium uppercase tracking-wide text-ink-soft"
            >
              Move out
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-xs text-clay">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-teal px-4 py-3 text-sm font-medium text-paper transition-all duration-200 hover:bg-teal-dim hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Sending..." : "Confirm request"}
          </button>
        </form>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setShowDates(true)}
            className="mt-5 w-full rounded-full bg-teal px-4 py-3 text-sm font-medium text-paper transition-all duration-200 hover:bg-teal-dim hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98]"
          >
            Request to book
          </button>
          <p className="mt-3 text-center text-[11px] text-ink-soft">
            You won&apos;t be charged yet.
          </p>
        </>
      )}
    </aside>
  );
}
