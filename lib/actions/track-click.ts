"use server";

import { createClient } from "@/lib/supabase/server";

export async function logWhatsAppClick(
  productId: string,
  source: "product_page" | "footer" | "product_card" = "product_page"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("click_events")
    .insert({ product_id: productId, source });

  if (error) {
    // On ne bloque jamais l'UX pour un souci de tracking
    console.error("click_events insert failed:", error.message);
  }
}