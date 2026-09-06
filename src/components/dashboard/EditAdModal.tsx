"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateRentalAd } from "@/actions/property";
import { X, Loader2, Edit3, Coins, FileText, CheckCircle2 } from "lucide-react";

interface EditAdModalProps {
  property: {
    id: string;
    title: string;
    description: string;
    rentPrice: number;
    amenities?: string | string[] | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditAdModal({
  property,
  isOpen,
  onClose,
  onSuccess,
}: EditAdModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(property.title || "");
  const [description, setDescription] = useState(property.description || "");
  const [rentPrice, setRentPrice] = useState(property.rentPrice || "");
  const [amenities, setAmenities] = useState(
    Array.isArray(property.amenities)
      ? property.amenities.join(", ")
      : property.amenities || ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal open hote hi ya dusre ad par click karte hi state sync karein
  useEffect(() => {
    if (isOpen) {
      setTitle(property.title || "");
      setDescription(property.description || "");
      setRentPrice(property.rentPrice || "");
      setAmenities(
        Array.isArray(property.amenities)
          ? property.amenities.join(", ")
          : property.amenities || ""
      );
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, property]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await updateRentalAd(property.id, {
      title,
      description,
      rentPrice: Number(rentPrice),
      amenities,
    });

    setIsLoading(false);

    if (res.success) {
      setSuccessMsg("AD UPDATED SUCCESSFULLY!");
      router.refresh();
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error || "FAILED TO UPDATE AD.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[#1A1F1C] tracking-wide">
                EDIT PROPERTY AD
              </h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase">
                ID: #{property.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. TITLE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-stone-600 tracking-wider">
              PROPERTY TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value.toUpperCase())}
              placeholder="E.G. LUXURIOUS 3-BED APARTMENT"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#657A68] focus:bg-white text-xs font-bold uppercase text-[#1A1F1C] outline-hidden transition-all"
            />
          </div>

          {/* 2. RENT PRICE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>MONTHLY RENT (PKR) *</span>
            </label>
            <input
              type="number"
              required
              min="1000"
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
              placeholder="E.G. 250000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#657A68] focus:bg-white text-xs font-bold text-[#1A1F1C] outline-hidden transition-all"
            />
          </div>

          {/* 3. AMENITIES / FEATURES */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-stone-600 tracking-wider">
              AMENITIES & HIGHLIGHTS
            </label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="E.G. Standby Generator, Sea View, Lift, Parking"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#657A68] focus:bg-white text-xs font-semibold text-[#1A1F1C] outline-hidden transition-all"
            />
            <span className="text-[10px] text-stone-400">
              Comma separated features (e.g. Lift, Generator, Security)
            </span>
          </div>

          {/* 4. DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>DESCRIPTION *</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write updated property details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#657A68] focus:bg-white text-xs font-medium text-[#1A1F1C] outline-hidden transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#1A1F1C] hover:bg-[#657A68] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  <span>SAVING...</span>
                </>
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}