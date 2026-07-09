import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { EditListingForm } from "./EditListingForm";


export const metadata = {
  title: "Edit Listing — Nuru",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      "id, title, city, country, price_per_month, currency, room_type, description, landlord_id",
    )
    .eq("id", id)
    .single();

  if (error || !listing) {
    notFound();
  }

  if (listing.landlord_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Edit Listing
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Changes are saved immediately once submitted.
          </p>

          <EditListingForm
            listingId={listing.id}
            initialValues={{
              title: listing.title,
              city: listing.city,
              country: listing.country,
              roomType: listing.room_type,
              price: listing.price_per_month,
              currency: listing.currency,
              description: listing.description ?? "",
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}