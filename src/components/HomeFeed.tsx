"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DiscoveryTabs from "./DiscoveryTabs";
import {
  MapPin,
  Search,
  Home,
  Maximize2,
  Coins,
  ChevronDown,
  Building2,
  Sparkles,
  SlidersHorizontal,
  X,
  Menu,
  ArrowRight,
} from "lucide-react";

const heroImages = [
  "/hr-img-1.jpg",
  "/hr-img-2.jpg",
  "/hr-img-3.jpg",
  "/hr-img-4.jpg",
];

const phases = [
  "ALL PHASES",
  "PHASE 1",
  "PHASE 2",
  "PHASE 2 EXT",
  "PHASE 4",
  "PHASE 5",
  "PHASE 5 EXT",
  "PHASE 6",
  "PHASE 7",
  "PHASE 7 EXT",
  "PHASE 8",
];

const residentialTypes = [
  "HOMES",
  "APARTMENTS",
  "DUPLEX",
  "PENTHOUSE",
  "ROOMS",
  "CONDOS",
  "VILLAS",
  "FARMHOUSES",
];

const commercialTypes = [
  "SHOPS",
  "WAREHOUSES",
  "OFFICES",
  "BUILDINGS",
  "FACTORY",
  "OTHERS",
];

const areaUnits = [
  "SQ. YARD",
  "SQ. FEET",
  "SQ. METERS",
  "MARLA",
  "KANAL",
];

export default function HomeFeed() {
  const router = useRouter();

  // 1. Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // 2. Scroll Animation State
  const [scrollDir, setScrollDir] = useState<"initial" | "down" | "up">("initial");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 20) {
        setScrollDir("initial");
      } else if (currentY > lastScrollY.current && currentY > 50) {
        setScrollDir("down");
      } else if (currentY < lastScrollY.current) {
        setScrollDir("up");
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Filter States
  const [selectedPhase, setSelectedPhase] = useState("ALL PHASES");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"RESIDENTIAL" | "COMMERCIAL">("RESIDENTIAL");
  const [selectedType, setSelectedType] = useState("HOMES");
  const [selectedAreaUnit, setSelectedAreaUnit] = useState("SQ. YARD");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 4. Mobile Modal & Sidebar States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 5. Desktop Dropdowns Visibility
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock Body Scroll when Modal is Open
  useEffect(() => {
    if (isMobileFilterOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileFilterOpen, isMobileMenuOpen]);

  // Search Submit Handler
  const handleSearchSubmit = () => {
    setOpenDropdown(null);
    setIsMobileFilterOpen(false);
    const params = new URLSearchParams();
    if (selectedPhase !== "ALL PHASES") params.set("phase", selectedPhase);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedType !== "HOMES" && selectedType !== "ALL TYPES") params.set("type", selectedType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);

    router.push(`/properties?${params.toString()}`);
  };

  const getTextAnimationClass = () => {
    if (scrollDir === "initial") {
      return "translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out";
    }
    if (scrollDir === "down") {
      return "translate-y-8 opacity-0 transition-all duration-500 ease-in";
    }
    if (scrollDir === "up") {
      return "translate-y-0 opacity-100 transition-all duration-700 ease-out animate-in fade-in slide-in-from-top-6";
    }
    return "translate-y-0 opacity-100";
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl min-h-[440px] sm:min-h-[440px] flex flex-col justify-between p-4 sm:p-8 lg:p-10 pb-6 sm:pb-10 border border-stone-200/90 shadow-xl bg-stone-900 overflow-visible">
        
        {/* Background Images Slider */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt="GO RENTAL DHA Property"
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        </div>

        {/* MOBILE TOP-LEFT: HAMBURGER & LOGO OVER HERO IMAGE */}
        <div className="relative z-20 flex md:hidden items-center justify-between w-full pt-1 pb-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tighter text-white uppercase drop-shadow-md">
                GO RENTAL <span className="text-[#657A68]">DHA</span>
              </span>
            </Link>
          </div>
        </div>

        {/* 2. CENTERED ANIMATED HERO HEADING */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center pt-2 sm:pt-4 my-auto">
          <div className={`max-w-3xl space-y-2 flex flex-col items-center ${getTextAnimationClass()}`}>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-xs">
             
              <span>DHA KARACHI VERIFIED LISTINGS</span>
            </div>

            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-[30px] font-black uppercase tracking-tight text-white leading-snug drop-shadow-lg whitespace-normal sm:whitespace-nowrap text-center">
              FIND PROPERTY FOR RENT IN DHA KARACHI
            </h1>

            <p className="text-[11px] sm:text-xs text-stone-200 uppercase font-bold tracking-wider drop-shadow-sm text-center">
              EXPLORE EXCLUSIVE RESIDENTIAL & COMMERCIAL RENTALS ACROSS ALL PHASES
            </p>
          </div>
        </div>

        {/* 3A. MOBILE-ONLY SEARCH BAR (PIXEL PERFECT & PROPERLY CONTAINED) */}
        <div className="relative z-20 block md:hidden w-full mt-4">
          <div className="bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl border border-stone-200/90 shadow-2xl flex items-center gap-1.5 overflow-hidden">
            
            <div 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-xl cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-[#657A68] shrink-0" />
              <span className="text-xs font-bold text-stone-400 uppercase truncate">
                {searchQuery || (selectedPhase !== "ALL PHASES" ? selectedPhase : "SEARCH LOCATION / PHASE...")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              style={{ backgroundColor: "#657A68", color: "#ffffff" }}
              className="h-[42px] px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              aria-label="Open Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase tracking-wider">FILTER</span>
            </button>
          </div>
        </div>

        {/* 3B. DESKTOP-ONLY 2-ROW ADVANCED FILTER BAR */}
        <div
          ref={filterRef}
          className="relative z-30 hidden md:block w-full max-w-4xl mx-auto mb-3 sm:mb-5 bg-white/95 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl border border-stone-200 shadow-2xl space-y-2 text-stone-800"
        >
          {/* DESKTOP ROW 1 */}
          <div className="relative z-30 grid grid-cols-1 md:grid-cols-12 gap-2">
            
            {/* Phase Dropdown */}
            <div className="relative md:col-span-3">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "phase" ? null : "phase")}
                className="w-full h-10 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-black uppercase transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#657A68] shrink-0" />
                  <span className="truncate">{selectedPhase === "ALL PHASES" ? "DHA KARACHI" : selectedPhase}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {openDropdown === "phase" && (
                <div className="absolute left-0 top-full mt-1.5 w-full sm:w-56 bg-white rounded-2xl border border-stone-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {phases.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setSelectedPhase(p);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-colors cursor-pointer ${
                          selectedPhase === p
                            ? "bg-[#657A68]/15 text-[#657A68]"
                            : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Search Input */}
            <div className="relative md:col-span-5">
              <div className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl flex items-center gap-2 shadow-2xs focus-within:border-[#657A68] transition-all">
                <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="SEARCH BY LOCATION"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  className="w-full bg-transparent text-xs font-bold text-stone-900 placeholder:text-stone-400 outline-none uppercase"
                />
              </div>
            </div>

            {/* Property Type Dropdown */}
            <div className="relative md:col-span-4">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
                className="w-full h-10 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-black uppercase transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Home className="w-3.5 h-3.5 text-[#657A68] shrink-0" />
                  <span className="truncate">{selectedType}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {openDropdown === "type" && (
                <div className="absolute right-0 top-full mt-1.5 w-full sm:w-72 bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-[10px] font-black uppercase">
                    <button
                      type="button"
                      onClick={() => setActiveCategory("RESIDENTIAL")}
                      className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        activeCategory === "RESIDENTIAL"
                          ? "bg-white text-[#1A1F1C] shadow-xs"
                          : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <Home className="w-3 h-3 text-[#657A68]" />
                      <span>RESIDENTIAL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategory("COMMERCIAL")}
                      className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        activeCategory === "COMMERCIAL"
                          ? "bg-white text-[#1A1F1C] shadow-xs"
                          : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <Building2 className="w-3 h-3 text-[#657A68]" />
                      <span>COMMERCIAL</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto">
                    {(activeCategory === "RESIDENTIAL"
                      ? residentialTypes
                      : commercialTypes
                    ).map((tItem) => (
                      <button
                        key={tItem}
                        type="button"
                        onClick={() => {
                          setSelectedType(tItem);
                          setOpenDropdown(null);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase truncate transition-colors cursor-pointer ${
                          selectedType === tItem
                            ? "bg-[#657A68]/15 text-[#657A68]"
                            : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {tItem}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP ROW 2 */}
          <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2">
            
            {/* Area Dropdown */}
            <div className="relative md:col-span-5">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "area" ? null : "area")}
                className="w-full h-10 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-black uppercase transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Maximize2 className="w-3.5 h-3.5 text-[#657A68] shrink-0" />
                  <span className="truncate">Area ({selectedAreaUnit})</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {openDropdown === "area" && (
                <div className="absolute left-0 top-full mt-1.5 w-full sm:w-68 bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-stone-400 mb-1 block">
                      CHANGE AREA UNIT
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {areaUnits.map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setSelectedAreaUnit(u)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                            selectedAreaUnit === u
                              ? "bg-[#1A1F1C] text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <label className="text-[10px] font-black uppercase text-stone-400 mb-1 block">
                      CUSTOM RANGE ({selectedAreaUnit})
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="number"
                        placeholder="MIN"
                        value={minArea}
                        onChange={(e) => setMinArea(e.target.value)}
                        className="w-full px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold uppercase outline-none"
                      />
                      <input
                        type="number"
                        placeholder="MAX"
                        value={maxArea}
                        onChange={(e) => setMaxArea(e.target.value)}
                        className="w-full px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold uppercase outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative md:col-span-5">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
                className="w-full h-10 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-black uppercase transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">
                    {minPrice || maxPrice ? `PKR ${minPrice || "0"} - ${maxPrice || "Any"}` : "Price (PKR)"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {openDropdown === "price" && (
                <div className="absolute right-0 top-full mt-1.5 w-full sm:w-68 bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <label className="text-[10px] font-black uppercase text-stone-400 block">
                    MONTHLY RENT BUDGET (PKR)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="MIN RENT"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold uppercase outline-none"
                    />
                    <input
                      type="number"
                      placeholder="MAX RENT"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold uppercase outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleSearchSubmit}
                style={{ backgroundColor: "#657A68", color: "#ffffff" }}
                className="w-full h-10 hover:opacity-95 active:scale-[0.98] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center shadow-md transition-all cursor-pointer"
              >
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DISCOVERY TABS (HOMES & COMMERCIAL) */}
      <DiscoveryTabs />

      {/* 5. FULL-SCREEN MOBILE FILTER SLIDE-OVER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end md:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#657A68]" />
                <h3 className="text-sm font-black uppercase text-[#1A1F1C]">
                  FILTER PROPERTIES
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-stone-800">
              
              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-stone-500">
                  Search Location / Keyword
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="E.G. STREET 10, PHASE 6, CORNER..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold uppercase outline-none"
                  />
                </div>
              </div>

              {/* DHA Karachi Phases */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-stone-500">
                  Select DHA Phase
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200">
                  {phases.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPhase(p)}
                      className={`p-2 rounded-lg text-[11px] font-black uppercase text-left transition-all ${
                        selectedPhase === p
                          ? "bg-[#657A68] text-white"
                          : "text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Types */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-stone-500">
                  Property Type
                </label>
                <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-[11px] font-black uppercase">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("RESIDENTIAL")}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      activeCategory === "RESIDENTIAL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-[#657A68]" />
                    <span>RESIDENTIAL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory("COMMERCIAL")}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      activeCategory === "COMMERCIAL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#657A68]" />
                    <span>COMMERCIAL</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200">
                  {(activeCategory === "RESIDENTIAL" ? residentialTypes : commercialTypes).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedType(t)}
                      className={`p-2 rounded-lg text-[11px] font-black uppercase text-left truncate ${
                        selectedType === t ? "bg-[#657A68] text-white" : "text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase text-stone-500">
                    Area Range ({selectedAreaUnit})
                  </label>
                  <select
                    value={selectedAreaUnit}
                    onChange={(e) => setSelectedAreaUnit(e.target.value)}
                    className="text-[10px] font-black bg-stone-100 px-2 py-1 rounded-md border border-stone-200 uppercase outline-none"
                  >
                    {areaUnits.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="MIN AREA"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none"
                  />
                  <input
                    type="number"
                    placeholder="MAX AREA"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-stone-500">
                  Monthly Rent Budget (PKR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="MIN RENT"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none"
                  />
                  <input
                    type="number"
                    placeholder="MAX RENT"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedPhase("ALL PHASES");
                  setSearchQuery("");
                  setSelectedType("HOMES");
                  setMinPrice("");
                  setMaxPrice("");
                  setMinArea("");
                  setMaxArea("");
                }}
                className="py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                RESET
              </button>
              <button
                type="button"
                onClick={handleSearchSubmit}
                style={{ backgroundColor: "#657A68", color: "#ffffff" }}
                className="py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>APPLY FILTERS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. MOBILE HAMBURGER MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex md:hidden animate-in fade-in duration-200">
          <div className="bg-[#1A1F1C] text-white w-4/5 max-w-xs h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <span className="text-base font-black tracking-wider uppercase text-white">
                  GO RENTAL <span className="text-[#657A68]">DHA</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-3 text-xs font-black uppercase tracking-wider">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-stone-300 hover:text-[#657A68]"
                >
                  HOME
                </Link>
                <Link
                  href="/properties"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-stone-300 hover:text-[#657A68]"
                >
                  BROWSE ALL ADS
                </Link>
                <Link
                  href="/dashboard/post-ad"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-[#657A68] hover:underline"
                >
                  + POST RENTAL AD
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-stone-300 hover:text-[#657A68]"
                >
                  MY DASHBOARD
                </Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[10px] font-bold text-stone-400 uppercase">
              DHA KARACHI VERIFIED DIRECTORY
            </div>
          </div>
        </div>
      )}

    </div>
  );
}