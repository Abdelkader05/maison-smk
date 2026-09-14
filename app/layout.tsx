import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: "SMK Market - Chaussures",
  description: "Catalogue de chaussures a Bamako. Commandez directement via WhatsApp.",
  openGraph: {
    title: "SMK Market - Chaussures",
    description: "Catalogue de chaussures a Bamako. Commandez directement via WhatsApp.",
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}