"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Hash,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Flame,
  Coins,
  Eye,
  Users,
} from "lucide-react";
import { trackPropertyLead } from "@/actions/property";

export default function PremiumRentalsClient({ properties = [] }: { properties: any[] }) {
  // Desktop Slider State
  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mobile Swipe State
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  if (!properties || properties.length === 0) {
    return null;
  }

  // Desktop Controls
  const activateAndSlideNext = () => {
    setIsSliderActive(true);
    setTimeout(() => {
      if (desktopSliderRef.current) {
        desktopSliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 100);
  };

  const scrollDesktop = (direction: "left" | "right") => {
    if (desktopSliderRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      desktopSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleDesktopScroll = () => {
    if (desktopSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = desktopSliderRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // Mobile Scroll Listener for Dots
  const handleMobileScroll = () => {
    if (mobileContainerRef.current) {
      const scrollLeft = mobileContainerRef.current.scrollLeft;
      const cardWidth = mobileContainerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setMobileActiveIndex(index);
    }
  };

  return (
    <div className="w-full pt-1">
      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW (md:hidden): Single Card Pure Finger-Swipe (No Header/Arrows) */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-2">
        <div
          ref={mobileContainerRef}
          onScroll={handleMobileScroll}
          className="w-full flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((property) => (
            <div key={property.id} className="w-full shrink-0 snap-center">
              <PremiumVerticalCard property={property} />
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        {properties.length > 1 && (
          <div className="flex items-center justify-center gap-1 pt-1">
            {properties.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  mobileActiveIndex === idx ? "bg-[#657A68] w-4" : "bg-stone-300 w-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (hidden md:block): Original 3 Cards Grid + Load More + Slide */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-2.5">
        {/* Slider Active Top Navigation Header */}
        {isSliderActive && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-stone-400">
              SLIDE TO EXPLORE ALL ({properties.length} PROPERTIES)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollDesktop("left")}
                disabled={!canScrollLeft}
                aria-label="Previous"
                className="w-7 h-7 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-[#1A1F1C] hover:text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollDesktop("right")}
                disabled={!canScrollRight}
                aria-label="Next"
                className="w-7 h-7 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-[#1A1F1C] hover:text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Main Row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3 w-full">
          {/* Cards Track */}
          <div
            ref={desktopSliderRef}
            onScroll={handleDesktopScroll}
            className={`w-full transition-all duration-300 ${
              isSliderActive
                ? "flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-1 cursor-grab active:cursor-grabbing"
                : "grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {properties.map((property, idx) => {
              if (!isSliderActive && idx >= 3) return null;

              return (
                <div
                  key={property.id}
                  className={
                    isSliderActive
                      ? "shrink-0 w-[280px] lg:w-[295px] snap-start"
                      : "w-full"
                  }
                >
                  <PremiumVerticalCard property={property} />
                </div>
              );
            })}
          </div>

          {/* Vertical Load More Button */}
          {!isSliderActive && properties.length > 3 && (
            <div className="w-full lg:w-[44px] shrink-0 flex items-stretch">
              <button
                type="button"
                onClick={activateAndSlideNext}
                title="LOAD MORE & SLIDE"
                className="group w-full h-full min-h-[40px] lg:min-h-full py-2.5 px-1 bg-stone-50 hover:bg-[#1A1F1C] border border-stone-200 hover:border-[#1A1F1C] rounded-2xl flex flex-row lg:flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white group-hover:bg-white/10 flex items-center justify-center border border-stone-200 group-hover:border-transparent transition-colors">
                  <ArrowRight className="w-3 h-3 text-[#1A1F1C] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
                </div>

                <span className="text-[9px] font-black tracking-widest text-[#1A1F1C] group-hover:text-white uppercase [writing-mode:horizontal-tb] lg:[writing-mode:vertical-rl] lg:rotate-180">
                  LOAD MORE
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PremiumVerticalCard({ property }: { property: any }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const images: string[] =
    property.images && property.images.length > 0
      ? property.images
      : ["/placeholder.jpg"];

  // Touch Swipe for Card Inner Images
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 40) {
      setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isFlatOrApartment = ["APARTMENT", "FLAT", "PENTHOUSE", "CONDOS"].some((t) =>
    (property.propertyType || "").toUpperCase().includes(t)
  );
  const unitLabel = isFlatOrApartment ? "SQ. FT" : "SQ. YDS";

  const rawPhone =
    property.whatsappNumber || property.contactNumber || property.user?.phone || "923162802558";
  const cleanPhone = String(rawPhone).replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0")
    ? `92${cleanPhone.slice(1)}`
    : cleanPhone.startsWith("92")
    ? cleanPhone
    : `92${cleanPhone}`;

  const whatsappText = encodeURIComponent(
    `ASSALAM O ALAIKUM, I AM INTERESTED IN THIS PROPERTY ON GO RENTAL DHA:\n\n*${property.title}*\nLOCATION: ${property.phase}\nRENT: PKR ${Number(property.rentPrice).toLocaleString()} / MONTH\nID: #${property.id?.slice(-8).toUpperCase()}\n\nLINK: https://www.gorentaldha.com/property/${property.id}`
  );
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappText}`;

  const handleLeadClick = () => {
    if (property.id) {
      trackPropertyLead(property.id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Card Image Area */}
        <div
          className="relative h-44 sm:h-40 w-full overflow-hidden bg-stone-900 group/img select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Link href={`/property/${property.id}`} className="block relative w-full h-full">
            <Image
              src={images[currentImgIndex]}
              alt={`${property.title} - Image ${currentImgIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-[#E53935] text-white text-[8px] font-black uppercase flex items-center gap-1 shadow-md">
              <Flame className="w-2.5 h-2.5 fill-white" />
              <span>PREMIUM</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase">
              {property.propertyType}
            </span>
          </div>

          {/* Views & Leads Over Image */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase flex items-center gap-1 border border-white/10">
              <Eye className="w-2.5 h-2.5 text-blue-400" />
              <span>{property.views ?? 0}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase flex items-center gap-1 border border-white/10">
              <Users className="w-2.5 h-2.5 text-emerald-400" />
              <span>{property.leads ?? 0}</span>
            </span>
          </div>

          {/* Image Slider Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous Image"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover/img:opacity-100 z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next Image"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover/img:opacity-100 z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded-full pointer-events-none">
                {images.slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentImgIndex ? "w-2.5 bg-white" : "w-1 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Rent Price */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-white font-black text-[11px] flex items-center gap-1 border border-white/10 shadow-xs">
              <Coins className="w-3 h-3 text-[#D4AF37]" />
              <span>PKR {Number(property.rentPrice).toLocaleString()}</span>
              <span className="text-[8px] font-normal text-stone-300">/ MO</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3 space-y-1.5">
          <Link href={`/property/${property.id}`}>
            <h3 className="text-xs font-black uppercase text-[#1A1F1C] group-hover:text-[#657A68] transition-colors line-clamp-1 leading-tight">
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 uppercase">
            <MapPin className="w-3 h-3 text-[#657A68] shrink-0" />
            <span className="truncate">{property.phase} • DHA KARACHI</span>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <div className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 text-[9px] font-black uppercase flex items-center gap-1">
              <Maximize2 className="w-2.5 h-2.5 text-[#657A68]" />
              <span>{property.areaSqYards} {unitLabel}</span>
            </div>

            {property.bedrooms ? (
              <div className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 text-[9px] font-black uppercase flex items-center gap-1">
                <Bed className="w-2.5 h-2.5 text-[#657A68]" />
                <span>{property.bedrooms} BEDS</span>
              </div>
            ) : null}

            {property.bathrooms ? (
              <div className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 text-[9px] font-black uppercase flex items-center gap-1">
                <Bath className="w-2.5 h-2.5 text-[#657A68]" />
                <span>{property.bathrooms} BATHS</span>
              </div>
            ) : null}

            <div className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[8px] font-mono font-bold uppercase flex items-center gap-1 ml-auto">
              <Hash className="w-2 h-2 text-stone-400" />
              <span>{property.id?.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 mt-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLeadClick}
          className="w-full py-1.5 px-2 rounded-lg bg-[#E8F8F0] hover:bg-[#D2F2E2] text-[#0F8A4B] text-center text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 border border-[#0F8A4B]/20"
        >
          <MessageCircle className="w-3 h-3 fill-current" />
          <span>WHATSAPP</span>
        </a>

        <Link
          href={`/property/${property.id}`}
          className="w-full py-1.5 px-2 rounded-lg bg-[#1A1F1C] hover:bg-[#2A302C] text-white text-center text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
        >
          <span>DETAILS</span>
          <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
        </Link>
      </div>
    </div>
  );
}