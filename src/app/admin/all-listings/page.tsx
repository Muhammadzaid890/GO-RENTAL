"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getAllAdminListings,
  togglePropertyPremium,
  adminDeleteProperty,
} from "@/actions/admin";
import {
  Building2,
  Flame,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  Coins,
  Maximize2,
} from "lucide-react";

export default function AdminAllListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("ALL");
  const [premiumOnly, setPremiumOnly] = useState(false);

  // Status Alerts
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    const res = await getAllAdminListings();
    if (res.success && res.data) {
      setListings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Premium Toggle Handler
  const handleTogglePremium = async (id: string) => {
    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await togglePropertyPremium(id);
    if (res.success) {
      setSuccessMsg(res.message || "PREMIUM STATUS UPDATED!");
      // Update local state
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isPremium: res.isPremium } : item
        )
      );
    } else {
      setErrorMsg(res.error || "COULD NOT UPDATE PREMIUM STATUS.");
    }
    setActionLoadingId(null);
  };

  // Delete Handler
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ARE YOU SURE YOU WANT TO PERMANENTLY DELETE: "${title}"?`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await adminDeleteProperty(id);
    if (res.success) {
      setSuccessMsg("PROPERTY DELETED SUCCESSFULLY.");
      setListings((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMsg(res.error || "FAILED TO DELETE PROPERTY.");
    }
    setActionLoadingId(null);
  };

  // Filtered List
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.user?.name && item.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase =
      phaseFilter === "ALL" || item.phase.toUpperCase().includes(phaseFilter.toUpperCase());

    const matchesPremium = !premiumOnly || item.isPremium;

    return matchesSearch && matchesPhase && matchesPremium;
  });

  const activePremiumCount = listings.filter((l) => l.isPremium).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & Active Premium Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              ALL PROPERTY LISTINGS
            </h1>
            <span className="px-2.5 py-0.5 bg-stone-200 text-stone-700 text-xs font-black rounded-lg">
              {listings.length} TOTAL
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            MANAGE LISTINGS, ASSIGN PREMIUM SLOTS, & CONTROL DIRECTORY
          </p>
        </div>

        {/* 5 Premium Slot Badge */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E53935] text-white flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black uppercase text-[#E53935]">
              {activePremiumCount} / 5 SLOTS ACTIVE
            </div>
            <div className="text-[10px] font-bold uppercase text-stone-500">
              HOMEPAGE EXCLUSIVE SHOWCASE
            </div>
          </div>
        </div>
      </div>

      {/* 2. Status Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#E53935] text-xs font-black uppercase rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs">
        
        {/* Search Input */}
        <div className="relative sm:col-span-2">
          <input
            type="text"
            placeholder="SEARCH BY TITLE, ID, OR AGENT NAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* Phase Filter */}
        <div className="relative">
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-black uppercase outline-none focus:border-[#657A68] appearance-none cursor-pointer"
          >
            <option value="ALL">ALL PHASES</option>
            <option value="PHASE 1">PHASE 1</option>
            <option value="PHASE 2">PHASE 2</option>
            <option value="PHASE 4">PHASE 4</option>
            <option value="PHASE 5">PHASE 5</option>
            <option value="PHASE 6">PHASE 6</option>
            <option value="PHASE 7">PHASE 7</option>
            <option value="PHASE 8">PHASE 8</option>
          </select>
          <Filter className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Premium Only Toggle */}
        <button
          type="button"
          onClick={() => setPremiumOnly(!premiumOnly)}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            premiumOnly
              ? "bg-[#E53935] text-white border-[#E53935] shadow-xs"
              : "bg-[#FBFBF9] border-stone-200 text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{premiumOnly ? "SHOWING PREMIUM" : "FILTER PREMIUM"}</span>
        </button>
      </div>

      {/* 4. Listings Cards Table */}
      {loading ? (
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400">
          LOADING ADMIN LISTINGS...
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-black uppercase text-[#1A1F1C]">
            NO LISTINGS MATCH YOUR FILTER
          </div>
          <div className="text-xs font-bold text-stone-400 uppercase">
            TRY ADJUSTING YOUR SEARCH OR PHASE FILTER
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings.map((property) => {
            const isItemLoading = actionLoadingId === property.id;
            const images = property.images && property.images.length > 0 ? property.images : ["/placeholder.jpg"];

            return (
              <div
                key={property.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs ${
                  property.isPremium
                    ? "border-red-300 bg-red-50/20 shadow-xs"
                    : "border-stone-200/90"
                }`}
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    {property.isPremium && (
                      <div className="absolute top-1 left-1 bg-[#E53935] text-white p-1 rounded-md">
                        <Flame className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase bg-stone-100 px-2 py-0.5 rounded-md">
                        #{property.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs font-black text-[#657A68] uppercase">
                        {property.phase}
                      </span>
                      <span className="text-[10px] font-black uppercase text-stone-500 bg-[#FBFBF9] px-2 py-0.5 rounded-md border border-stone-200">
                        {property.propertyType}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black uppercase text-[#1A1F1C] truncate">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-bold uppercase text-stone-500 flex-wrap">
                      <span>PKR {Number(property.rentPrice).toLocaleString()} / MO</span>
                      <span>•</span>
                      <span>{property.areaSqYards} SQ. YDS</span>
                      {property.user?.name && (
                        <>
                          <span>•</span>
                          <span className="text-stone-700">POSTED BY: {property.user.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                  
                  {/* View Listing Link */}
                  <Link
                    href={`/property/${property.id}`}
                    target="_blank"
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="View Listing Live"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* PREMIUM TOGGLE BUTTON (FIRE-RED) */}
                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleTogglePremium(property.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
                      property.isPremium
                        ? "bg-[#E53935] hover:bg-red-700 text-white border-[#E53935] shadow-xs"
                        : "bg-white hover:bg-red-50 text-[#E53935] border-red-200 hover:border-red-300"
                    } disabled:opacity-50`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>
                      {property.isPremium ? "PREMIUM (ACTIVE)" : "MARK PREMIUM"}
                    </span>
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleDelete(property.id, property.title)}
                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}