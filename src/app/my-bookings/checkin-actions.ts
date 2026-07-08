"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ConfirmCheckInState = { error?: string } | null;

export async function confirmCheckIn(checkInId: string): Promise<ConfirmCheckInState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { data: checkIn, error: fetchError } = await supabase
    .from("check_ins")
    .select("id, bookings ( student_id )")
    .eq("id", checkInId)
    .single();

  if (fetchError || !checkIn) {
    return { error: "Check-in not found." };
  }

  const bookingData = checkIn.bookings as unknown as { student_id: string } | null;
  if (!bookingData || bookingData.student_id !== user.id) {
    return { error: "You don't have permission to confirm this check-in." };
  }

  const { error: updateError } = await supabase
    .from("check_ins")
    .update({ status: "confirmed" })
    .eq("id", checkInId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/my-bookings");
  return null;
}