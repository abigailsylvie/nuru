"use client";

import { useActionState } from "react";
import { submitListing, type ListingFormState } from "./actions";

export function ListPropertyForm() {
  const [state, formAction, pending] = useActionState<
    ListingFormState,
    FormData
  >(submitListing, null);

  if (state?.success) {
    return (
      <div className="mt-8 rounded-xl border border-teal/30 bg-teal/5 p-6 text-center">
        <p className="font-display text-base font-semibold text-teal-dim">
          Listing submitted
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Our team will verify your ID and property documents before it goes
          live to students.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="title"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Listing title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Quiet studio near Plateau business district"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            placeholder="Dakar"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            placeholder="Senegal"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
          />
        </div>

        <div>
          <label
            htmlFor="roomType"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Room type
          </label>
          <select
            id="roomType"
            name="roomType"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
          >
            <option>Private room</option>
            <option>Shared room</option>
            <option>Studio</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Price per month
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            required
            placeholder="0"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink font-mono placeholder:font-sans transition-colors hover:border-ink/30"
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Currency
          </label>
          <input
            id="currency"
            name="currency"
            type="text"
            required
            placeholder="XOF"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink font-mono placeholder:font-sans transition-colors hover:border-ink/30"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the room, the neighborhood, and what students usually ask about."
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="photo"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="mt-2 w-full rounded-lg border border-dashed border-line bg-paper px-4 py-6 text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-paper"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-xs text-clay">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper transition-all duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Submitting..." : "Submit for verification"}
      </button>
    </form>
  );
}
