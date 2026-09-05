import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gorentaldha.com"),
  title: {
    default: "GO RENTAL DHA | Verified Houses, Flats & Apartments For Rent in DHA Karachi",
    template: "%s | GO RENTAL DHA",
  },
  description:
    "Pakistan's premier luxury rental platform for DHA Karachi. Rent luxury houses, furnished flats, portion houses, and sea-facing apartments in DHA Phase 1 to 8, Emaar Oceanfront, HMR Waterfront, and Creek Vistas.",
  keywords: [
    // 1. Core High-Intent Rental Keywords
    "property for rent in dha karachi",
    "house for rent dha karachi",
    "flat for rent in dha karachi",
    "apartment for rent dha karachi",
    "portion for rent in dha karachi",
    "upper portion for rent dha karachi",
    "lower portion for rent dha karachi",
    "furnished apartment for rent dha karachi",
    "furnished house for rent in dha karachi",
    "luxury penthouse for rent karachi",
    "room for rent in dha karachi",

    // 2. High-Demand Waterfront & Tower Listings
    "apartment for rent in emaar karachi",
    "emaar crescent bay flat for rent",
    "emaar pearl towers for rent",
    "emaar the views apartment for rent",
    "emaar reef towers rent",
    "emaar coral towers apartment",
    "flat for rent in hmr waterfront",
    "hmr waterfront h1 tower for rent",
    "hmr waterfront saima tower rent",
    "creek vistas flat for rent",
    "creek marina apartment for rent",
    "the arkadians apartment for rent",
    "sea facing apartment for rent in karachi",
    "beachfront luxury flat for rent dha 8",

    // 3. Phase-Wise Rental Targets
    "dha phase 8 house for rent",
    "dha phase 8 apartment for rent",
    "dha phase 6 house for rent",
    "dha phase 6 apartment for rent",
    "dha phase 5 house for rent",
    "dha phase 5 portion for rent",
    "dha phase 2 flat for rent",
    "dha phase 4 house for rent",
    "dha phase 7 house for rent",
    "dha phase 7 ext portion for rent",
    "dha phase 1 flat for rent karachi",

    // 4. Size & Specification Queries
    "500 sq yards house for rent dha karachi",
    "1000 sq yards bungalow for rent dha karachi",
    "240 sq yards house for rent dha karachi",
    "120 sq yards portion for rent dha karachi",
    "2 bedroom flat for rent in dha karachi",
    "3 bedroom apartment for rent in emaar",
    "4 bed luxury house for rent dha karachi",

    // 5. Commercial & Office Inquiries
    "commercial office for rent dha karachi",
    "shop for rent in dha karachi",
    "commercial space for rent dha phase 6",
    "bukhari commercial office for rent",
    "itihad commercial shop for rent",
    "shahbaz commercial office for rent",
    "sehar commercial space for rent",

    // 6. Brand & Direct Searches
    "go rental dha",
    "gorentaldha",
    "go rental",
    "dha rental properties karachi",
    "verified real estate rental dha karachi",
  ],
  authors: [{ name: "GO RENTAL DHA" }],
  creator: "GO RENTAL DHA",
  publisher: "GO RENTAL DHA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://www.gorentaldha.com",
    title: "GO RENTAL DHA | Houses, Flats & Apartments For Rent in DHA Karachi",
    description:
      "Find verified rental properties across DHA Karachi Phases 1-8, Emaar Oceanfront, HMR Waterfront, and Creek Vistas.",
    siteName: "GO RENTAL DHA",
  },
  twitter: {
    card: "summary_large_image",
    title: "GO RENTAL DHA | Premier Rental Directory in DHA Karachi",
    description:
      "Find verified rental properties across DHA Karachi Phases 1-8, Emaar Oceanfront, HMR Waterfront, and Creek Vistas.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen flex flex-col bg-[#FBFBF9] text-dark antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}