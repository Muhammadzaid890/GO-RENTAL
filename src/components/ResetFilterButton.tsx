"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, RotateCcw, X, AlertCircle } from "lucide-react";

export default function ResetFilterButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmReset = () => {
    setIsOpen(false);
    router.push("/properties");
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer self-start sm:self-auto shadow-2xs"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#657A68]" />
        <span>RESET FILTERS</span>
      </button>

      {/* Pop-up Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black uppercase text-[#1A1F1C]">
                RESET ALL ACTIVE FILTERS?
              </h3>
              <p className="text-xs font-bold uppercase text-stone-400 leading-relaxed">
                THIS WILL CLEAR YOUR APPLIED AREA, BUDGET, AND TYPE FILTERS, SHOWING ALL AVAILABLE PROPERTIES IN DHA KARACHI.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
                className="py-3 hover:bg-stone-800 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                YES, RESET ALL
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}