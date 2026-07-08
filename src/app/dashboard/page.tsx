import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VerifiedSeal } from "@/components/VerifiedSeal";
import { formatPrice } from "@/lib/listings";
import { getCurrentUserInfo, getMyListings, getBookingsForMyListings } from "@/lib/landlord-listings-service";
import { BookingRequestActions } from "./BookingRequestActions";
import { CancelBookingButton } from "@/components/CancelBookingButton";

export const metadata = {
  title: "Dashboard  Nuru",
};

export default async function DashboardPage() {
  const userInfo = await getCurrentUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  if (userInfo.role !== "landlord") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <h1 className="font-display text-2xl font-semibold text-ink">
              This page is for landlords
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Your account is registered as a student. Browse housing instead,
              or sign up separately as a landlord to list a property.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-block rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-paper hover:bg-teal-dim transition-colors"
            >
              Browse listings
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const listings = await getMyListings();
  const bookings = await getBookingsForMyListings();
  const pendingBookings = bookings.filter((b) => b.paymentStatus === "pending");
  const confirmedBookings = bookings.filter((b) => b.paymentStatus === "held");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
                Your Listings
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                {listings.length === 0
                  ? "You haven't listed a property yet."
                  : `${listings.length} listing${listings.length === 1 ? "" : "s"}.`}
              </p>
            </div>
            <Link
              href="/list-property"
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
            >
              + Add listing
            </Link>
          </div>

          {pendingBookings.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-ink">
                Booking Requests
                <span className="ml-2 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-gold-dim align-middle">
                  {pendingBookings.length} pending
                </span>
              </h2>
              <div className="mt-4 space-y-3">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-display text-sm font-semibold text-ink">
                        {booking.listingTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {booking.studentName} · {new Date(booking.startDate).toLocaleDateString()} —{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <BookingRequestActions bookingId={booking.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
       {confirmedBookings.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">
            Confirmed Bookings
          </h2>
          <div className="mt-4 space-y-3">
            {confirmedBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {booking.listingTitle}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {booking.studentName} · {new Date(booking.startDate).toLocaleDateString()} —{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <CancelBookingButton bookingId={booking.id} />
              </div>
            ))}
          </div>
        </div>
      )}

          {listings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="text-sm text-ink-soft">
                Once you submit a property, it will show up here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-paper-raised p-4"
                >
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-line/30">
                    {listing.imageUrl && (
                      <Image
                        src={listing.imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink">
                      {listing.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {listing.city}, {listing.country} · {listing.roomType}
                    </p>
                  </div>

                  <span className="font-mono text-sm font-medium text-ink">
                    {formatPrice(listing.pricePerMonth, listing.currency)}
                    <span className="text-ink-soft"> /mo</span>
                  </span>

                  {listing.verified ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-paper">
                      <VerifiedSeal size={12} className="text-gold" />
                      <span className="text-[11px] font-medium">Verified</span>
                    </div>
                  ) : (
                    <span className="rounded-full bg-ink-soft/15 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                      Pending review
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}