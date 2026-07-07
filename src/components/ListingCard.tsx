import Image from "next/image";
import Link from "next/link";
import { Listing, formatPrice } from "@/lib/listings";
import { VerifiedSeal } from "./VerifiedSeal";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised transition-all duration-300 ease-out hover:-translate-y-1 hover:border-line/40 hover:shadow-xl hover:shadow-ink/8"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line/30">
  <Image
    src={listing.image}
    alt={listing.title}
    fill
    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
  />
        {listing.verified ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/90 px-2.5 py-1 text-paper backdrop-blur transition-transform duration-300 group-hover:scale-105">
            <VerifiedSeal size={13} className="text-gold" />
            <span className="text-[11px] font-medium">Verified</span>
          </div>
        ) : (
          <div className="absolute left-3 top-3 rounded-full bg-ink-soft/85 px-2.5 py-1 text-[11px] font-medium text-paper">
            Verification pending
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-teal-dim">
            {listing.title}
          </h3>
        </div>
        <p className="text-xs text-ink-soft">{listing.distanceLabel}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-sm font-medium text-ink">
            {formatPrice(listing.pricePerMonth, listing.currency)}
            <span className="text-ink-soft"> /mo</span>
          </span>
          <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft transition-colors group-hover:border-teal/40 group-hover:text-teal-dim">
            {listing.roomType}
          </span>
        </div>
      </div>
    </Link>
  );
}
