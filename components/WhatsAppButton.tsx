"use client";

import { logWhatsAppClick } from "@/lib/actions/track-click";

export function WhatsAppButton({
  productId,
  productName,
  price,
  source = "product_page",
}: {
  productId: string;
  productName: string;
  price: string; // déjà formaté via formatPrice
  source?: "product_page" | "footer" | "product_card";
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Bonjour, je suis interesse(e) par : ${productName} (${price})`;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // fire-and-forget : ne bloque pas l'ouverture de WhatsApp
        logWhatsAppClick(productId, source);
      }}
    >
      Commander sur WhatsApp
    </a>
  );
}