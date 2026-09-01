"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Building2, ChevronRight, ChevronLeft } from "lucide-react";

// HOMES DATA (Page 1 & Page 2 matching exact screenshots)
const homesData = {
  popular: {
    page1: [
      { title: "250 sq yard", sub: "Houses", query: "250" },
      { title: "120 sq yard", sub: "Houses", query: "120" },
      { title: "500 sq yard", sub: "Houses", query: "500" },
      { title: "Under 15000", sub: "Homes", maxPrice: "15000" },
      { title: "Independent", sub: "Homes", query: "Independent" },
      { title: "Furnished", sub: "Homes", query: "Furnished" },
    ],
    page2: [
      { title: "2 Bedroom", sub: "Flats", query: "2 Bedroom" },
      { title: "1 Bedroom", sub: "Flats", query: "1 Bedroom" },
      { title: "Studio", sub: "Flats", query: "Studio" },
      { title: "Luxury", sub: "Homes", query: "Luxury" },
    ],
  },
  type: {
    page1: [
      { title: "Houses", sub: "", type: "House / Villa" },
      { title: "Flats", sub: "", type: "Flat / Apartment" },
      { title: "Upper Portion", sub: "", type: "Upper Portion" },
      { title: "Lower Portion", sub: "", type: "Lower Portion" },
      { title: "Farmhouse", sub: "", type: "Farmhouses" },
      { title: "Penthouse", sub: "", type: "Penthouse" },
    ],
    page2: [
      { title: "Room", sub: "", type: "Rooms" },
    ],
  },
  area: {
    page1: [
      { title: "120 sq yard", sub: "Houses", query: "120" },
      { title: "500 sq yard", sub: "Houses", query: "500" },
      { title: "80 sq yard", sub: "Houses", query: "80" },
      { title: "240 sq yard", sub: "Houses", query: "240" },
      { title: "300 sq yard", sub: "Houses", query: "300" },
      { title: "60 sq yard", sub: "Houses", query: "60" },
    ],
    page2: [
      { title: "1000 sq yard", sub: "Houses", query: "1000" },
    ],
  },
};

// COMMERCIAL DATA
const commercialData = {
  popular: {
    page1: [
      { title: "Furnished", sub: "Offices", query: "Furnished" },
      { title: "New", sub: "Offices", query: "New" },
      { title: "Small", sub: "Offices", query: "Small" },
      { title: "Running", sub: "Shops", query: "Shop" },
      { title: "Commercial Space", sub: "Commercial", type: "Commercial / Office" },
      { title: "Small", sub: "Shops", query: "Shop" },
    ],
    page2: [],
  },
  type: {
    page1: [
      { title: "Office", sub: "", type: "Commercial / Office" },
      { title: "Shop", sub: "", type: "Shops" },
      { title: "Building", sub: "", type: "Buildings" },
      { title: "Warehouse", sub: "", type: "Warehouses" },
      { title: "Factory", sub: "", type: "Factory" },
      { title: "Others", sub: "", type: "Others" },
    ],
    page2: [],
  },
  area: {
    page1: [
      { title: "Less than 100 sq ft", sub: "Commercial", maxArea: "100" },
      { title: "100-200 sq ft", sub: "Commercial", minArea: "100", maxArea: "200" },
      { title: "200-300 sq ft", sub: "Commercial", minArea: "200", maxArea: "300" },
      { title: "300-400 sq ft", sub: "Commercial", minArea: "300", maxArea: "400" },
      { title: "More than 500 sq ft", sub: "Commercial", minArea: "500" },
    ],
    page2: [],
  },
};

export default function DiscoveryTabs() {
  const router = useRouter();

  // Tab selections
  const [homesTab, setHomesTab] = useState<"popular" | "type" | "area">("popular");
  const [commTab, setCommTab] = useState<"popular" | "type" | "area">("popular");

  // Homes pagination page (1 or 2)
  const [homesPage, setHomesPage] = useState<1 | 2>(1);

  // Tab switch handler (Resets page to 1)
  const handleHomesTabChange = (tab: "popular" | "type" | "area") => {
    setHomesTab(tab);
    setHomesPage(1);
  };

  const handleTileClick = (item: any) => {
    const params = new URLSearchParams();
    if (item.type) params.set("type", item.type);
    if (item.query) params.set("search", item.query);
    if (item.maxPrice) params.set("maxPrice", item.maxPrice);
    if (item.minArea) params.set("minArea", item.minArea);
    if (item.maxArea) params.set("maxArea", item.maxArea);

    router.push(`/properties?${params.toString()}`);
  };

  const currentHomesItems = homesPage === 1 ? homesData[homesTab].page1 : homesData[homesTab].page2;
  const hasSecondPage = homesData[homesTab].page2.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      
      {/* 1. HOMES CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center">
              <Home className="w-5 h-5 fill-[#657A68]/20" />
            </div>
            <h3 className="text-lg font-black uppercase text-[#1A1F1C] tracking-tight">
              HOMES
            </h3>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-6 border-b border-stone-200/80 text-xs font-bold uppercase">
            {(["popular", "type", "area"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleHomesTabChange(tab)}
                className={`pb-3 relative transition-all cursor-pointer font-black tracking-wider ${
                  homesTab === tab
                    ? "text-[#657A68]"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {tab === "area" ? "Area Size" : tab === "popular" ? "Popular" : "Type"}
                {homesTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#657A68] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tiles Grid with Left/Right Paginated Arrows */}
          <div className="relative min-h-[175px]">
            {/* Left Arrow (Visible only on Page 2) */}
            {homesPage === 2 && (
              <button
                type="button"
                onClick={() => setHomesPage(1)}
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md flex items-center justify-center text-[#657A68] hover:bg-stone-50 z-20 cursor-pointer transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {currentHomesItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTileClick(item)}
                  className="p-3 bg-white hover:bg-stone-50 border border-stone-200/90 hover:border-[#657A68] rounded-2xl flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer h-20 group"
                >
                  <span className="text-xs font-black text-[#1A1F1C] group-hover:text-[#657A68] truncate w-full">
                    {item.title}
                  </span>
                  {item.sub && (
                    <span className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">
                      {item.sub}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Arrow (Visible only if Page 1 has Next Page) */}
            {hasSecondPage && homesPage === 1 && (
              <button
                type="button"
                onClick={() => setHomesPage(2)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md flex items-center justify-center text-[#657A68] hover:bg-stone-50 z-20 cursor-pointer transition-all"
                title="Next Page"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

        {/* Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={() => setHomesPage(1)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              homesPage === 1 ? "bg-[#657A68] w-4" : "bg-stone-300"
            }`}
          />
          {hasSecondPage && (
            <button
              type="button"
              onClick={() => setHomesPage(2)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                homesPage === 2 ? "bg-[#657A68] w-4" : "bg-stone-300"
              }`}
            />
          )}
        </div>
      </div>

      {/* 2. COMMERCIAL CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center">
              <Building2 className="w-5 h-5 fill-[#657A68]/20" />
            </div>
            <h3 className="text-lg font-black uppercase text-[#1A1F1C] tracking-tight">
              COMMERCIAL
            </h3>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-6 border-b border-stone-200/80 text-xs font-bold uppercase">
            {(["popular", "type", "area"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCommTab(tab)}
                className={`pb-3 relative transition-all cursor-pointer font-black tracking-wider ${
                  commTab === tab
                    ? "text-[#657A68]"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {tab === "area" ? "Area Size" : tab === "popular" ? "Popular" : "Type"}
                {commTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#657A68] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* 6 Tiles Grid */}
          <div className="relative min-h-[175px]">
            <div className="grid grid-cols-3 gap-2.5">
              {commercialData[commTab].page1.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTileClick(item)}
                  className="p-3 bg-white hover:bg-stone-50 border border-stone-200/90 hover:border-[#657A68] rounded-2xl flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer h-20 group"
                >
                  <span className="text-xs font-black text-[#1A1F1C] group-hover:text-[#657A68] truncate w-full">
                    {item.title}
                  </span>
                  {item.sub && (
                    <span className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">
                      {item.sub}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Commercial Dot */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <span className="w-4 h-2 rounded-full bg-[#657A68]" />
        </div>
      </div>

    </div>
  );
}