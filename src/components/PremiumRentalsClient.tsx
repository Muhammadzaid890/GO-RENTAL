"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Hash,
  ArrowRight,
  MessageCircle,
  Flame,
  Coins,
  Eye,
  Users,
} from "lucide-react";
import { trackPropertyLead } from "@/actions/property";

export default function PremiumRentalsClient({ properties = [] }: { properties: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!properties || properties.length === 0) {
    return null;
  }

  // Detect which card is currently active on finger scroll/swipe
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const cardWidth = containerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full pt-1 space-y-2 max-w-xl mx-auto">
      {/* 
        NATURAL TOUCH SWIPE TRACK:
        - 1 Card per screen (w-full snap-start)
        - Smooth native momentum physics (snap-x snap-mandatory)
        - No extra headers, counters or arrows
      */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {properties.map((property) => (
          <div
            key={property.id}
            className="w-full shrink-0 snap-center"
          >
            <SinglePremiumCard property={property} />
          </div>
        ))}
      </div>

      {/* Subtle Dot Indicators */}
      {properties.length > 1 && (
        <div className="flex items-center justify-center gap-1 pt-1">
          {properties.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "bg-[#657A68] w-4" : "bg-stone-300 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SinglePremiumCard({ property }: { property: any }) {
  const images: string[] =
    property.images && property.images.length > 0
      ? property.images
      : ["/placeholder.jpg"];

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
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Cover Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-900">
          <Link href={`/property/${property.id}`} className="block relative w-full h-full">
            <Image
              src={images[0]}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-[#E53935] text-white text-[9px] font-black uppercase flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 fill-white" />
              <span>PREMIUM</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase">
              {property.propertyType}
            </span>
          </div>

          {/* Views & Leads Over Image */}
          <div className="absolute top-3 right-3 flex items-center gap-1 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase flex items-center gap-1 border border-white/10">
              <Eye className="w-2.5 h-2.5 text-blue-400" />
              <span>{property.views ?? 0}</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase flex items-center gap-1 border border-white/10">
              <Users className="w-2.5 h-2.5 text-emerald-400" />
              <span>{property.leads ?? 0}</span>
            </span>
          </div>

          {/* Price Bar Overlay */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md text-white font-black text-xs flex items-center gap-1 border border-white/10 shadow-md">
              <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>PKR {Number(property.rentPrice).toLocaleString()}</span>
              <span className="text-[9px] font-normal text-stone-300">/ MO</span>
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <Link href={`/property/${property.id}`}>
            <h3 className="text-sm sm:text-base font-black uppercase text-[#1A1F1C] hover:text-[#657A68] transition-colors line-clamp-1 leading-snug">
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#657A68] shrink-0" />
            <span className="truncate">{property.phase} • DHA KARACHI</span>
          </div>

          {/* Key Specs Row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <div className="px-2.5 py-1 rounded-xl bg-[#FBFBF9] border border-stone-200/80 text-stone-700 text-[10px] font-black uppercase flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-[#657A68]" />
              <span>{property.areaSqYards} {unitLabel}</span>
            </div>

            {property.bedrooms ? (
              <div className="px-2.5 py-1 rounded-xl bg-[#FBFBF9] border border-stone-200/80 text-stone-700 text-[10px] font-black uppercase flex items-center gap-1">
                <Bed className="w-3 h-3 text-[#657A68]" />
                <span>{property.bedrooms} BEDS</span>
              </div>
            ) : null}

            {property.bathrooms ? (
              <div className="px-2.5 py-1 rounded-xl bg-[#FBFBF9] border border-stone-200/80 text-stone-700 text-[10px] font-black uppercase flex items-center gap-1">
                <Bath className="w-3 h-3 text-[#657A68]" />
                <span>{property.bathrooms} BATHS</span>
              </div>
            ) : null}

            <div className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-500 text-[9px] font-mono font-bold uppercase flex items-center gap-1 ml-auto">
              <Hash className="w-2.5 h-2.5 text-stone-400" />
              <span>{property.id?.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLeadClick}
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WHATSAPP</span>
        </a>

        <Link
          href={`/property/${property.id}`}
          className="w-full py-2.5 px-3 rounded-xl bg-[#1A1F1C] hover:bg-stone-800 text-white text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>VIEW DETAILS</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
        </Link>
      </div>
    </div>
  );
}