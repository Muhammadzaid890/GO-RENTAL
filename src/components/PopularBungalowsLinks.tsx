import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface PhaseLinksData {
  phaseName: string;
  queryPhase: string;
  col1: { label: string; minArea: number; maxArea: number }[];
  col2: { label: string; minArea: number; maxArea: number }[];
}

const PHASES_DATA: PhaseLinksData[] = [
  {
    phaseName: "PHASE 8",
    queryPhase: "PHASE 8",
    col1: [
      { label: "2000 YARD BUNGALOW FOR RENT IN PHASE 8", minArea: 1800, maxArea: 2200 },
      { label: "1000 YARD BUNGALOW FOR RENT IN PHASE 8", minArea: 900, maxArea: 1100 },
      { label: "500 YARD BUNGALOW FOR RENT IN PHASE 8", minArea: 450, maxArea: 550 },
    ],
    col2: [
      { label: "300 YARD BUNGALOW FOR RENT IN PHASE 8", minArea: 280, maxArea: 320 },
      { label: "250 YARD BUNGALOW FOR RENT IN PHASE 8", minArea: 220, maxArea: 260 },
      { label: "100 YARD BUNGALOW FOR RENT IN PHASE 8", minArea: 90, maxArea: 150 },
    ],
  },
  {
    phaseName: "PHASE 6",
    queryPhase: "PHASE 6",
    col1: [
      { label: "2000 YARD BUNGALOW FOR RENT IN PHASE 6", minArea: 1800, maxArea: 2200 },
      { label: "1000 YARD BUNGALOW FOR RENT IN PHASE 6", minArea: 900, maxArea: 1100 },
      { label: "500 YARD BUNGALOW FOR RENT IN PHASE 6", minArea: 450, maxArea: 550 },
    ],
    col2: [
      { label: "300 YARD BUNGALOW FOR RENT IN PHASE 6", minArea: 280, maxArea: 320 },
      { label: "250 YARD BUNGALOW FOR RENT IN PHASE 6", minArea: 220, maxArea: 260 },
      { label: "100 YARD BUNGALOW FOR RENT IN PHASE 6", minArea: 90, maxArea: 150 },
    ],
  },
  {
    phaseName: "PHASE 7",
    queryPhase: "PHASE 7",
    col1: [
      { label: "2000 YARD BUNGALOW FOR RENT IN PHASE 7", minArea: 1800, maxArea: 2200 },
      { label: "1000 YARD BUNGALOW FOR RENT IN PHASE 7", minArea: 900, maxArea: 1100 },
      { label: "500 YARD BUNGALOW FOR RENT IN PHASE 7", minArea: 450, maxArea: 550 },
    ],
    col2: [
      { label: "300 YARD BUNGALOW FOR RENT IN PHASE 7", minArea: 280, maxArea: 320 },
      { label: "250 YARD BUNGALOW FOR RENT IN PHASE 7", minArea: 220, maxArea: 260 },
      { label: "100 YARD BUNGALOW FOR RENT IN PHASE 7", minArea: 90, maxArea: 150 },
    ],
  },
  {
    phaseName: "PHASE 5",
    queryPhase: "PHASE 5",
    col1: [
      { label: "2000 YARD BUNGALOW FOR RENT IN PHASE 5", minArea: 1800, maxArea: 2200 },
      { label: "1000 YARD BUNGALOW FOR RENT IN PHASE 5", minArea: 900, maxArea: 1100 },
      { label: "500 YARD BUNGALOW FOR RENT IN PHASE 5", minArea: 450, maxArea: 550 },
    ],
    col2: [
      { label: "300 YARD BUNGALOW FOR RENT IN PHASE 5", minArea: 280, maxArea: 320 },
      { label: "250 YARD BUNGALOW FOR RENT IN PHASE 5", minArea: 220, maxArea: 260 },
      { label: "100 YARD BUNGALOW FOR RENT IN PHASE 5", minArea: 90, maxArea: 150 },
    ],
  },
];

export default function PopularBungalowsLinks() {
  return (
    <section className="pt-6 sm:pt-8 border-t border-stone-200/80 mt-8">
      {/* 1. Main Heading h2 */}
      <div className="space-y-1 mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#657A68]" />
          MOST POPULAR LOCATION BUNGALOWS FOR RENT
        </h2>
        {/* 2. Sub Heading h3 */}
        <h3 className="text-xs sm:text-sm font-black uppercase text-[#657A68] tracking-wider pl-4">
          DHA KARACHI
        </h3>
      </div>

      {/* 3. Phases Grid (Phase 8, Phase 6, Phase 7, Phase 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {PHASES_DATA.map((item) => (
          <div
            key={item.phaseName}
            className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs hover:border-[#657A68]/40 transition-colors"
          >
            {/* Phase Sub-Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-black uppercase text-[#1A1F1C] flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#657A68]" />
                <span>{item.phaseName} BUNGALOWS</span>
              </span>
              <Link
                href={`/properties?phase=${encodeURIComponent(item.queryPhase)}&type=HOUSE`}
                className="text-[10px] font-black uppercase text-[#657A68] hover:underline"
              >
                VIEW ALL
              </Link>
            </div>

            {/* 2 Columns: Col 1 (2000, 1000, 500) | Col 2 (300, 250, 100) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {/* Column 1 */}
              <div className="space-y-2">
                {item.col1.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?phase=${encodeURIComponent(
                      item.queryPhase
                    )}&type=HOUSE&minArea=${link.minArea}&maxArea=${link.maxArea}`}
                    className="group flex items-start gap-1.5 text-[11px] font-bold uppercase text-stone-600 hover:text-[#1A1F1C] transition-colors leading-relaxed"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#657A68] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                {item.col2.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/properties?phase=${encodeURIComponent(
                      item.queryPhase
                    )}&type=HOUSE&minArea=${link.minArea}&maxArea=${link.maxArea}`}
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