"use client";

import { useState, useEffect } from "react";
import { getSystemSettings, updateSystemSettings } from "@/actions/admin";
import {
  Settings,
  ShieldCheck,
  Phone,
  Mail,
  Coins,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    siteName: "GO RENTAL DHA",
    supportPhone: "+92 300 0000000",
    supportEmail: "support@gorentaldha.com",
    defaultFreeCredits: 3,
    adExpiryDays: 14,
    premiumExpiryDays: 7,
    maintenanceMode: false,
    allowRegistration: true,
    autoApproveListings: true,
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getSystemSettings();
      if (res.success && res.data) {
        setForm({
          siteName: res.data.siteName || "GO RENTAL DHA",
          supportPhone: res.data.supportPhone || "+92 300 0000000",
          supportEmail: res.data.supportEmail || "support@gorentaldha.com",
          defaultFreeCredits: res.data.defaultFreeCredits ?? 3,
          adExpiryDays: res.data.adExpiryDays ?? 14,
          premiumExpiryDays: res.data.premiumExpiryDays ?? 7,
          maintenanceMode: Boolean(res.data.maintenanceMode),
          allowRegistration: Boolean(res.data.allowRegistration),
          autoApproveListings: Boolean(res.data.autoApproveListings),
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await updateSystemSettings(form);
    if (res.success) {
      setSuccessMsg(res.message || "SETTINGS SAVED SUCCESSFULLY!");
    } else {
      setErrorMsg(res.error || "FAILED TO SAVE SETTINGS.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              GLOBAL PORTAL SETTINGS
            </h1>
            <span className="px-2.5 py-0.5 bg-[#657A68]/15 text-[#657A68] text-xs font-black rounded-lg">
              SYSTEM CONFIG
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            CONFIGURE LISTING EXPIRY RULES, FREE SIGNUP CREDITS & PORTAL ACCESS
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

      {loading ? (
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400">
          LOADING PORTAL SETTINGS...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. PORTAL CRITICAL TOGGLES */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#657A68]" />
              <h2 className="text-sm font-black uppercase text-[#1A1F1C]">
                SECURITY & ACCESS SWITCHES
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Maintenance Mode */}
              <div className={`p-4 rounded-2xl border transition-all ${
                form.maintenanceMode ? "bg-red-50/50 border-red-200" : "bg-[#FBFBF9] border-stone-200/80"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-[#1A1F1C]">
                    MAINTENANCE MODE
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
                    className="text-stone-700 hover:text-stone-900 cursor-pointer"
                  >
                    {form.maintenanceMode ? (
                      <ToggleRight className="w-7 h-7 text-[#E53935]" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-stone-300" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] font-bold uppercase text-stone-400">
                  {form.maintenanceMode ? "ONLY ADMIN CAN ACCESS SITE" : "SITE IS LIVE FOR EVERYONE"}
                </p>
              </div>

              {/* Allow Registration */}
              <div className="p-4 rounded-2xl border bg-[#FBFBF9] border-stone-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-[#1A1F1C]">
                    NEW REGISTRATIONS
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, allowRegistration: !form.allowRegistration })}
                    className="text-stone-700 hover:text-stone-900 cursor-pointer"
                  >
                    {form.allowRegistration ? (
                      <ToggleRight className="w-7 h-7 text-[#657A68]" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-stone-300" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] font-bold uppercase text-stone-400">
                  {form.allowRegistration ? "OPEN FOR NEW CLIENTS/AGENTS" : "REGISTRATIONS CLOSED"}
                </p>
              </div>

              {/* Auto Approve Listings */}
              <div className="p-4 rounded-2xl border bg-[#FBFBF9] border-stone-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-[#1A1F1C]">
                    AUTO-APPROVE ADS
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, autoApproveListings: !form.autoApproveListings })}
                    className="text-stone-700 hover:text-stone-900 cursor-pointer"
                  >
                    {form.autoApproveListings ? (
                      <ToggleRight className="w-7 h-7 text-[#657A68]" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-stone-300" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] font-bold uppercase text-stone-400">
                  {form.autoApproveListings ? "ADS GO LIVE INSTANTLY" : "ADS REQUIRE ADMIN APPROVAL"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. LISTING & CREDIT PARAMETERS */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Coins className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-black uppercase text-[#1A1F1C]">
                CREDITS & EXPIRY TIMELINES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  FREE SIGNUP CREDITS
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={form.defaultFreeCredits}
                  onChange={(e) => setForm({ ...form, defaultFreeCredits: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
                <span className="text-[10px] font-bold text-stone-400 uppercase mt-1 block">
                  DEFAULT: 3 ADS FOR NEW ACCOUNTS
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  AD ACTIVE LIFESPAN (DAYS)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={form.adExpiryDays}
                  onChange={(e) => setForm({ ...form, adExpiryDays: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
                <span className="text-[10px] font-bold text-stone-400 uppercase mt-1 block">
                  DEFAULT: 14 DAYS ACTIVE LOCK
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  PREMIUM SHOWCASE (DAYS)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={form.premiumExpiryDays}
                  onChange={(e) => setForm({ ...form, premiumExpiryDays: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
                <span className="text-[10px] font-bold text-stone-400 uppercase mt-1 block">
                  DEFAULT: 7 DAYS TOP 5 SLOTS
                </span>
              </div>
            </div>
          </div>

          {/* 3. CONTACT & SITE IDENTITY */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Globe className="w-5 h-5 text-[#657A68]" />
              <h2 className="text-sm font-black uppercase text-[#1A1F1C]">
                SITE IDENTITY & SUPPORT CONTACTS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  PORTAL BRAND NAME
                </label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  OFFICIAL WHATSAPP / HELPLINE
                </label>
                <input
                  type="text"
                  value={form.supportPhone}
                  onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1.5">
                  OFFICIAL SUPPORT EMAIL
                </label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value.toLowerCase() })}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
              className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>{saving ? "SAVING SETTINGS..." : "SAVE SYSTEM PREFERENCES"}</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
}