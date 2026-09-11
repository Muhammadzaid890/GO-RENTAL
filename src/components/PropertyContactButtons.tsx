"use client";

import { useEffect } from "react";
import { trackPropertyView, trackPropertyLead } from "@/actions/property";
import { MessageCircle, Phone } from "lucide-react";

interface PropertyContactButtonsProps {
  propertyId: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export default function PropertyContactButtons({
  propertyId,
  phone,
  whatsappNumber,
  whatsappMessage,
}: PropertyContactButtonsProps) {
  // Page view track karein
  useEffect(() => {
    if (propertyId) {
      trackPropertyView(propertyId);
    }
  }, [propertyId]);

  const handleLeadClick = (type: "WHATSAPP" | "CALL") => {
    // Lead background mein increment karein
    trackPropertyLead(propertyId);

    if (type === "WHATSAPP") {
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank");
    } else if (type === "CALL") {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="space-y-2.5 pt-2">
      {/* Inquire via WhatsApp */}
      <button
        type="button"
        onClick={() => handleLeadClick("WHATSAPP")}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <MessageCircle className="w-4 h-4" />
        <span>INQUIRE VIA WHATSAPP</span>
      </button>

      {/* Call Agent */}
      <button
        type="button"
        onClick={() => handleLeadClick("CALL")}
        className="w-full py-3.5 bg-[#1A1F1C] hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <Phone className="w-4 h-4 text-[#657A68]" />
        <span>CALL AGENT ({phone})</span>
      </button>
    </div>
  );
}