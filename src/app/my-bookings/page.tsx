import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getMyBookings } from "@/lib/bookings-service";
import { formatPrice } from "@/lib/listings";

export const metadata = {
  title: "My Bookings — Nuru",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending confirmation",
  held: "Confirmed — payment held",
  released: "Completed",
  refunded: "Refunded",
  declined: "Declined by landlord",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "text-gold-dim border-gold/30 bg-gold/5",
  held: "text-teal-dim border-teal/30 bg-teal/5",
  released: "text-ink-soft border-line bg-paper",
  refunded: "text-clay border-clay/30 bg-clay/5",
  declined: "text-clay border-clay/30 bg-clay/5",
  cancelled: "text-ink-soft border-line bg-paper",
};

const CANCELLABLE_STATUSES = new Set(["pending", "held"]);

export default async function MyBookingsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <p className="text-sm text-ink-soft">
              Supabase isn&apos;t connected yet, so there are no real bookings to show.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const bookings = await getMyBookings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {bookings.length === 0
              ? "You haven't requested any bookings yet."
              : `${bookings.length} booking${bookings.length === 1 ? "" : "s"}.`}
          </p>

          {bookings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="text-sm text-ink-soft">
                Once you request a booking on a listing, it will show up here.
              </p>
              <Link
                href="/listings"
                className="mt-4 inline-block text-sm font-medium text-teal hover:text-teal-dim"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-display text-base font-semibold text-ink">
                      {booking.listing?.title ?? "Listing no longer available"}
                    </p>
                    {booking.listing && (
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {booking.listing.city}, {booking.listing.country}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-ink-soft">
                      {new Date(booking.startDate).toLocaleDateString()} —{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    {booking.listing && (
                      <span className="font-mono text-sm font-medium text-ink">
                        {formatPrice(booking.listing.pricePerMonth, booking.listing.currency)}
                        <span className="text-ink-soft"> /mo</span>
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLOR[booking.paymentStatus] ?? ""}`}
                    >
                      {STATUS_LABEL[booking.paymentStatus] ?? booking.paymentStatus}
                    </span>
                    {CANCELLABLE_STATUSES.has(booking.paymentStatus) && (
                      <CancelBookingButton bookingId={booking.id} />
                    )}
                  </div>
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