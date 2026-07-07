"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export type ListingFormState = { error?: string; success?: boolean } | null;

export async function submitListing(
  _prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase isn't connected yet. Add your project keys to .env.local first.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Log in as a landlord first to list a property." };
  }

  const title = String(formData.get("title") ?? "");
  const city = String(formData.get("city") ?? "");
  const country = String(formData.get("country") ?? "");
  const roomType = String(formData.get("roomType") ?? "Private room");
  const price = Number(formData.get("price") ?? 0);
  const currency = String(formData.get("currency") ?? "");
  const description = String(formData.get("description") ?? "");
  const photo = formData.get("photo") as File | null;

  let imageUrl: string | null = null;

  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-photos")
      .upload(filePath, photo);

    if (uploadError) {
      return { error: `Photo upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-photos").getPublicUrl(filePath);
    imageUrl = publicUrl;
  }

  const { error } = await supabase.from("listings").insert({
    landlord_id: user.id,
    title,
    city,
    country,
    price_per_month: price,
    currency,
    room_type: roomType,
    description,
    image_url: imageUrl,
    verified: false,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/listings");
  return { success: true };
}
