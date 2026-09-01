import { getFilteredProperties, PropertyFilterParams } from "@/actions/property";
import PropertyCard, { PropertyItem } from "@/components/PropertyCard";
import ResetFilterButton from "@/components/ResetFilterButton";
import Link from "next/link";
import { Filter, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PropertiesPageProps {
  searchParams: Promise<PropertyFilterParams>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;
  const { properties: rawProperties, totalCount, totalPages, currentPage } =
    await getFilteredProperties(resolvedParams);

  const properties: PropertyItem[] = rawProperties.map((p: any) => ({
    ...p,
    rentPrice: Number(p.rentPrice),
  }));

  const hasActiveFilters = Object.entries(resolvedParams).some(
    ([k, v]) =>
      k !== "page" &&
      v !== undefined &&
      v !== "" &&
      v !== "ALL PHASES" &&
      v !== "ALL" &&
      v !== "HOMES" &&
      v !== "ALL TYPES"
  );

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    Object.entries(resolvedParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, String(v));
    });
    params.set("page", String(newPage));
    return `/properties?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Reset Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs transition-all"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#1A1F1C] tracking-tight">
              AVAILABLE PROPERTIES
            </h1>
          </div>
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider pl-10">
            SHOWING {properties.length} OF {totalCount} VERIFIED RENTALS IN DHA KARACHI (PAGE {currentPage} OF {totalPages || 1})
          </p>
        </div>

        {hasActiveFilters && <ResetFilterButton />}
      </div>

      {/* 2. Active Search Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-black uppercase text-stone-700">
          <span className="text-stone-400">ACTIVE FILTERS:</span>
          {resolvedParams.phase && (
            <span className="px-3 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
              Area: <strong className="text-[#657A68]">{resolvedParams.phase}</strong>
            </span>
          )}
          {resolvedParams.type && resolvedParams.type !== "HOMES" && (
            <span className="px-3 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
              Type: <strong className="text-[#657A68]">{resolvedParams.type}</strong>
            </span>
          )}
          {resolvedParams.search && (
            <span className="px-3 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
              Keyword: <strong className="text-[#657A68]">"{resolvedParams.search}"</strong>
            </span>
          )}
          {(resolvedParams.minPrice || resolvedParams.maxPrice) && (
            <span className="px-3 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
              Price: <strong className="text-[#657A68]">PKR {resolvedParams.minPrice || "0"} - {resolvedParams.maxPrice || "Any"}</strong>
            </span>
          )}
        </div>
      )}

      {/* 3. FULL WIDTH VERTICAL STACK (1 COMPLETE ROW PER AD) */}
      {properties.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase text-[#1A1F1C]">
              NO MATCHING LISTINGS FOUND
            </h3>
            <p className="text-xs font-bold uppercase text-stone-400 max-w-sm mx-auto">
              TRY BROADENING YOUR SEARCH CRITERIA OR RESET FILTERS TO VIEW ALL PROPERTIES.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-block px-5 py-2.5 bg-[#1A1F1C] text-white rounded-xl text-xs font-black uppercase tracking-wider"
          >
            VIEW ALL AVAILABLE PROPERTIES
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* 4. PAGINATION */}
      {totalPages > 1 && (
        <div className="pt-8 border-t border-stone-200/90 flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="px-3.5 py-2 bg-white border border-stone-200 hover:border-[#657A68] rounded-xl text-xs font-black uppercase flex items-center gap-1 shadow-2xs transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </Link>
          ) : (
            <span className="px-3.5 py-2 bg-stone-100 border border-stone-200 text-stone-400 rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-black uppercase flex items-center justify-center transition-all ${
                  currentPage === pageNum
                    ? "bg-[#1A1F1C] text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="px-3.5 py-2 bg-white border border-stone-200 hover:border-[#657A68] rounded-xl text-xs font-black uppercase flex items-center gap-1 shadow-2xs transition-all"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="px-3.5 py-2 bg-stone-100 border border-stone-200 text-stone-400 rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-not-allowed">
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}

    </div>
  );
}