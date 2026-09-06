import Link from "next/link";
import { ChevronRight, Building, Waves } from "lucide-react";

interface WaterfrontTowerLinksData {
  towerName: string;
  badge: string;
  searchQuery: string;
  phase: string;
  col1: { label: string; minArea: number; maxArea: number }[];
  col2: { label: string; minArea: number; maxArea: number }[];
}

const LUXURY_SEAFRONT_TOWERS: WaterfrontTowerLinksData[] = [
  {
    towerName: "EMAAR OCEANFRONT (CRESCENT BAY)",
    badge: "EMAAR CORAL & REEF",
    searchQuery: "EMAAR",
    phase: "PHASE 8",
    col1: [
      { label: "4500 SQ. FT PENTHOUSE FOR RENT IN EMAAR", minArea: 4000, maxArea: 6000 },
      { label: "3200 SQ. FT 4-BED DUPLEX IN EMAAR OCEANFRONT", minArea: 2900, maxArea: 3500 },
      { label: "2600 SQ. FT 3-BED LUXURY FLAT IN EMAAR", minArea: 2400, maxArea: 2800 },
    ],
    col2: [
      { label: "1800 SQ. FT 2-BED SEA VIEW APARTMENT IN EMAAR", minArea: 1600, maxArea: 2000 },
      { label: "1200 SQ. FT 1-BED APARTMENT IN EMAAR OCEANFRONT", minArea: 1000, maxArea: 1400 },
      { label: "800 SQ. FT STUDIO SUITE IN EMAAR", minArea: 600, maxArea: 950 },
    ],
  },
  {
    towerName: "HMR WATERFRONT",
    badge: "WATERFRONT LUXURY",
    searchQuery: "HMR WATERFRONT",
    phase: "PHASE 8",
    col1: [
      { label: "4000 SQ. FT EXECUTIVE PENTHOUSE IN HMR WATERFRONT", minArea: 3600, maxArea: 5000 },
      { label: "2700 SQ. FT 4-BED CORNER APARTMENT IN HMR", minArea: 2500, maxArea: 2900 },
      { label: "2100 SQ. FT 3-BED SEA VIEW FLAT IN HMR", minArea: 1900, maxArea: 2300 },
    ],
    col2: [
      { label: "1500 SQ. FT 2-BED APARTMENT IN HMR WATERFRONT", minArea: 1350, maxArea: 1650 },
      { label: "1100 SQ. FT 2-BED APARTMENT IN HMR", minArea: 950, maxArea: 1250 },
      { label: "750 SQ. FT 1-BED APARTMENT IN HMR WATERFRONT", minArea: 600, maxArea: 900 },
    ],
  },
  {
    towerName: "CREEK VISTA & THE ARKADIANS",
    badge: "CREEK CITY",
    searchQuery: "CREEK VISTA",
    phase: "PHASE 8",
    col1: [
      { label: "3500 SQ. FT 4-BED PENTHOUSE IN CREEK VISTA", minArea: 3200, maxArea: 4200 },
      { label: "2800 SQ. FT 4-BED APARTMENT IN THE ARKADIANS", minArea: 2600, maxArea: 3000 },
      { label: "2400 SQ. FT 3-BED APARTMENT IN CREEK VISTA", minArea: 2200, maxArea: 2550 },
    ],
    col2: [
      { label: "1700 SQ. FT 2-BED APARTMENT IN CREEK VISTA", minArea: 1500, maxArea: 1850 },
      { label: "1400 SQ. FT 2-BED APARTMENT IN THE ARKADIANS", minArea: 1250, maxArea: 1550 },
      { label: "900 SQ. FT 1-BED APARTMENT IN CREEK CITY", minArea: 750, maxArea: 1100 },
    ],
  },
  {
    towerName: "SEAVIEW & BEACH AVENUE LUXURY TOWERS",
    badge: "BEACH BOULEVARD",
    searchQuery: "SEAVIEW",
    phase: "PHASE 5 & 6",
    col1: [
      { label: "3200 SQ. FT 4-BED SEA FRONT DUPLEX ON BEACH AVE", minArea: 2900, maxArea: 3600 },
      { label: "2500 SQ. FT 3-BED FULL SEA VIEW FLAT IN PHASE 6", minArea: 2300, maxArea: 2700 },
      { label: "2000 SQ. FT 3-BED APARTMENT ON SEAVIEW DHA", minArea: 1800, maxArea: 2200 },
    ],
    col2: [
      { label: "1500 SQ. FT 2-BED APARTMENT ON SEAVIEW", minArea: 1350, maxArea: 1650 },
      { label: "1000 SQ. FT 2-BED APARTMENT IN SEAVIEW TOWERS", minArea: 900, maxArea: 1200 },
      { label: "650 SQ. FT 1-BED FURNISHED SEA FRONT FLAT", minArea: 500, maxArea: 800 },
    ],
  },
];

export default function PopularApartmentsLinks() {
  return (
    <section className="pt-6 sm:pt-8 border-t border-stone-200/80 mt-6">
      {/* Main Heading h2 */}
      <div className="space-y-1 mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] tracking-tight flex items-center gap-2">
          <Waves className="w-4 h-4 text-[#0284C7]" />
          MOST POPULAR LUXURY SEAFRONT TOWERS & APARTMENTS FOR RENT
        </h2>
        {/* Sub Heading h3 */}
        <h3 className="text-xs sm:text-sm font-black uppercase text-[#657A68] tracking-wider pl-6">
          DHA KARACHI (EMAAR, HMR & CREEK VISTA)
        </h3>
      </div>

      {/* 2x2 Grid for Seafront Towers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {LUXURY_SEAFRONT_TOWERS.map((tower) => (
          <div
            key={tower.towerName}
            className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs hover:border-[#0284C7]/40 transition-colors"
          >
            {/* Tower Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center">
                  <Building className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#1A1F1C] block">
                    {tower.towerName}
                  </span>
                  <span className="text-[9px] font-bold uppercase text-stone-400">
                    {tower.phase} • {tower.badge}
                  </span>
                </div>
              </div>

              <Link
                href={`/properties?search=${encodeURIComponent(tower.searchQuery)}&type=APARTMENT`}
                className="text-[10px] font-black uppercase text-[#0284C7] hover:underline shrink-0"
              >
                EXPLORE ALL
              </Link>
            </div>

            {/* 2 Columns by SQ. FT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {/* Column 1 (Penthouses & 3/4 Bed Large Flats) */}
              <div className="space-y-2">
                {tower.col1.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?search=${encodeURIComponent(
                      tower.searchQuery
                    )}&type=APARTMENT&minArea=${link.minArea}&maxArea=${link.maxArea}`}
                    className="group flex items-start gap-1.5 text-[11px] font-bold uppercase text-stone-600 hover:text-[#1A1F1C] transition-colors leading-relaxed"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Column 2 (2 Bed, 1 Bed & Studio Suites) */}
              <div className="space-y-2">
                {tower.col2.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?search=${encodeURIComponent(
                      tower.searchQuery
                    )}&type=APARTMENT&minArea=${link.minArea}&maxArea=${link.maxArea}`}
                    className="group flex items-start gap-1.5 text-[11px] font-bold uppercase text-stone-600 hover:text-[#1A1F1C] transition-colors leading-relaxed"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}