"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export type BookingState = { error?: string; success?: boolean } | null;

export async function requestBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase isn't connected yet. Add your project keys to .env.local first.",
    };
  }

  const listingId = String(formData.get("listingId") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Log in as a student first to request a booking." };
  }

  const { error } = await supabase.from("bookings").insert({
    listing_id: listingId,
    student_id: user.id,
    start_date: startDate,
    end_date: endDate,
    payment_status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
