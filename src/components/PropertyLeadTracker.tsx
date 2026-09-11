"use client";

import { useEffect } from "react";
import { trackPropertyView, trackPropertyLead } from "@/actions/property";
import { Phone, MessageCircle } from "lucide-react";

interface PropertyLeadTrackerProps {
  propertyId: string;
  phone?: string | null;
  whatsapp?: string | null;
  propertyTitle?: string;
}

export default function PropertyLeadTracker({
  propertyId,
  phone,
  whatsapp,
  propertyTitle = "",
}: PropertyLeadTrackerProps) {
  // Page khulte hi view count +1 karega
  useEffect(() => {
    if (propertyId) {
      trackPropertyView(propertyId);
    }
  }, [propertyId]);

  const rawPhone = phone || "";
  const rawWhatsapp = whatsapp || phone || "";

  const cleanPhone = rawPhone.replace(/\D/g, "");
  const cleanWa = rawWhatsapp.replace(/^0/, "92").replace(/\D/g, "");

  const waMsg = encodeURIComponent(
    `Assalam o Alaikum, I am interested in your listing: "${propertyTitle}" on GO RENTAL DHA.`
  );

  const handleLead = (type: "CALL" | "WHATSAPP") => {
    // Lead count +1 karega
    trackPropertyLead(propertyId);

    if (type === "CALL" && cleanPhone) {
      window.location.href = `tel:${cleanPhone}`;
    } else if (type === "WHATSAPP" && cleanWa) {
      window.open(`https://wa.me/${cleanWa}?text=${waMsg}`, "_blank");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      {/* Call Button */}
      {cleanPhone && (
        <button
          type="button"
          onClick={() => handleLead("CALL")}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1A1F1C] hover:bg-stone-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <Phone className="w-4 h-4 text-[#657A68]" />
          <span>CALL AGENT</span>
        </button>
      )}

      {/* WhatsApp Button */}
      {cleanWa && (
        <button
          type="button"
          onClick={() => handleLead("WHATSAPP")}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
          <span>WHATSAPP CHAT</span>
        </button>
      )}
    </div>
  );
}