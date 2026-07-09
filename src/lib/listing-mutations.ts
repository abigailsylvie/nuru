"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ListingMutationState = { error?: string; success?: boolean } | null;

async function assertOwnsListing(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: "You must be logged in." } as const;
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, landlord_id")
    .eq("id", listingId)
    .single();

  if (error || !listing) {
    return { supabase, user, error: "Listing not found." } as const;
  }

  if (listing.landlord_id !== user.id) {
    return { supabase, user, error: "You don't own this listing." } as const;
  }

  return { supabase, user, error: null } as const;
}

export async function updateListing(
  listingId: string,
  _prevState: ListingMutationState,
  formData: FormData,
): Promise<ListingMutationState> {
  const check = await assertOwnsListing(listingId);
  if (check.error) return { error: check.error };
  const { supabase } = check;

  const title = String(formData.get("title") ?? "");
  const city = String(formData.get("city") ?? "");
  const country = String(formData.get("country") ?? "");
  const roomType = String(formData.get("roomType") ?? "Private room");
  const price = Number(formData.get("price") ?? 0);
  const currency = String(formData.get("currency") ?? "");
  const description = String(formData.get("description") ?? "");
  const photo = formData.get("photo") as File | null;

  const updatePayload: Record<string, unknown> = {
    title,
    city,
    country,
    room_type: roomType,
    price_per_month: price,
    currency,
    description,
  };

  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop();
    const filePath = `${check.user!.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-photos")
      .upload(filePath, photo);

    if (uploadError) {
      return { error: `Photo upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-photos").getPublicUrl(filePath);
    updatePayload.image_url = publicUrl;
  }

  const { error: updateError } = await supabase
    .from("listings")
    .update(updatePayload)
    .eq("id", listingId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/listings");
  revalidatePath(`/listings/${listingId}`);
  return { success: true };
}

export async function deleteListing(listingId: string): Promise<ListingMutationState> {
  const check = await assertOwnsListing(listingId);
  if (check.error) return { error: check.error };

  const { error } = await check.supabase.from("listings").delete().eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/listings");
  return { success: true };
}

export async function updateListingAndRedirect(
  listingId: string,
  _prevState: ListingMutationState,
  formData: FormData,
): Promise<ListingMutationState> {
  const result = await updateListing(listingId, _prevState, formData);
  if (result?.success) {
    redirect("/dashboard");
  }
  return result;
}