import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export type MyBooking = {
  id: string;
  startDate: string;
  endDate: string;
  paymentStatus: "pending" | "held" | "released" | "refunded";
  createdAt: string;
  listing: {
    id: string;
    title: string;
    city: string;
    country: string;
    pricePerMonth: number;
    currency: string;
    imageUrl: string | null;
  } | null;
};

type BookingRow = {
  id: string;
  start_date: string;
  end_date: string;
  payment_status: MyBooking["paymentStatus"];
  created_at: string;
  listings: {
    id: string;
    title: string;
    city: string;
    country: string;
    price_per_month: number;
    currency: string;
    image_url: string | null;
  } | null;
};

/**
 * Returns the bookings belonging to the currently logged-in student.
 * Returns an empty array (not mock data) if Supabase isn't configured or
 * no one is logged in — there's no meaningful mock booking to fall back to.
 */
export async function getMyBookings(): Promise<MyBooking[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, start_date, end_date, payment_status, created_at, listings ( id, title, city, country, price_per_month, currency, image_url )",
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }

  return (data as unknown as BookingRow[]).map((row) => ({
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    listing: row.listings
      ? {
          id: row.listings.id,
          title: row.listings.title,
          city: row.listings.city,
          country: row.listings.country,
          pricePerMonth: row.listings.price_per_month,
          currency: row.listings.currency,
          imageUrl: row.listings.image_url,
        }
      : null,
  }));
}