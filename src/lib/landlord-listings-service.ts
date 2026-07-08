import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export type MyListing = {
  id: string;
  title: string;
  city: string;
  country: string;
  pricePerMonth: number;
  currency: string;
  roomType: string;
  verified: boolean;
  imageUrl: string | null;
  createdAt: string;
};

type ListingRow = {
  id: string;
  title: string;
  city: string;
  country: string;
  price_per_month: number;
  currency: string;
  room_type: string;
  verified: boolean;
  image_url: string | null;
  created_at: string;
};

export type CurrentUserInfo = {
  id: string;
  email: string | null;
  role: "student" | "landlord" | null;
};
export type ListingBooking = {
  id: string;
  listingId: string;
  listingTitle: string;
  studentName: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
};

type ListingBookingRow = {
  id: string;
  start_date: string;
  end_date: string;
  payment_status: string;
  listings: { id: string; title: string; landlord_id: string } | null;
  profiles: { full_name: string | null } | null;
};

export async function getBookingsForMyListings(): Promise<ListingBooking[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, start_date, end_date, payment_status, listings!inner ( id, title, landlord_id ), profiles ( full_name )",
    )
    .eq("listings.landlord_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch bookings for landlord listings:", error);
    return [];
  }

  return (data as unknown as ListingBookingRow[])
    .filter((row) => row.listings)
    .map((row) => ({
      id: row.id,
      listingId: row.listings!.id,
      listingTitle: row.listings!.title,
      studentName: row.profiles?.full_name ?? "Student",
      startDate: row.start_date,
      endDate: row.end_date,
      paymentStatus: row.payment_status,
    }));
}
export async function getCurrentUserInfo(): Promise<CurrentUserInfo | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as CurrentUserInfo["role"]) ?? null,
  };
}

export async function getMyListings(): Promise<MyListing[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, title, city, country, price_per_month, currency, room_type, verified, image_url, created_at",
    )
    .eq("landlord_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch landlord listings:", error);
    return [];
  }

  return (data as ListingRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    city: row.city,
    country: row.country,
    pricePerMonth: row.price_per_month,
    currency: row.currency,
    roomType: row.room_type,
    verified: row.verified,
    imageUrl: row.image_url,
    createdAt: row.created_at,
  }));
}