import { getPremiumProperties } from "@/actions/property";
import PropertyCard, { PropertyItem } from "@/components/PropertyCard";
import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function PremiumRentals() {
  const rawProperties = await getPremiumProperties();

  if (!rawProperties || rawProperties.length === 0) {
    return null;
  }

  const properties: PropertyItem[] = rawProperties.map((p: any) => ({
    ...p,
    rentPrice: Number(p.rentPrice),
  }));

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-[#E53935]">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black uppercase text-[#1A1F1C] tracking-tight">
                EXCLUSIVE PREMIUM RENTALS
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#E53935] text-white text-[9px] font-black uppercase tracking-wider">
                TOP 5
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase text-stone-400">
              HANDPICKED LUXURY LISTINGS IN DHA KARACHI
            </p>
          </div>
        </div>

        <Link
          href="/properties"
          className="text-xs font-black uppercase text-[#657A68] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>VIEW ALL ADS</span>
          
        </Link>
      </div>

      {/* 1 Row Per Ad List View */}
      <div className="flex flex-col gap-4 w-full">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}