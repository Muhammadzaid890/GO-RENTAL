"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAdminOwnListings, adminDeleteProperty, togglePropertyPremium } from "@/actions/admin";
import EditAdModal from "@/components/dashboard/EditAdModal";
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
  Edit3,
  Eye,
  Users,
} from "lucide-react";

export default function AdminMyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Edit Modal State
  const [editingProperty, setEditingProperty] = useState<any | null>(null);

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
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              MY POSTED LISTINGS
            </h1>
            <span className="px-2.5 py-0.5 bg-[#657A68]/15 text-[#657A68] text-xs font-black rounded-lg">
              {listings.length} PROPERTIES
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400 mt-0.5">
            MANAGE YOUR DIRECTLY POSTED PROPERTIES & TRACK STATUS
          </p>
        </div>

        <Link
          href="/post-ad"
          style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all shadow-xs cursor-pointer w-full sm:w-auto"
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
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400 tracking-wider">
          LOADING YOUR LISTINGS...
        </div>
      ) : listings.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
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
            className="inline-block px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
          >
            CREATE FIRST LISTING
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
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
                className={`bg-white rounded-3xl border p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xs transition-all ${
                  property.isPremium
                    ? "border-red-300 bg-red-50/10"
                    : "border-stone-200/90 hover:border-stone-300"
                }`}
              >
                {/* Left Area: Thumbnail + Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  {/* Thumbnail Image */}
                  <div className="relative w-full sm:w-24 sm:h-24 h-48 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={images[0]}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 96px"
                      className="object-cover"
                    />
                    {property.isPremium && (
                      <div className="absolute top-2 left-2 bg-[#E53935] text-white p-1 rounded-md shadow-md flex items-center gap-1 text-[10px] font-black uppercase px-2">
                        <Flame className="w-3 h-3" />
                        <span>PREMIUM</span>
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="space-y-1.5 min-w-0 flex-1 w-full">
                    {/* Top Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
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

                    {/* Listing Title */}
                    <h3 className="text-sm sm:text-base font-black uppercase text-[#1A1F1C] truncate block">
                      {property.title}
                    </h3>

                    {/* Price, Area & Duration */}
                    <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold uppercase text-stone-500 flex-wrap">
                      <span className="text-stone-900 font-black">
                        PKR {Number(property.rentPrice).toLocaleString()} / MO
                      </span>
                      <span>•</span>
                      <span>{property.areaSqYards} SQ. YDS</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-[#657A68]">
                        <Clock className="w-3 h-3" />
                        <span>{diffDays} DAYS LEFT</span>
                      </div>
                    </div>

                    {/* Real-time Views & Leads Tracking Pills */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200/70 rounded-lg text-blue-700 text-[10px] font-black uppercase">
                        <Eye className="w-3 h-3" />
                        <span>{property.views ?? 0} VIEWS</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/70 rounded-lg text-emerald-800 text-[10px] font-black uppercase">
                        <Users className="w-3 h-3" />
                        <span>{property.leads ?? 0} LEADS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Area: Action Controls (Optimized for Mobile Grid) */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-3 border-t border-stone-100 lg:pt-0 lg:border-t-0 shrink-0 w-full lg:w-auto">
                  {/* Public View Link */}
                  <Link
                    href={`/property/${property.id}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-black uppercase tracking-wider transition-colors shadow-2xs cursor-pointer col-span-1"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#657A68]" />
                    <span>VIEW</span>
                  </Link>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingProperty(property)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-[#1A1F1C] text-stone-700 hover:text-white border border-stone-200 hover:border-[#1A1F1C] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs col-span-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#657A68]" />
                    <span>EDIT</span>
                  </button>

                  {/* Toggle Premium Button */}
                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleTogglePremium(property.id)}
                    className={`col-span-1 sm:col-auto px-3 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      property.isPremium
                        ? "bg-[#E53935] text-white border-[#E53935] shadow-xs"
                        : "bg-white hover:bg-red-50 text-[#E53935] border-red-200"
                    } disabled:opacity-50`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{property.isPremium ? "PREMIUM" : "BOOST"}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleDelete(property.id, property.title)}
                    className="col-span-1 sm:col-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal Integration */}
      {editingProperty && (
        <EditAdModal
          property={{
            id: editingProperty.id,
            title: editingProperty.title,
            description: editingProperty.description || "",
            rentPrice: Number(editingProperty.rentPrice),
            amenities: editingProperty.amenities || "",
          }}
          isOpen={Boolean(editingProperty)}
          onClose={() => setEditingProperty(null)}
          onSuccess={() => {
            setEditingProperty(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}