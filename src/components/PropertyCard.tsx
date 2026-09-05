"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag,
  MessageCircle,
  ArrowRight,
  Hash,
} from "lucide-react";

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  rentPrice: number;
  phase: string;
  propertyType: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqYards: number;
  images: string[];
  isBoosted?: boolean;
  isPremium?: boolean;
  createdAt?: string | Date;
  user?: {
    name: string;
    phone: string;
  };
}

interface PropertyCardProps {
  property: PropertyItem;
}

// Helper to extract dynamic area unit from description or smart fallback
function getPropertyUnit(description?: string, propertyType?: string): string {
  if (description) {
    const match = description.match(/\[UNIT:\s*([^\]]+)\]/i);
    if (match && match[1]) {
      const u = match[1].trim().toUpperCase();
      if (u.includes("FEET") || u.includes("FT")) return "SQ. FT";
      if (u.includes("MARLA")) return "MARLA";
      if (u.includes("KANAL")) return "KANAL";
      if (u.includes("METER")) return "SQ. M";
      if (u.includes("YARD") || u.includes("YDS")) return "SQ. YDS";
      return u;
    }
  }

  // Smart fallback if ad doesn't contain [UNIT] tag
  const flatTypes = ["FLAT", "APARTMENT", "ROOM", "CONDOS", "PENTHOUSE"];
  if (propertyType && flatTypes.includes(propertyType.toUpperCase())) {
    return "SQ. FT";
  }
  return "SQ. YDS";
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["/placeholder.jpg"];
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const numericPrice = Number(property.rentPrice);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const whatsappNumber = property.user?.phone
    ? property.user.phone.replace(/^0/, "92").replace(/\D/g, "")
    : "";
  const whatsappMsg = encodeURIComponent(
    `Assalam o Alaikum, I am interested in your listing: "${property.title}" in ${property.phase} listed on GO RENTAL DHA.`
  );

  const displayedUnit = getPropertyUnit(property.description, property.propertyType);

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
      
      {/* 1. LEFT: IMAGE SLIDER */}
      <div className="relative w-full md:w-80 lg:w-96 h-64 md:h-auto shrink-0 overflow-hidden bg-stone-100">
        <Image
          src={images[activeImgIndex]}
          alt={`${property.title} - Image ${activeImgIndex + 1}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* FOR RENT TAG */}
        <div className="absolute top-3 right-3 bg-[#1A1F1C]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md z-10">
          <Tag className="w-2.5 h-2.5 text-[#657A68]" />
          <span>FOR RENT</span>
        </div>

        {/* FIRE RED PREMIUM PROPERTY BADGE */}
        {property.isPremium && (
          <div className="absolute top-3 left-3 bg-[#E53935] text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>PREMIUM PROPERTY</span>
          </div>
        )}

        {/* FEATURED / BOOST BADGE */}
        {property.isBoosted && !property.isPremium && (
          <div className="absolute top-3 left-3 bg-[#657A68] text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 z-10">
            <span>BOOST PROPERTY</span>
          </div>
        )}

        {/* DHA Phase / Tower Tag */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase z-10">
          {property.phase}
        </div>

        {/* Slider Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
              title="Previous Photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
              title="Next Photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2.5 right-3 flex items-center gap-1 z-10">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeImgIndex === i ? "bg-white w-3" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. RIGHT: DETAILS & SPECS */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center bg-white min-w-0">
        
        {/* Price & Type */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#1A1F1C] tracking-tight">
              PKR {numericPrice.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-stone-400 uppercase">/ Month</span>
          </div>

          <span className="px-3.5 py-1 bg-[#FBFBF9] border border-stone-200 rounded-xl text-[10px] font-black uppercase text-[#657A68]">
            {property.propertyType}
          </span>
        </div>

        {/* Title */}
        <Link href={`/property/${property.id}`} className="block group-hover:text-[#657A68] transition-colors mb-1">
          <h3 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] leading-snug line-clamp-1">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-stone-400 mb-3">
          <MapPin className="w-4 h-4 text-[#657A68] shrink-0" />
          <span>{property.phase} • DHA KARACHI</span>
        </div>

        {/* DYNAMIC AREA BADGE (SQ. FT / MARLA / KANAL / SQ. YDS) */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FBFBF9] px-3 py-1.5 rounded-xl border border-stone-200/80 text-xs font-bold uppercase text-stone-700">
            <Maximize2 className="w-3.5 h-3.5 text-[#657A68]" />
            <span>
              {property.areaSqYards} {displayedUnit}
            </span>
          </div>
        </div>

        {/* Beds & Baths */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-700 mb-0.5">
          <div className="flex items-center gap-1.5 bg-[#FBFBF9] px-3 py-1.5 rounded-xl border border-stone-200/80">
            <Bed className="w-3.5 h-3.5 text-[#657A68]" />
            <span>{property.bedrooms ? `${property.bedrooms} BEDS` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FBFBF9] px-3 py-1.5 rounded-xl border border-stone-200/80">
            <Bath className="w-3.5 h-3.5 text-[#657A68]" />
            <span>{property.bathrooms ? `${property.bathrooms} BATHS` : "N/A"}</span>
          </div>
        </div>

        {/* Bottom Strip: Property ID & Actions */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Property ID */}
          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl text-stone-600 font-mono text-[11px] font-bold border border-stone-200/60 self-start sm:self-auto">
            <Hash className="w-3.5 h-3.5 text-stone-400" />
            <span>ID: {property.id.slice(-8).toUpperCase()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WHATSAPP</span>
              </a>
            )}

            <Link
              href={`/property/${property.id}`}
              className="px-5 py-2 bg-[#1A1F1C] hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>VIEW DETAILS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}