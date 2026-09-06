import Link from "next/link";
import { ChevronRight, Building2 } from "lucide-react";

interface PhaseApartmentData {
  phaseTitle: string;
  queryPhase: string;
  col1: { label: string; minArea: number; maxArea: number }[];
  col2: { label: string; minArea: number; maxArea: number }[];
}

const APARTMENT_SIZES_DATA: PhaseApartmentData[] = [
  {
    phaseTitle: "PHASE 8",
    queryPhase: "PHASE 8",
    col1: [
      { label: "2700 SQ. FT APARTMENT FOR RENT IN PHASE 8", minArea: 2500, maxArea: 2700 },
      { label: "2000 SQ. FT APARTMENT FOR RENT IN PHASE 8", minArea: 1800, maxArea: 2200 },
      { label: "1500 SQ. FT APARTMENT FOR RENT IN PHASE 8", minArea: 1400, maxArea: 1650 },
    ],
    col2: [
      { label: "1200 SQ. FT APARTMENT FOR RENT IN PHASE 8", minArea: 1100, maxArea: 1300 },
      { label: "900 SQ. FT APARTMENT FOR RENT IN PHASE 8", minArea: 800, maxArea: 1000 },
      { label: "500 SQ. FT APARTMENT FOR RENT IN PHASE 8", minArea: 400, maxArea: 650 },
    ],
  },
  {
    phaseTitle: "PHASE 6",
    queryPhase: "PHASE 6",
    col1: [
      { label: "2700 SQ. FT APARTMENT FOR RENT IN PHASE 6", minArea: 2500, maxArea: 2700 },
      { label: "2000 SQ. FT APARTMENT FOR RENT IN PHASE 6", minArea: 1800, maxArea: 2200 },
      { label: "1500 SQ. FT APARTMENT FOR RENT IN PHASE 6", minArea: 1400, maxArea: 1650 },
    ],
    col2: [
      { label: "1200 SQ. FT APARTMENT FOR RENT IN PHASE 6", minArea: 1100, maxArea: 1300 },
      { label: "900 SQ. FT APARTMENT FOR RENT IN PHASE 6", minArea: 800, maxArea: 1000 },
      { label: "500 SQ. FT APARTMENT FOR RENT IN PHASE 6", minArea: 400, maxArea: 650 },
    ],
  },
  {
    phaseTitle: "PHASE 7",
    queryPhase: "PHASE 7",
    col1: [
      { label: "2700 SQ. FT APARTMENT FOR RENT IN PHASE 7", minArea: 2500, maxArea: 2700 },
      { label: "2000 SQ. FT APARTMENT FOR RENT IN PHASE 7", minArea: 1800, maxArea: 2200 },
      { label: "1500 SQ. FT APARTMENT FOR RENT IN PHASE 7", minArea: 1400, maxArea: 1650 },
    ],
    col2: [
      { label: "1200 SQ. FT APARTMENT FOR RENT IN PHASE 7", minArea: 1100, maxArea: 1300 },
      { label: "900 SQ. FT APARTMENT FOR RENT IN PHASE 7", minArea: 800, maxArea: 1000 },
      { label: "500 SQ. FT APARTMENT FOR RENT IN PHASE 7", minArea: 400, maxArea: 650 },
    ],
  },
  {
    phaseTitle: "PHASE 5",
    queryPhase: "PHASE 5",
    col1: [
      { label: "2700 SQ. FT APARTMENT FOR RENT IN PHASE 5", minArea: 2500, maxArea: 2700 },
      { label: "2000 SQ. FT APARTMENT FOR RENT IN PHASE 5", minArea: 1800, maxArea: 2200 },
      { label: "1500 SQ. FT APARTMENT FOR RENT IN PHASE 5", minArea: 1400, maxArea: 1650 },
    ],
    col2: [
      { label: "1200 SQ. FT APARTMENT FOR RENT IN PHASE 5", minArea: 1100, maxArea: 1300 },
      { label: "900 SQ. FT APARTMENT FOR RENT IN PHASE 5", minArea: 800, maxArea: 1000 },
      { label: "500 SQ. FT APARTMENT FOR RENT IN PHASE 5", minArea: 400, maxArea: 650 },
    ],
  },
  {
    phaseTitle: "PHASE 4",
    queryPhase: "PHASE 4",
    col1: [
      { label: "2700 SQ. FT APARTMENT FOR RENT IN PHASE 4", minArea: 2500, maxArea: 2700 },
      { label: "2000 SQ. FT APARTMENT FOR RENT IN PHASE 4", minArea: 1800, maxArea: 2200 },
      { label: "1500 SQ. FT APARTMENT FOR RENT IN PHASE 4", minArea: 1400, maxArea: 1650 },
    ],
    col2: [
      { label: "1200 SQ. FT APARTMENT FOR RENT IN PHASE 4", minArea: 1100, maxArea: 1300 },
      { label: "900 SQ. FT APARTMENT FOR RENT IN PHASE 4", minArea: 800, maxArea: 1000 },
      { label: "500 SQ. FT APARTMENT FOR RENT IN PHASE 4", minArea: 400, maxArea: 650 },
    ],
  },
  {
    phaseTitle: "PHASE 2",
    queryPhase: "PHASE 2",
    col1: [
      { label: "2700 SQ. FT APARTMENT FOR RENT IN PHASE 2", minArea: 2500, maxArea: 2700 },
      { label: "2000 SQ. FT APARTMENT FOR RENT IN PHASE 2", minArea: 1800, maxArea: 2200 },
      { label: "1500 SQ. FT APARTMENT FOR RENT IN PHASE 2", minArea: 1400, maxArea: 1650 },
    ],
    col2: [
      { label: "1200 SQ. FT APARTMENT FOR RENT IN PHASE 2", minArea: 1100, maxArea: 1300 },
      { label: "900 SQ. FT APARTMENT FOR RENT IN PHASE 2", minArea: 800, maxArea: 1000 },
      { label: "500 SQ. FT APARTMENT FOR RENT IN PHASE 2", minArea: 400, maxArea: 650 },
    ],
  },
];

export default function DhaApartmentsForRentLinks() {
  return (
    <section className="pt-6 sm:pt-8 border-t border-stone-200/80 mt-6">
      {/* 1. Main Heading h2 */}
      <div className="space-y-1 mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#657A68]" />
          APARTMENTS FOR RENT
        </h2>
        {/* 2. Sub Heading h3 */}
        <h3 className="text-xs sm:text-sm font-black uppercase text-[#657A68] tracking-wider pl-4">
          DHA KARACHI
        </h3>
      </div>

      {/* 3. Phases Grid (Phase 8, 6, 7, 5, 4, 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {APARTMENT_SIZES_DATA.map((item) => (
          <div
            key={item.phaseTitle}
            className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs hover:border-[#657A68]/40 transition-colors"
          >
            {/* Phase Sub-Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-black uppercase text-[#1A1F1C] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#657A68]" />
                <span>{item.phaseTitle} APARTMENTS</span>
              </span>
              <Link
                href={`/properties?phase=${encodeURIComponent(item.queryPhase)}&type=APARTMENT`}
                className="text-[10px] font-black uppercase text-[#657A68] hover:underline"
              >
                VIEW ALL
              </Link>
            </div>

            {/* 2 Columns: (2700, 2000, 1500) | (1200, 900, 500) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {/* Left Column */}
              <div className="space-y-2">
                {item.col1.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?phase=${encodeURIComponent(
                      item.queryPhase
                    )}&type=APARTMENT&minArea=${link.minArea}&maxArea=${link.maxArea}`}
                    className="group flex items-start gap-1.5 text-[11px] font-bold uppercase text-stone-600 hover:text-[#1A1F1C] transition-colors leading-relaxed"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#657A68] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                {item.col2.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?phase=${encodeURIComponent(
                      item.queryPhase
                    )}&type=APARTMENT&minArea=${link.minArea}&maxArea=${link.maxArea}`}
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