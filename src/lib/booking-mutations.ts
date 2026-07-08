"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CancelBookingState = { error?: string } | null;

export async function cancelBooking(bookingId: string): Promise<CancelBookingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("id, student_id, payment_status, listings ( landlord_id )")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { error: "Booking not found." };
  }

  const listingData = booking.listings as unknown as { landlord_id: string } | null;
  const isStudent = booking.student_id === user.id;
  const isLandlord = listingData?.landlord_id === user.id;

  if (!isStudent && !isLandlord) {
    return { error: "You don't have permission to cancel this booking." };
  }

  if (booking.payment_status === "cancelled" || booking.payment_status === "declined") {
    return { error: "This booking is already cancelled." };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ payment_status: "cancelled" })
    .eq("id", bookingId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/my-bookings");
  revalidatePath("/dashboard");
  return null;
}