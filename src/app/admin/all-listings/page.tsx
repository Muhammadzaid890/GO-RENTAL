"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllAdminListings,
  togglePropertyPremium,
  adminDeleteProperty,
} from "@/actions/admin";
import {
  Search,
  Hash,
  Flame,
  Trash2,
  ExternalLink,
  MapPin,
  Building,
  User,
  Coins,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Filter,
  X,
} from "lucide-react";

export default function AdminAllListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Search & Filters
  const [idQuery, setIdQuery] = useState("");
  const [titleQuery, setTitleQuery] = useState("");
  const [premiumFilter, setPremiumFilter] = useState("ALL");

  // Alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadListings = async () => {
    setLoading(true);
    const res = await getAllAdminListings();
    if (res.success && res.data) {
      setListings(res.data);
    } else {
      setErrorMsg(res.error || "FAILED TO LOAD LISTINGS.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleTogglePremium = async (id: string) => {
    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await togglePropertyPremium(id);
    if (res.success) {
      setSuccessMsg(res.message || "PREMIUM STATUS UPDATED!");
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isPremium: res.isPremium } : item
        )
      );
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(res.error || "FAILED TO UPDATE STATUS.");
    }
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ARE YOU SURE YOU WANT TO DELETE: "${title}"?`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await adminDeleteProperty(id);
    if (res.success) {
      setSuccessMsg("PROPERTY LISTING DELETED SUCCESSFULLY.");
      setListings((prev) => prev.filter((item) => item.id !== id));
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(res.error || "FAILED TO DELETE PROPERTY.");
    }
    setActionLoadingId(null);
  };

  const filteredListings = listings.filter((item) => {
    const cleanIdSearch = idQuery.trim().toLowerCase().replace("#", "").replace("id:", "").trim();
    
    const matchesId =
      cleanIdSearch === "" ||
      item.id.toLowerCase().includes(cleanIdSearch) ||
      item.id.slice(-8).toLowerCase().includes(cleanIdSearch);

    const cleanTitleSearch = titleQuery.trim().toLowerCase();
    const matchesTitle =
      cleanTitleSearch === "" ||
      item.title.toLowerCase().includes(cleanTitleSearch) ||
      item.phase.toLowerCase().includes(cleanTitleSearch);

    const matchesPremium =
      premiumFilter === "ALL" ||
      (premiumFilter === "PREMIUM" && item.isPremium) ||
      (premiumFilter === "REGULAR" && !item.isPremium);

    return matchesId && matchesTitle && matchesPremium;
  });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#171717] tracking-tight">
              ALL PROPERTY LISTINGS
            </h1>
            <span className="px-2.5 py-0.5 bg-stone-200 text-stone-700 text-xs font-black rounded-lg">
              {listings.length} TOTAL
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400 mt-0.5">
            SEARCH SPECIFIC PROPERTY BY ID, TOGGLE HOMEPAGE PREMIUM SLOTS, OR MANAGE ADS
          </p>
        </div>
      </div>

      {/* Status Alerts */}
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

      {/* SEARCH BAR (ID + TITLE + FILTER) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs">
        
        {/* ID Search Input */}
        <div className="relative sm:col-span-4">
          <label className="block text-[10px] font-black uppercase text-stone-500 mb-1 pl-1">
            SEARCH BY AD ID #
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="ENTER ID (E.G. 9E6DACB3)..."
              value={idQuery}
              onChange={(e) => setIdQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-mono font-bold uppercase outline-none focus:border-[#D4AF37]"
            />
            <Hash className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3 pointer-events-none" />
            {idQuery && (
              <button
                type="button"
                onClick={() => setIdQuery("")}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title/Tower Search */}
        <div className="relative sm:col-span-5">
          <label className="block text-[10px] font-black uppercase text-stone-500 mb-1 pl-1">
            SEARCH BY TITLE OR TOWER
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH EMAAR, PHASE 8, APARTMENT..."
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            {titleQuery && (
              <button
                type="button"
                onClick={() => setTitleQuery("")}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative sm:col-span-3">
          <label className="block text-[10px] font-black uppercase text-stone-500 mb-1 pl-1">
            STATUS
          </label>
          <div className="relative">
            <select
              value={premiumFilter}
              onChange={(e) => setPremiumFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-black uppercase outline-none focus:border-[#657A68] appearance-none cursor-pointer"
            >
              <option value="ALL">ALL LISTINGS</option>
              <option value="PREMIUM">PREMIUM ONLY</option>
              <option value="REGULAR">REGULAR ADS</option>
            </select>
            <Filter className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Listings List */}
      {loading ? (
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
          <span>LOADING ADS DIRECTORY...</span>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
          <Building className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-black uppercase text-[#171717]">
            NO PROPERTIES FOUND MATCHING YOUR ID OR SEARCH
          </div>
          <p className="text-xs text-stone-400 uppercase">
            CLEAR SEARCH INPUT TO VIEW ALL LISTINGS
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredListings.map((item) => {
            const isItemLoading = actionLoadingId === item.id;
            const shortId = item.id.slice(-8).toUpperCase();
            const coverImage =
              item.images && item.images.length > 0
                ? item.images[0]
                : "/placeholder.jpg";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xs transition-all ${
                  item.isPremium
                    ? "border-red-200 bg-red-50/10"
                    : "border-stone-200/90 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    {item.isPremium && (
                      <div className="absolute top-1.5 left-1.5 bg-[#E53935] text-white p-1 rounded-md shadow-md">
                        <Flame className="w-3 h-3 fill-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-[#171717] text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono font-black uppercase rounded-md tracking-wider">
                        ID: {shortId}
                      </span>

                      <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-black uppercase rounded-md">
                        {item.propertyType}
                      </span>

                      {item.isPremium && (
                        <span className="px-2 py-0.5 bg-[#E53935] text-white text-[9px] font-black uppercase rounded-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>HOMEPAGE PREMIUM</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-black uppercase text-[#171717] truncate">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-bold text-stone-500 flex-wrap">
                      <div className="flex items-center gap-1 uppercase text-[#657A68]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.phase}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#171717]">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>PKR {Number(item.rentPrice).toLocaleString()} / MO</span>
                      </div>

                      {item.user && (
                        <div className="flex items-center gap-1 uppercase text-stone-400">
                          <User className="w-3.5 h-3.5" />
                          <span>{item.user.name}</span>
                          {item.user.phone && <span>({item.user.phone})</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center shrink-0 flex-wrap">
                  <Link
                    href={`/property/${item.id}`}
                    target="_blank"
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleTogglePremium(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer disabled:opacity-50 ${
                      item.isPremium
                        ? "bg-[#E53935] hover:bg-red-700 text-white border-red-600 shadow-xs"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${item.isPremium ? "fill-white" : "text-amber-600"}`} />
                    <span>{item.isPremium ? "FEATURED (ACTIVE)" : "MAKE PREMIUM"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#E53935] border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
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