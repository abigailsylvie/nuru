import Image from "next/image";
"use client";

import { useMemo, useState } from "react";
import { Listing } from "@/lib/listings";
import { ListingCard } from "./ListingCard";

const ALL_CITIES = "All cities";

export function ListingsBrowser({ listings }: { listings: Listing[] }) {
  const [city, setCity] = useState(ALL_CITIES);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState<number | "">("");

  const cities = useMemo(
    () => [ALL_CITIES, ...Array.from(new Set(listings.map((l) => l.city)))],
    [listings],
  );

  const filtered = listings.filter((listing) => {
    if (city !== ALL_CITIES && listing.city !== city) return false;
    if (verifiedOnly && !listing.verified) return false;
    return true;
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border border-line bg-paper-raised p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-sm font-semibold text-ink">Filters</h2>

        <div className="mt-5">
          <label
            htmlFor="city"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink transition-colors hover:border-ink/30"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label
            htmlFor="budget"
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Max budget (local currency)
          </label>
          <input
            id="budget"
            type="number"
            min={0}
            placeholder="No limit"
            value={maxBudget}
            onChange={(e) =>
              setMaxBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink font-mono placeholder:font-sans transition-colors hover:border-ink/30"
          />
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-teal"
          />
          Verified only
        </label>

        <button
          type="button"
          onClick={() => {
            setCity(ALL_CITIES);
            setVerifiedOnly(false);
            setMaxBudget("");
          }}
          className="mt-6 text-xs font-medium text-teal hover:text-teal-dim"
        >
          Reset filters
        </button>
      </aside>

      <div>
        <p className="mb-4 text-xs font-medium text-ink-soft">
          {filtered.length} of {listings.length} listings
        </p>
        {filtered.length > 0 ? (
          <div
            key={`${city}-${verifiedOnly}-${maxBudget}`}
            className="grid animate-[fadein_300ms_ease-out] gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filtered
              .filter((l) =>
                maxBudget === "" ? true : l.pricePerMonth <= maxBudget,
              )
              .map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
          </div>
        ) : (
          <div className="animate-[fadein_300ms_ease-out] rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="text-sm font-medium text-ink">
              No listings match these filters
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Try a different city, raise your budget, or turn off
              &ldquo;verified only&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setCity(ALL_CITIES);
                setVerifiedOnly(false);
                setMaxBudget("");
              }}
              className="mt-4 text-xs font-medium text-teal hover:text-teal-dim"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
