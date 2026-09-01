"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAdminOwnListings, adminDeleteProperty, togglePropertyPremium } from "@/actions/admin";
import {
  Building2,
  Plus,
  Flame,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export default function AdminMyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    const res = await getAdminOwnListings();
    if (res.success && res.data) {
      setListings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
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
    } else {
      setErrorMsg(res.error || "COULD NOT UPDATE PREMIUM STATUS.");
    }
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ARE YOU SURE YOU WANT TO DELETE YOUR LISTING: "${title}"?`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await adminDeleteProperty(id);
    if (res.success) {
      setSuccessMsg("LISTING REMOVED SUCCESSFULLY.");
      setListings((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMsg(res.error || "FAILED TO DELETE PROPERTY.");
    }
    setActionLoadingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              MY POSTED LISTINGS
            </h1>
            <span className="px-2.5 py-0.5 bg-[#657A68]/15 text-[#657A68] text-xs font-black rounded-lg">
              {listings.length} PROPERTIES
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            MANAGE YOUR DIRECTLY POSTED PROPERTIES & TRACK STATUS
          </p>
        </div>

        <Link
          href="/post-ad"
          style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#657A68] stroke-[3]" />
          <span>POST NEW PROPERTY</span>
        </Link>
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

      {/* 3. Listings View */}
      {loading ? (
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400">
          LOADING YOUR LISTINGS...
        </div>
      ) : listings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase text-[#1A1F1C]">
              YOU HAVEN'T POSTED ANY PROPERTIES YET
            </h3>
            <p className="text-xs font-bold uppercase text-stone-400 max-w-sm mx-auto">
              CLICK THE BUTTON BELOW TO POST YOUR FIRST VERIFIED DHA PROPERTY.
            </p>
          </div>
          <Link
            href="/post-ad"
            style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
            className="inline-block px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
          >
            CREATE FIRST LISTING
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {listings.map((property) => {
            const isItemLoading = actionLoadingId === property.id;
            const images = property.images && property.images.length > 0 ? property.images : ["/placeholder.jpg"];
            
            // Calculate remaining active days (14 days total)
            const createdDate = new Date(property.createdAt);
            const expiryDate = property.expiresAt ? new Date(property.expiresAt) : new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
            const diffDays = Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

            return (
              <div
                key={property.id}
                className={`bg-white rounded-3xl border p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs transition-all ${
                  property.isPremium
                    ? "border-red-300 bg-red-50/15"
                    : "border-stone-200/90"
                }`}
              >
                {/* Left: Thumbnail & Core Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    {property.isPremium && (
                      <div className="absolute top-1 left-1 bg-[#E53935] text-white p-1 rounded-md shadow-md">
                        <Flame className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                        #{property.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs font-black text-[#657A68] uppercase">
                        {property.phase}
                      </span>
                      <span className="text-[10px] font-black uppercase text-stone-600 bg-[#FBFBF9] px-2 py-0.5 rounded-md border border-stone-200">
                        {property.propertyType}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black uppercase text-[#1A1F1C] truncate">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-bold uppercase text-stone-500 flex-wrap">
                      <span className="text-stone-900 font-black">
                        PKR {Number(property.rentPrice).toLocaleString()} / MO
                      </span>
                      <span>•</span>
                      <span>{property.areaSqYards} SQ. YDS</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-[#657A68]">
                        <Clock className="w-3 h-3" />
                        <span>{diffDays} DAYS REMAINING</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Controls */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                  
                  {/* Public Link */}
                  <Link
                    href={`/property/${property.id}`}
                    target="_blank"
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Toggle Premium */}
                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleTogglePremium(property.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
                      property.isPremium
                        ? "bg-[#E53935] text-white border-[#E53935] shadow-xs"
                        : "bg-white hover:bg-red-50 text-[#E53935] border-red-200"
                    } disabled:opacity-50`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>{property.isPremium ? "PREMIUM ACTIVE" : "MAKE PREMIUM"}</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleDelete(property.id, property.title)}
                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Listing"
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