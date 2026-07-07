import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { listings as mockListings, type Listing } from "@/lib/listings";

type ListingRow = {
  id: string;
  title: string;
  city: string;
  country: string;
  price_per_month: number;
  currency: string;
  room_type: Listing["roomType"];
  distance_label: string | null;
  description: string | null;
  amenities: string[] | null;
  image_url: string | null;
  verified: boolean;
  profiles: {
    full_name: string | null;
    verified: boolean;
    verified_since: string | null;
    response_time_label: string | null;
  } | null;
};

function mapRowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    country: row.country,
    pricePerMonth: row.price_per_month,
    currency: row.currency,
    verified: row.verified,
    roomType: row.room_type,
    distanceLabel: row.distance_label ?? "",
    image: row.image_url ?? "",
    landlord: {
      name: row.profiles?.full_name ?? "Landlord",
      verifiedSince: row.profiles?.verified_since ?? "Pending",
      responseTime:
        row.profiles?.response_time_label ?? "Usually replies within a day",
    },
    amenities: row.amenities ?? [],
    description: row.description ?? "",
  };
}

/**
 * Returns real listings from Supabase once it's configured; falls back to
 * the local mock data (src/lib/listings.ts) so the app keeps working during
 * frontend-first development, before a Supabase project is wired up.
 */
export async function getAllListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured()) {
    return mockListings;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(
        "id, title, city, country, price_per_month, currency, room_type, distance_label, description, amenities, image_url, verified, profiles ( full_name, verified, verified_since, response_time_label )",
      )
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Supabase listings fetch failed, using mock data:", error);
      return mockListings;
    }

    return (data as unknown as ListingRow[]).map(mapRowToListing);
  } catch (err) {
    console.error("Supabase listings fetch threw, using mock data:", err);
    return mockListings;
  }
}

export async function getListing(id: string): Promise<Listing | undefined> {
  if (!isSupabaseConfigured()) {
    return mockListings.find((listing) => listing.id === id);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(
        "id, title, city, country, price_per_month, currency, room_type, distance_label, description, amenities, image_url, verified, profiles ( full_name, verified, verified_since, response_time_label )",
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return mockListings.find((listing) => listing.id === id);
    }

    return mapRowToListing(data as unknown as ListingRow);
  } catch {
    return mockListings.find((listing) => listing.id === id);
  }
}
