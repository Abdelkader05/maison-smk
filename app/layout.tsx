import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "SMK - Boutique officielle",
  description: "Découvrez l'univers de la marque SMK à Bamako. Commandez directement via WhatsApp.",
  openGraph: {
    title: "SMK - Boutique officielle",
    description: "Découvrez l'univers de la marque SMK à Bamako. Commandez directement via WhatsApp.",
    locale: 'fr_ML',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${workSans.variable} font-[family-name:var(--font-work-sans)]`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}