import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Phone,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Building,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const resolvedParams = await params;
  const property = await prisma.property.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: {
        select: {
          name: true,
          phone: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!property || property.status !== "APPROVED") {
    notFound();
  }

  const numericPrice = Number(property.rentPrice);
  const whatsappNumber = property.user.phone.replace(/^0/, "92").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum, I am interested in your listing: "${property.title}" in ${property.phase} listed on GO RENTAL DHA.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Back Navigation & Quick Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#1A1F1C] rounded-xl text-xs font-black uppercase tracking-wider shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO LISTINGS</span>
        </Link>

        <span className="text-xs font-black uppercase text-stone-400">
          ID: {property.id.slice(-8)}
        </span>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Columns: Gallery, Specs & Description */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Image Gallery */}
          <PropertyGallery
            images={property.images}
            title={property.title}
            isBoosted={property.isBoosted}
            isPremium={Boolean((property as any).isPremium)}
            phase={property.phase}
          />

          {/* Title & Basic Details */}
          <div className="space-y-3 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#657A68]">
              <MapPin className="w-4 h-4" />
              <span>{property.phase} • DHA KARACHI</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-[#1A1F1C] tracking-tight leading-tight">
              {property.title}
            </h1>

            {/* Spec Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-stone-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#657A68]">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">TYPE</span>
                  <span className="text-xs font-black text-[#1A1F1C] uppercase truncate block">{property.propertyType}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-stone-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#657A68]">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">AREA</span>
                  <span className="text-xs font-black text-[#1A1F1C] uppercase block">{property.areaSqYards} SQ. YDS</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-stone-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#657A68]">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">BEDROOMS</span>
                  <span className="text-xs font-black text-[#1A1F1C] uppercase block">{property.bedrooms ?? "N/A"}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-stone-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#657A68]">
                  <Bath className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">BATHROOMS</span>
                  <span className="text-xs font-black text-[#1A1F1C] uppercase block">{property.bathrooms ?? "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-base font-black uppercase text-[#1A1F1C] tracking-wide">
              PROPERTY DESCRIPTION
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed whitespace-pre-line uppercase">
              {property.description}
            </p>
          </div>
        </div>

        {/* Right 4 Columns: Sticky Price & Contact Card */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-md space-y-6 sticky top-28">
            
            {/* Price Box */}
            <div className="space-y-1 pb-5 border-b border-stone-100">
              <span className="text-[11px] font-bold uppercase text-stone-400 block">
                MONTHLY RENT DEMAND
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#1A1F1C] tracking-tight">
                PKR {numericPrice.toLocaleString()}
                <span className="text-xs font-bold text-stone-400 uppercase ml-1">/ MONTH</span>
              </div>
            </div>

            {/* Agent Info */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase text-stone-400 block">
                LISTED BY
              </span>
              <div className="flex items-center gap-3.5 p-3.5 bg-[#FBFBF9] rounded-2xl border border-stone-200/80">
                <div className="w-11 h-11 rounded-xl bg-[#657A68] text-white flex items-center justify-center font-black text-sm uppercase">
                  {property.user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-black uppercase text-[#1A1F1C] truncate">
                    {property.user.name}
                  </div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#657A68]" />
                    <span>VERIFIED AGENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>INQUIRE VIA WHATSAPP</span>
              </a>

              <a
                href={`tel:${property.user.phone}`}
                className="w-full py-3.5 bg-[#1A1F1C] hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 text-[#657A68]" />
                <span>CALL AGENT ({property.user.phone})</span>
              </a>
            </div>

            {/* Safety Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[10px] font-bold uppercase text-amber-900 leading-relaxed">
              NOTICE: NEVER TRANSFER ADVANCE TOKEN/PAYMENT BEFORE IN-PERSON VERIFICATION IN DHA KARACHI.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}