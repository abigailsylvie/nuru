import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export type MyCheckIn = {
  id: string;
  bookingId: string;
  scheduledFor: string;
  status: "pending" | "confirmed" | "missed";
  parentContact: string | null;
  listingTitle: string | null;
};

type CheckInRow = {
  id: string;
  scheduled_for: string;
  status: MyCheckIn["status"];
  parent_contact: string | null;
  bookings: {
    id: string;
    student_id: string;
    listings: { title: string } | null;
  } | null;
};

export async function getMyCheckIns(): Promise<MyCheckIn[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("check_ins")
    .select(
      "id, scheduled_for, status, parent_contact, bookings!inner ( id, student_id, listings ( title ) )",
    )
    .eq("bookings.student_id", user.id)
    .order("scheduled_for", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch check-ins:", error);
    return [];
  }

  return (data as unknown as CheckInRow[])
    .filter((row) => row.bookings)
    .map((row) => ({
      id: row.id,
      bookingId: row.bookings!.id,
      scheduledFor: row.scheduled_for,
      status: row.status,
      parentContact: row.parent_contact,
      listingTitle: row.bookings!.listings?.title ?? null,
    }));
}