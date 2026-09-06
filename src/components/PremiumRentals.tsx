import { getPremiumProperties } from "@/actions/property";
import PremiumRentalsClient from "./PremiumRentalsClient";
import PopularBungalowsLinks from "./PopularBungalowsLinks";
import PopularPortionsLinks from "./PopularPortionsLinks";
import PopularApartmentsLinks from "./PopularApartmentsLinks";
import DhaApartmentsForRentLinks from "./DhaApartmentsForRentLinks";
import PopularCommercialLinks from "./PopularCommercialLinks";
import { Flame } from "lucide-react";
import Link from "next/link";

export default async function PremiumRentals() {
  const rawProperties = await getPremiumProperties();

  if (!rawProperties || rawProperties.length === 0) {
    return null;
  }

  const properties = rawProperties.map((p: any) => ({
    ...p,
    rentPrice: Number(p.rentPrice),
  }));

  return (
    <div className="space-y-3 pt-0 mt-2 sm:mt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-[#E53935]">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] tracking-tight">
              EXCLUSIVE PREMIUM RENTALS
            </h2>
            <p className="text-[11px] font-bold uppercase text-stone-400">
              HANDPICKED LUXURY LISTINGS IN DHA KARACHI
            </p>
          </div>
        </div>

        <Link
          href="/properties"
          className="text-xs font-black uppercase text-[#657A68] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>VIEW ALL ADS</span>
        </Link>
      </div>

      {/* Premium Cards Slider */}
      <PremiumRentalsClient properties={properties} />

      {/* SEO 1: Most Popular Location Bungalows For Rent */}
      <PopularBungalowsLinks />

      {/* SEO 2: Most Popular Location Portions For Rent (Phase 8, 6, 7, 5 | 1000, 500, 300, 250, 120, 100 YD) */}
      <PopularPortionsLinks />

      {/* SEO 3: Most Popular Location Apartments For Rent */}
      <PopularApartmentsLinks />

      {/* SEO 4: Apartments For Rent DHA Karachi */}
      <DhaApartmentsForRentLinks />

      {/* SEO 5: Most Popular Location Commercial For Rent */}
      <PopularCommercialLinks />
    </div>
  );
}