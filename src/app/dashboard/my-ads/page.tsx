"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteAgentProperty, boostRentalAd } from "@/actions/property";
import {
  MapPin,
  Clock,
  Sparkles,
  Lock,
  Trash2,
  AlertTriangle,
  PlusCircle,
  ExternalLink,
  Zap,
  X,
  Loader2,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  rentPrice: string | number;
  phase: string;
  propertyType: string;
  images: string[];
  status: string;
  isPremium?: boolean;
  isBoosted: boolean;
  boostExpiresAt?: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export default function MyAdsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [boostingId, setBoostingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDaysLeft, setModalDaysLeft] = useState(0);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/agent/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleBoostClick = async (propertyId: string) => {
    try {
      setBoostingId(propertyId);
      const res = await boostRentalAd(propertyId, 7);
      if (res.success) {
        await fetchAds();
      } else {
        alert(res.error || "FAILED TO BOOST AD. CHECK WALLET CREDITS.");
      }
    } catch (err: any) {
      alert(err?.message || "SOMETHING WENT WRONG");
    } finally {
      setBoostingId(null);
    }
  };

  const handleDeleteClick = async (item: Property) => {
    const now = new Date();
    const expiry = item.expiresAt ? new Date(item.expiresAt) : null;

    if (expiry && expiry > now) {
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setModalDaysLeft(diffDays);
      setModalOpen(true);
      return;
    }

    if (confirm("ARE YOU SURE YOU WANT TO PERMANENTLY DELETE THIS AD?")) {
      const res = await deleteAgentProperty(item.id);
      if (res.success) {
        fetchAds();
      } else {
        alert(res.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-black uppercase text-stone-400 tracking-widest flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
        <span>LOADING YOUR LISTINGS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#171717]">
            MY POSTED ADS
          </h1>
          <p className="text-xs text-stone-500 uppercase tracking-wide mt-0.5">
            MANAGE YOUR ACTIVE RENTAL PROPERTIES, BOOSTS AND DURATION LOCKS
          </p>
        </div>
        <Link
          href="/post-ad"
          style={{ backgroundColor: "#171717", color: "#ffffff" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-stone-900 transition-all shadow-md group self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="text-white font-black">POST NEW AD</span>
        </Link>
      </div>

      {/* Ads List */}
      {properties.length === 0 ? (
        <div className="bg-white p-14 text-center rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <p className="text-stone-400 font-bold uppercase text-xs tracking-wider">
            YOU HAVE NOT POSTED ANY ADS YET.
          </p>
          <Link
            href="/post-ad"
            style={{ backgroundColor: "#171717", color: "#ffffff" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-stone-900 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>POST YOUR FIRST LISTING</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.map((item) => {
            const now = new Date();
            const expiry = item.expiresAt ? new Date(item.expiresAt) : null;
            const isLocked = expiry ? expiry > now : false;
            const daysRemaining = expiry
              ? Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
              : 0;

            const isBoostActive = Boolean(
              item.isBoosted &&
              item.boostExpiresAt &&
              new Date(item.boostExpiresAt) > now
            );

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="space-y-3.5">
                  {/* Status Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                          item.status === "APPROVED"
                            ? "bg-[#657A68]/10 text-[#657A68] border-[#657A68]/30"
                            : "bg-stone-100 text-stone-700 border-stone-200"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.isPremium && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#997300] border border-[#D4AF37]/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                          PREMIUM
                        </span>
                      )}
                    </div>

                    {isBoostActive && (
                      <span
                        style={{ backgroundColor: "#171717", color: "#D4AF37" }}
                        className="flex items-center gap-1 px-3 py-1 rounded-md border border-[#D4AF37]/50 text-[10px] font-black uppercase tracking-wider shadow-xs"
                      >
                        <Zap className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                        BOOSTED
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div>
                    <h3 className="font-black text-[#171717] text-sm sm:text-base uppercase line-clamp-1 group-hover:text-stone-800 transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-xs text-stone-400 flex items-center gap-1.5 uppercase mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#657A68] shrink-0" />
                      <span>{item.phase} • {item.propertyType}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-black text-[#171717] tracking-tight">
                    PKR {Number(item.rentPrice).toLocaleString()}
                    <span className="text-[11px] text-stone-400 font-bold ml-1">/ MO</span>
                  </div>

                  {/* Expiry / Lock Status Box */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-stone-600 font-bold uppercase">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[11px]">{isLocked ? `${daysRemaining} DAYS REMAINING` : "DURATION EXPIRED"}</span>
                    </div>
                    {isLocked && (
                      <span className="flex items-center gap-1 text-[10px] text-stone-700 bg-stone-200/70 border border-stone-300 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions: View Ad + Boost Ad + Delete */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 gap-2">
                  <Link
                    href={`/property/${item.id}`}
                    className="text-stone-500 hover:text-[#171717] text-xs font-bold uppercase flex items-center gap-1.5 transition-colors py-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#657A68]" />
                    <span className="font-black">VIEW AD</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* BOOST BUTTON */}
                    {isBoostActive ? (
                      <span className="text-[11px] font-black text-[#657A68] uppercase px-3.5 py-2 bg-[#657A68]/10 rounded-xl border border-[#657A68]/20 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#657A68]" />
                        BOOST ACTIVE
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={boostingId === item.id}
                        onClick={() => handleBoostClick(item.id)}
                        style={{ backgroundColor: "#171717", color: "#ffffff" }}
                        className="flex items-center gap-1.5 text-xs font-black uppercase px-4 py-2 rounded-xl border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-stone-900 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        {boostingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                        )}
                        <span className="text-white font-black tracking-wider">BOOST AD</span>
                      </button>
                    )}

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(item)}
                      className={`flex items-center gap-1.5 text-xs font-black uppercase px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                        isLocked
                          ? "bg-stone-100 border-stone-200 text-stone-400 hover:bg-stone-200/70 hover:text-stone-600"
                          : "bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-2xs"
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isLocked ? "LOCKED" : "DELETE"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 14-Day Lock Warning Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-[#171717] hover:bg-stone-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 text-[#997300] border border-[#D4AF37]/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-[#D4AF37]" />
            </div>

            <div className="text-center space-y-2.5">
              <h3 className="text-lg font-black uppercase text-[#171717] tracking-tight">
                AD CANNOT BE DELETED
              </h3>
              <p className="text-xs text-stone-600 uppercase font-medium leading-relaxed">
                ALL LISTINGS ON GO RENTAL DHA ARE LOCKED FOR A MINIMUM ACTIVE DURATION OF 14 DAYS (2 WEEKS).
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-black uppercase tracking-wider">
                  {modalDaysLeft} DAYS REMAINING BEFORE UNLOCK
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{ backgroundColor: "#171717", color: "#ffffff" }}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-stone-900 transition-all cursor-pointer shadow-lg"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}