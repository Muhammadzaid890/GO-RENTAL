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
} from "lucide-react";

export default function PremiumRentalsClient({ properties = [] }: { properties: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!properties || properties.length === 0) {
    return null;
  }

  // Load More button click hone par slider active aur smooth slide
  const activateAndSlideNext = () => {
    setIsSliderActive(true);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 100);
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  return (
    <div className="w-full pt-1 space-y-2.5">
      {/* Slider active hone par arrows */}
      {isSliderActive && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black tracking-wider uppercase text-stone-400">
            SLIDE TO EXPLORE ALL ({properties.length} PROPERTIES)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous"
              className="w-7 h-7 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-[#1A1F1C] hover:text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next"
              className="w-7 h-7 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-[#1A1F1C] hover:text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Row */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 w-full">
        {/* Compact Cards Track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className={`w-full transition-all duration-300 ${
            isSliderActive
              ? "flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-1 cursor-grab active:cursor-grabbing"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden"
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
                    ? "shrink-0 w-[78vw] sm:w-[280px] md:w-[295px] snap-start"
                    : "w-full"
                }
              >
                <PremiumVerticalCard property={property} />
              </div>
            );
          })}
        </div>

        {/* Compact Vertical Load More Button */}
        {!isSliderActive && properties.length > 3 && (
          <div className="w-full lg:w-[44px] shrink-0 flex items-stretch">
            <button
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

  // Touch Swipe for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold 40px
    if (diff > 40) {
      // Next image swipe
      setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      // Prev image swipe
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

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Compact Card Image with Touch Swipe & Click Slider */}
        <div
          className="relative h-36 sm:h-40 w-full overflow-hidden bg-stone-900 group/img select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Link href={`/property/${property.id}`} className="block relative w-full h-full">
            <Image
              src={images[currentImgIndex]}
              alt={`${property.title} - Image ${currentImgIndex + 1}`}
              fill
              sizes="(max-width: 768px) 80vw, 300px"
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

          {/* Slider Left & Right Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous Image"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover/img:opacity-100 z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={nextImage}
                aria-label="Next Image"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover/img:opacity-100 z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Slider Dots Indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1 z-10 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded-full pointer-events-none">
                {images.slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentImgIndex
                        ? "w-2.5 bg-white"
                        : "w-1 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Rent Price */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-white font-black text-[11px] flex items-center gap-1 border border-white/10">
              <Coins className="w-3 h-3 text-[#D4AF37]" />
              <span>PKR {Number(property.rentPrice).toLocaleString()}</span>
              <span className="text-[8px] font-normal text-stone-300">/ MO</span>
            </span>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-3 space-y-1.5">
          <Link href={`/property/${property.id}`}>
            <h3 className="text-xs font-black uppercase text-[#1A1F1C] group-hover:text-[#657A68] transition-colors line-clamp-1 leading-tight">
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 uppercase">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{property.phase} • DHA KARACHI</span>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <div className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 text-[9px] font-black uppercase flex items-center gap-1">
              <Maximize2 className="w-2.5 h-2.5 text-stone-400" />
              <span>{property.areaSqYards} {unitLabel}</span>
            </div>

            {property.bedrooms ? (
              <div className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 text-[9px] font-black uppercase flex items-center gap-1">
                <Bed className="w-2.5 h-2.5 text-stone-400" />
                <span>{property.bedrooms} BEDS</span>
              </div>
            ) : null}

            {property.bathrooms ? (
              <div className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 text-[9px] font-black uppercase flex items-center gap-1">
                <Bath className="w-2.5 h-2.5 text-stone-400" />
                <span>{property.bathrooms} BATHS</span>
              </div>
            ) : null}
          </div>

          {/* ID */}
          <div className="pt-0.5">
            <div className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[8px] font-mono font-bold uppercase flex items-center gap-1 w-max">
              <Hash className="w-2 h-2 text-stone-400" />
              <span>ID: {property.id?.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 mt-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
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
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}