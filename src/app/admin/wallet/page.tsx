"use client";

import { useState, useEffect } from "react";
import { getAdminWalletData, rechargeAdminSelfCredits } from "@/actions/admin";
import {
  Wallet,
  Coins,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Infinity as InfinityIcon,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Zap,
} from "lucide-react";

export default function AdminWalletPage() {
  const [data, setData] = useState<{
    adCredits: number;
    boostCredits: number;
    totalUsersCount: number;
    totalListingsCount: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Custom Input States
  const [adAmount, setAdAmount] = useState<number>(10);
  const [boostAmount, setBoostAmount] = useState<number>(10);

  const loadData = async () => {
    setLoading(true);
    const res = await getAdminWalletData();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecharge = async (amount: number, type: "AD" | "BOOST") => {
    if (amount <= 0) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await rechargeAdminSelfCredits(amount, type);
    if (res.success && res.wallet) {
      setSuccessMsg(res.message || "CREDITS GRANTED SUCCESSFULLY!");
      setData((prev) =>
        prev
          ? {
              ...prev,
              adCredits: res.wallet.adCredits,
              boostCredits: res.wallet.boostCredits,
            }
          : null
      );
    } else {
      setErrorMsg(res.error || "FAILED TO RECHARGE.");
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              ADMIN WALLET & CREDITS CONTROL
            </h1>
            <span className="px-2.5 py-0.5 bg-red-100 text-[#E53935] text-xs font-black rounded-lg">
              UNLIMITED ADMIN OVERRIDE
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            GRANT UNLIMITED AD CREDITS & BOOST CREDITS TO YOUR ADMIN ACCOUNT
          </p>
        </div>

        {/* Quick +999 Super Grant */}
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => handleRecharge(999, "AD")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1F1C] text-white text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <InfinityIcon className="w-4 h-4 text-emerald-400" />
          <span>INSTANT +999 AD CREDITS</span>
        </button>
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

      {/* 1. CURRENT LIVE BALANCES CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ad Credits */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-black uppercase tracking-wider">
              MY AD CREDITS
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A1F1C]">
            {loading ? "..." : data?.adCredits ?? 0}
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase">
            REQUIRED TO POST DIRECT PROPERTIES
          </p>
        </div>

        {/* Boost Credits */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-black uppercase tracking-wider">
              MY BOOST CREDITS
            </span>
            <div className="p-2 rounded-xl bg-[#657A68]/15 text-[#657A68]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A1F1C]">
            {loading ? "..." : data?.boostCredits ?? 0}
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase">
            TO BOOST ADS TO TOP DIRECTORY
          </p>
        </div>

        {/* Total Directory Properties */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-black uppercase tracking-wider">
              SYSTEM LISTINGS
            </span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A1F1C]">
            {loading ? "..." : data?.totalListingsCount ?? 0}
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase">
            LIVE & ARCHIVED PROPERTIES
          </p>
        </div>

        {/* Total Registered Users */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-black uppercase tracking-wider">
              TOTAL USERS
            </span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A1F1C]">
            {loading ? "..." : data?.totalUsersCount ?? 0}
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase">
            AGENTS & CLIENTS REGISTERED
          </p>
        </div>
      </div>

      {/* 2. RECHARGE SECTIONS (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* RECHARGE AD CREDITS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase text-[#1A1F1C]">
                ADD AD POSTING CREDITS
              </h2>
              <p className="text-[11px] font-bold text-stone-400 uppercase">
                INCREASE YOUR CAPACITY TO POST NEW LISTINGS
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase text-stone-700">
              SELECT PRESET AMOUNT
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAdAmount(preset)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    adAmount === preset
                      ? "bg-[#1A1F1C] text-white border-[#1A1F1C] shadow-xs"
                      : "bg-[#FBFBF9] border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                CUSTOM AMOUNT
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={adAmount}
                onChange={(e) => setAdAmount(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => handleRecharge(adAmount, "AD")}
              style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>ADD {adAmount} AD CREDITS</span>
            </button>
          </div>
        </div>

        {/* RECHARGE BOOST CREDITS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase text-[#1A1F1C]">
                ADD BOOST CREDITS
              </h2>
              <p className="text-[11px] font-bold text-stone-400 uppercase">
                FEATURE PROPERTIES AT THE TOP OF DIRECTORY
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase text-stone-700">
              SELECT PRESET AMOUNT
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBoostAmount(preset)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    boostAmount === preset
                      ? "bg-[#657A68] text-white border-[#657A68] shadow-xs"
                      : "bg-[#FBFBF9] border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                CUSTOM AMOUNT
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={boostAmount}
                onChange={(e) => setBoostAmount(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => handleRecharge(boostAmount, "BOOST")}
              className="w-full py-3 rounded-xl bg-[#657A68] hover:bg-[#526455] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>ADD {boostAmount} BOOST CREDITS</span>
            </button>
          </div>
        </div>

      </div>

      {/* Note Banner */}
      <div className="p-5 bg-stone-100 rounded-3xl border border-stone-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#657A68] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h3 className="text-xs font-black uppercase text-[#1A1F1C]">
            ADMIN OVERRIDE NOTE:
          </h3>
          <p className="text-[11px] font-bold text-stone-500 uppercase leading-relaxed">
            Credits added here are directly associated with your super admin account. For assigning Premium status to properties, you can directly toggle the <strong className="text-[#E53935]">MARK PREMIUM</strong> button from the <strong>ALL LISTINGS</strong> or <strong>MY LISTINGS</strong> tab without credit deductions.
          </p>
        </div>
      </div>
    </div>
  );
}