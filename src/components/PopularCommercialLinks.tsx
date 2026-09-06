import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";

interface CommercialZoneData {
  zoneName: string;
  querySearch: string;
  offices: { label: string; minArea?: number; maxArea?: number }[];
  shops: { label: string; minArea?: number; maxArea?: number }[];
}

const COMMERCIAL_ZONES_DATA: CommercialZoneData[] = [
  {
    zoneName: "BUKHARI COMMERCIAL (PHASE 6)",
    querySearch: "BUKHARI",
    offices: [
      { label: "5000 SQ. FT CORPORATE FULL BUILDING IN BUKHARI", minArea: 4000, maxArea: 6000 },
      { label: "2000 SQ. FT FULL COMMERCIAL FLOOR IN BUKHARI", minArea: 1800, maxArea: 2400 },
      { label: "1000 SQ. FT COMMERCIAL OFFICE IN BUKHARI", minArea: 900, maxArea: 1200 },
      { label: "500 SQ. FT COMPACT OFFICE SPACE IN BUKHARI", minArea: 400, maxArea: 650 },
    ],
    shops: [
      { label: "1000 SQ. FT MAIN ROAD COMMERCIAL SHOWROOM", minArea: 900, maxArea: 1200 },
      { label: "500 SQ. FT GROUND FLOOR RUNNING SHOP IN BUKHARI", minArea: 450, maxArea: 600 },
      { label: "300 SQ. FT CORNER RETAIL SHOP IN BUKHARI", minArea: 250, maxArea: 350 },
      { label: "BASEMENT COMMERCIAL WAREHOUSE / SHOP SPACE", minArea: 500, maxArea: 1500 },
    ],
  },
  {
    zoneName: "ITTEHAD COMMERCIAL (PHASE 6)",
    querySearch: "ITTEHAD",
    offices: [
      { label: "3000 SQ. FT CORPORATE OFFICE FLOOR IN ITTEHAD", minArea: 2500, maxArea: 3500 },
      { label: "1500 SQ. FT COMMERCIAL OFFICE IN ITTEHAD", minArea: 1300, maxArea: 1700 },
      { label: "800 SQ. FT EXECUTIVE OFFICE SPACE IN ITTEHAD", minArea: 700, maxArea: 950 },
      { label: "400 SQ. FT IT / STARTUP OFFICE IN ITTEHAD", minArea: 350, maxArea: 550 },
    ],
    shops: [
      { label: "1200 SQ. FT DOUBLE HEIGHT SHOWROOM IN ITTEHAD", minArea: 1000, maxArea: 1500 },
      { label: "600 SQ. FT GROUND FLOOR RETAIL SHOP IN ITTEHAD", minArea: 500, maxArea: 750 },
      { label: "350 SQ. FT COMMERCIAL SHOP IN MAIN ITTEHAD", minArea: 300, maxArea: 450 },
      { label: "200 SQ. FT BOUTIQUE / DISPLAY SHOP IN ITTEHAD", minArea: 150, maxArea: 250 },
    ],
  },
  {
    zoneName: "SHAHBAZ COMMERCIAL (PHASE 6)",
    querySearch: "SHAHBAZ",
    offices: [
      { label: "2500 SQ. FT FULL COMMERCIAL FLOOR IN SHAHBAZ", minArea: 2200, maxArea: 2800 },
      { label: "1200 SQ. FT CORPORATE OFFICE IN SHAHBAZ", minArea: 1000, maxArea: 1400 },
      { label: "700 SQ. FT EXECUTIVE OFFICE SPACE IN SHAHBAZ", minArea: 600, maxArea: 850 },
    ],
    shops: [
      { label: "800 SQ. FT GROUND FLOOR BRAND OUTLET SHOP", minArea: 700, maxArea: 950 },
      { label: "500 SQ. FT PRIME LOCATION COMMERCIAL SHOP", minArea: 450, maxArea: 600 },
      { label: "250 SQ. FT RETAIL CORNER SHOP IN SHAHBAZ", minArea: 200, maxArea: 300 },
    ],
  },
  {
    zoneName: "MUSLIM COMMERCIAL (PHASE 6)",
    querySearch: "MUSLIM",
    offices: [
      { label: "2000 SQ. FT OFFICE FLOOR IN MUSLIM COMMERCIAL", minArea: 1800, maxArea: 2300 },
      { label: "1000 SQ. FT COMMERCIAL OFFICE SPACE", minArea: 900, maxArea: 1200 },
      { label: "500 SQ. FT RUNNING OFFICE CABIN SET", minArea: 400, maxArea: 650 },
    ],
    shops: [
      { label: "1000 SQ. FT SHOWROOM SPACE IN MUSLIM COMMERCIAL", minArea: 900, maxArea: 1200 },
      { label: "600 SQ. FT GROUND FLOOR SHOP WITH BASEMENT", minArea: 500, maxArea: 750 },
      { label: "300 SQ. FT RUNNING GROCERY / PHARMACY SHOP", minArea: 250, maxArea: 350 },
    ],
  },
  {
    zoneName: "BADAR COMMERCIAL (PHASE 5)",
    querySearch: "BADAR",
    offices: [
      { label: "2000 SQ. FT FULL FLOOR OFFICE IN BADAR", minArea: 1800, maxArea: 2200 },
      { label: "1000 SQ. FT CORPORATE OFFICE SPACE IN BADAR", minArea: 900, maxArea: 1200 },
      { label: "600 SQ. FT COMMERCIAL OFFICE IN BADAR", minArea: 500, maxArea: 750 },
    ],
    shops: [
      { label: "1000 SQ. FT PRIME LOCATION GROUND FLOOR SHOP", minArea: 850, maxArea: 1200 },
      { label: "500 SQ. FT RUNNING FOOD / RETAIL SHOP", minArea: 450, maxArea: 600 },
      { label: "250 SQ. FT COMPACT SHOP IN 26TH STREET BADAR", minArea: 200, maxArea: 300 },
    ],
  },
  {
    zoneName: "NISHAT & SEHAR COMMERCIAL (PHASE 6 & 7)",
    querySearch: "NISHAT",
    offices: [
      { label: "2500 SQ. FT MODERN OFFICE FLOOR IN SEHAR", minArea: 2200, maxArea: 2800 },
      { label: "1200 SQ. FT COMMERCIAL OFFICE IN NISHAT", minArea: 1000, maxArea: 1400 },
      { label: "600 SQ. FT STUDIO OFFICE IN NISHAT / SEHAR", minArea: 500, maxArea: 750 },
    ],
    shops: [
      { label: "800 SQ. FT MAIN ROAD COMMERCIAL SHOWROOM", minArea: 700, maxArea: 950 },
      { label: "450 SQ. FT GROUND FLOOR COMMERCIAL SHOP", minArea: 400, maxArea: 550 },
      { label: "300 SQ. FT RUNNING RETAIL SHOP IN SEHAR", minArea: 250, maxArea: 350 },
    ],
  },
  {
    zoneName: "ZAMZAMA & TAUHEED COMMERCIAL (PHASE 5)",
    querySearch: "ZAMZAMA",
    offices: [
      { label: "3000 SQ. FT CORPORATE FLOOR ON ZAMZAMA BLVD", minArea: 2500, maxArea: 3500 },
      { label: "1500 SQ. FT DESIGNER STUDIO / OFFICE IN TAUHEED", minArea: 1300, maxArea: 1800 },
      { label: "700 SQ. FT LAW FIRM / CLINIC OFFICE SPACE", minArea: 600, maxArea: 850 },
    ],
    shops: [
      { label: "1500 SQ. FT FLAGSHIP LUXURY STORE ON MAIN ZAMZAMA", minArea: 1200, maxArea: 1800 },
      { label: "700 SQ. FT GROUND FLOOR BOUTIQUE SHOP", minArea: 600, maxArea: 850 },
      { label: "400 SQ. FT HIGH FOOTFALL SHOP ON LANE 4 / 5", minArea: 350, maxArea: 500 },
    ],
  },
  {
    zoneName: "COMMERCIAL EXTENSION (PHASE 2 & KORANGI ROAD)",
    querySearch: "PHASE 2 EXT",
    offices: [
      { label: "4000 SQ. FT CALL CENTER / SOFTWARE HOUSE FLOOR", minArea: 3500, maxArea: 5000 },
      { label: "2000 SQ. FT COMMERCIAL OFFICE ON MAIN KORANGI ROAD", minArea: 1800, maxArea: 2300 },
      { label: "1000 SQ. FT READY TO MOVE OFFICE IN PHASE 2 EXT", minArea: 900, maxArea: 1200 },
    ],
    shops: [
      { label: "1200 SQ. FT MAIN ROAD AUTO / HARDWARE SHOWROOM", minArea: 1000, maxArea: 1500 },
      { label: "600 SQ. FT GROUND FLOOR WHOLESALE / RETAIL SHOP", minArea: 500, maxArea: 750 },
      { label: "300 SQ. FT CORNER COMMERCIAL SHOP IN EXTENSION", minArea: 250, maxArea: 350 },
    ],
  },
];

export default function PopularCommercialLinks() {
  return (
    <section className="pt-6 sm:pt-8 border-t border-stone-200/80 mt-6">
      {/* 1. Main Heading h2 */}
      <div className="space-y-1 mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#657A68]" />
          MOST POPULAR LOCATION COMMERCIAL FOR RENT
        </h2>
        {/* 2. Sub Heading h3 */}
        <h3 className="text-xs sm:text-sm font-black uppercase text-[#657A68] tracking-wider pl-4">
          DHA KARACHI
        </h3>
      </div>

      {/* 3. Commercial Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {COMMERCIAL_ZONES_DATA.map((zone) => (
          <div
            key={zone.zoneName}
            className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs hover:border-[#657A68]/40 transition-colors"
          >
            {/* Zone Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-black uppercase text-[#1A1F1C] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#657A68]" />
                <span>{zone.zoneName}</span>
              </span>
              <Link
                href={`/properties?search=${encodeURIComponent(zone.querySearch)}&type=COMMERCIAL`}
                className="text-[10px] font-black uppercase text-[#657A68] hover:underline"
              >
                VIEW ALL
              </Link>
            </div>

            {/* 2 Columns: Col 1 (Commercial Offices) | Col 2 (Shops & Showrooms) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {/* Offices Column */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider pb-0.5 border-b border-stone-50">
                  OFFICES & FLOORS
                </span>
                {zone.offices.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?search=${encodeURIComponent(
                      zone.querySearch
                    )}&type=COMMERCIAL${
                      link.minArea ? `&minArea=${link.minArea}&maxArea=${link.maxArea}` : ""
                    }`}
                    className="group flex items-start gap-1.5 text-[11px] font-bold uppercase text-stone-600 hover:text-[#1A1F1C] transition-colors leading-relaxed"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#657A68] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Shops Column */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider pb-0.5 border-b border-stone-50">
                  SHOPS & SHOWROOMS
                </span>
                {zone.shops.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?search=${encodeURIComponent(
                      zone.querySearch
                    )}&type=COMMERCIAL${
                      link.minArea ? `&minArea=${link.minArea}&maxArea=${link.maxArea}` : ""
                    }`}
                    className="group flex items-start gap-1.5 text-[11px] font-bold uppercase text-stone-600 hover:text-[#1A1F1C] transition-colors leading-relaxed"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#657A68] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
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