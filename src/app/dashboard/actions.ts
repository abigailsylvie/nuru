"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BookingActionState = { error?: string } | null;

async function updateBookingStatus(
  bookingId: string,
  newStatus: "held" | "declined",
): Promise<BookingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("id, listings ( landlord_id )")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { error: "Booking not found." };
  }

  const listingData = booking.listings as unknown as { landlord_id: string } | null;
  if (!listingData || listingData.landlord_id !== user.id) {
    return { error: "You don't have permission to update this booking." };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ payment_status: newStatus })
    .eq("id", bookingId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  return null;
}

export async function approveBooking(bookingId: string): Promise<BookingActionState> {
  return updateBookingStatus(bookingId, "held");
}

export async function declineBooking(bookingId: string): Promise<BookingActionState> {
  return updateBookingStatus(bookingId, "declined");
}