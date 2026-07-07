import { notFound } from "next/navigation";
import { ShieldCheck, PhoneCall, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VerifiedSeal } from "@/components/VerifiedSeal";
import { listings as mockListings } from "@/lib/listings";
import { getListing } from "@/lib/listings-service";
import { BookingCard } from "./BookingCard";

export function generateStaticParams() {
  return mockListings.map((listing) => ({ id: listing.id }));
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-xs font-medium text-ink-soft">
            {listing.city}, {listing.country}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {listing.title}
          </h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-teal/15 via-line/40 to-gold/15" />

              <div className="mt-8 flex items-center gap-3 rounded-xl border border-line bg-paper-raised p-4">
                {listing.verified ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-gold">
                    <VerifiedSeal size={18} />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-soft/20 text-ink-soft">
                    <ShieldCheck size={18} />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-ink">
                    {listing.landlord.name}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {listing.verified
                      ? `Verified landlord since ${listing.landlord.verifiedSince}`
                      : "Verification in progress"}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-ink-soft">
                  <Clock size={13} />
                  {listing.landlord.responseTime}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-base font-semibold text-ink">
                  About this place
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {listing.description}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-base font-semibold text-ink">
                  Amenities
                </h2>
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {listing.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-lg border border-line bg-paper-raised px-3 py-2 text-xs text-ink-soft"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-xl border border-line bg-paper-raised p-4">
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-teal" />
                  <h2 className="font-display text-sm font-semibold text-ink">
                    Safety check-ins
                  </h2>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  Once booked, Nuru sends scheduled check-in messages to the
                  student. If a check-in is missed, an alert is sent to the
                  parent or guardian on file, and to the university partner
                  where applicable.
                </p>
              </div>
            </div>

            {/* Booking card */}
            <BookingCard listing={listing} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
