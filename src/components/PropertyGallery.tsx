"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Flame, Sparkles, Maximize2 } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  isBoosted?: boolean;
  isPremium?: boolean;
  phase?: string;
}

export default function PropertyGallery({
  images,
  title,
  isBoosted,
  isPremium,
  phase,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryImages = images && images.length > 0 ? images : ["/placeholder.jpg"];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* 1. Main Hero Image Container */}
      <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm group">
        <Image
          src={galleryImages[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 850px"
          loading="eager"
          priority={currentIndex === 0}
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10 flex-wrap">
          {isPremium && (
            <div className="px-3 py-1.5 rounded-xl bg-[#E53935] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Flame className="w-3.5 h-3.5" />
              <span>PREMIUM</span>
            </div>
          )}

          {isBoosted && (
            <div className="px-3 py-1.5 rounded-xl bg-[#1A1F1C] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              
              <span>BOOST PROPERTY</span>
            </div>
          )}

          {phase && (
            <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[#1A1F1C] text-xs font-black uppercase tracking-wider shadow-sm border border-stone-200/60">
              {phase}
            </div>
          )}
        </div>

        {/* Navigation Arrows (Only if multiple images) */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md text-stone-900 hover:bg-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
              title="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md text-stone-900 hover:bg-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
              title="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-xl text-[11px] font-black uppercase">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </>
        )}
      </div>

      {/* 2. Thumbnails Row (Only if multiple images) */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-2xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                currentIndex === idx
                  ? "border-[#1A1F1C] shadow-md scale-102"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}