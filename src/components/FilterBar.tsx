"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Search, RotateCcw } from "lucide-react";

const phases = [
  "ALL",
  "PHASE 1",
  "PHASE 2",
  "PHASE 2 EXT",
  "PHASE 4",
  "PHASE 5",
  "PHASE 6",
  "PHASE 7",
  "PHASE 8",
];

const propertyTypes = [
  "ALL",
  "APARTMENT",
  "HOUSE",
  "UPPER PORTION",
  "LOWER PORTION",
  "COMMERCIAL",
];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPhase = searchParams.get("phase") || "ALL";
  const currentType = searchParams.get("type") || "ALL";
  const minRent = searchParams.get("minRent") || "";
  const maxRent = searchParams.get("maxRent") || "";
  const beds = searchParams.get("beds") || "ALL";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "ALL") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      {/* Quick Phase Selector Pills */}
      <div>
        <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase block mb-2">
          SELECT DHA PHASE
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {phases.map((phase) => {
            const isSelected = currentPhase === phase;
            return (
              <button
                key={phase}
                type="button"
                onClick={() => handleFilterChange("phase", phase)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase ${
                  isSelected
                    ? "bg-sage text-white shadow-xs font-black"
                    : "bg-[#FBFBF9] border border-stone-200/80 text-stone-600 hover:border-sage/50"
                }`}
              >
                {phase}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs: Property Type, Rent Range, Bedrooms & Reset */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-stone-100">
        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
            PROPERTY TYPE
          </label>
          <select
            value={currentType}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase focus:outline-none focus:border-sage bg-[#FBFBF9]"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
            MIN RENT (PKR)
          </label>
          <input
            type="number"
            placeholder="Min"
            defaultValue={minRent}
            onBlur={(e) => handleFilterChange("minRent", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold focus:outline-none focus:border-sage bg-[#FBFBF9]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
            MAX RENT (PKR)
          </label>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxRent}
            onBlur={(e) => handleFilterChange("maxRent", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold focus:outline-none focus:border-sage bg-[#FBFBF9]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
            BEDROOMS
          </label>
          <select
            value={beds}
            onChange={(e) => handleFilterChange("beds", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase focus:outline-none focus:border-sage bg-[#FBFBF9]"
          >
            <option value="ALL">ALL BEDS</option>
            <option value="1">1 BED</option>
            <option value="2">2 BEDS</option>
            <option value="3">3 BEDS</option>
            <option value="4">4 BEDS</option>
            <option value="5">5+ BEDS</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
}