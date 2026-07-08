import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ListingsBrowser } from "@/components/ListingsBrowser";
import { getAllListings } from "@/lib/listings-service";

export const metadata = {
  title: "Find verified student housing Nuru",
};

export default async function ListingsPage() {
  const listings = await getAllListings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Verified housing near you
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            {listings.length} listings across Dakar, Yaoundé, Casablanca, Cape
            Town, and Nairobi. Verified listings have passed landlord ID and
            property checks.
          </p>
          <div className="mt-10">
            <ListingsBrowser listings={listings} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
