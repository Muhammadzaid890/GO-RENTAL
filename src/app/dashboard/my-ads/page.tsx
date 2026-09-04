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
      <div className="p-12 text-center text-xs font-bold uppercase text-stone-400">
        LOADING YOUR LISTINGS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-dark">MY POSTED ADS</h1>
          <p className="text-xs text-stone-500 uppercase mt-0.5">
            MANAGE YOUR ACTIVE RENTAL PROPERTIES, BOOSTS AND DURATION LOCKS
          </p>
        </div>
        <Link
          href="/post-ad"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage hover:bg-sage-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>POST NEW AD</span>
        </Link>
      </div>

      {/* Ads List */}
      {properties.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-4">
          <p className="text-stone-400 font-bold uppercase text-xs">
            YOU HAVE NOT POSTED ANY ADS YET.
          </p>
          <Link
            href="/post-ad"
            className="inline-block px-5 py-2.5 bg-dark text-white rounded-xl text-xs font-black uppercase"
          >
            POST YOUR FIRST LISTING
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-all"
              >
                <div className="space-y-3">
                  {/* Status Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          item.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.isPremium && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-black uppercase">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    {isBoostActive && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sage text-white text-[10px] font-black uppercase">
                        <Sparkles className="w-3 h-3" />
                        BOOSTED
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div>
                    <h3 className="font-black text-dark text-sm uppercase line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="text-xs text-stone-400 flex items-center gap-1 uppercase mt-0.5">
                      <MapPin className="w-3 h-3 text-sage" />
                      {item.phase} • {item.propertyType}
                    </div>
                  </div>

                  <div className="text-base font-black text-dark">
                    PKR {Number(item.rentPrice).toLocaleString()}
                  </div>

                  {/* Expiry / Lock Status Box */}
                  <div className="p-3 bg-[#FBFBF9] rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-stone-600 font-bold uppercase">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>{isLocked ? `${daysRemaining} DAYS REMAINING` : "DURATION EXPIRED"}</span>
                    </div>
                    {isLocked && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-black uppercase">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions: View Ad + Boost Ad + Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-2">
                  <Link
                    href={`/property/${item.id}`}
                    className="text-stone-500 hover:text-dark text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>VIEW</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* BOOST BUTTON */}
                    {isBoostActive ? (
                      <span className="text-[11px] font-bold text-sage uppercase px-3 py-1.5 bg-sage/10 rounded-lg border border-sage/20">
                        BOOST ACTIVE
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={boostingId === item.id}
                        onClick={() => handleBoostClick(item.id)}
                        style={{ backgroundColor: "#1c1917", color: "#ffffff" }}
                        className="flex items-center gap-1 text-xs font-black uppercase px-3 py-1.5 rounded-lg bg-dark hover:bg-stone-800 text-white transition-all cursor-pointer disabled:opacity-50"
                      >
                        {boostingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-sage" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-sage" />
                        )}
                        <span>BOOST AD</span>
                      </button>
                    )}

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(item)}
                      className={`flex items-center gap-1 text-xs font-black uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isLocked
                          ? "bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-600"
                          : "bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-dark hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black uppercase text-dark">
                AD CANNOT BE DELETED
              </h3>
              <p className="text-xs text-stone-600 uppercase font-medium leading-relaxed">
                ALL LISTINGS ON GO RENTAL DHA ARE LOCKED FOR A MINIMUM ACTIVE DURATION OF 14 DAYS (2 WEEKS).
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-black uppercase">
                  {modalDaysLeft} DAYS REMAINING BEFORE UNLOCK
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full py-3 bg-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-stone-800 transition-all"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}