"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { sendEmail, newBookingRequestEmail } from "@/lib/email";

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

  const { data: listing } = await supabase
    .from("listings")
    .select("title, landlord_id, profiles ( email )")
    .eq("id", listingId)
    .single();

  const { data: studentProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const landlordEmail = (listing?.profiles as unknown as { email: string } | null)?.email;
  if (listing && landlordEmail) {
    await sendEmail({
      to: landlordEmail,
      ...newBookingRequestEmail(listing.title, studentProfile?.full_name ?? "A student"),
    });
  }

  return { success: true };
}