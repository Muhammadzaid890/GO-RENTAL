"use client";

import { useEffect, useState } from "react";
import { getSystemSettings, updateSystemSettings } from "@/actions/admin";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Phone,
  Mail,
  Coins,
  Clock,
  Globe,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    siteName: "GO RENTAL DHA",
    supportPhone: "+92 316 2802558",
    supportEmail: "support@gorentaldha.com",
    defaultFreeCredits: 3,
    adExpiryDays: 14,
    premiumExpiryDays: 7,
    maintenanceMode: false,
    allowRegistration: true,
    autoApproveListings: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const res = await getSystemSettings();
      if (res.success && res.data) {
        setFormData({
          siteName: res.data.siteName || "GO RENTAL DHA",
          supportPhone: res.data.supportPhone || "",
          supportEmail: res.data.supportEmail || "",
          defaultFreeCredits: res.data.defaultFreeCredits ?? 3,
          adExpiryDays: res.data.adExpiryDays ?? 14,
          premiumExpiryDays: res.data.premiumExpiryDays ?? 7,
          maintenanceMode: Boolean(res.data.maintenanceMode),
          allowRegistration: Boolean(res.data.allowRegistration),
          autoApproveListings: Boolean(res.data.autoApproveListings),
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await updateSystemSettings(formData);
    setSaving(false);

    if (res.success) {
      setSuccessMsg(res.message || "SETTINGS SAVED SUCCESSFULLY!");
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      setErrorMsg(res.error || "FAILED TO SAVE SETTINGS.");
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-black uppercase text-stone-400 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
        <span>LOADING SYSTEM SETTINGS FROM DATABASE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-black uppercase text-[#171717] tracking-tight">
          PLATFORM & SYSTEM CONFIGURATION
        </h1>
        <p className="text-xs text-stone-500 uppercase mt-0.5 font-bold">
          UPDATE GLOBAL PLATFORM PARAMETERS, TIMINGS, AND CONTACT DETAILS SAVED IN DATABASE
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-black uppercase rounded-2xl flex items-center gap-2">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. General & Contact Config */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-black uppercase text-[#171717]">
              GENERAL & CONTACT SETTINGS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-stone-700">
                PLATFORM NAME
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-stone-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>SUPPORT PHONE / WHATSAPP</span>
              </label>
              <input
                type="text"
                required
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-stone-700 flex items-center gap-1">
                <Mail className="w-3 h-3 text-stone-400" />
                <span>SUPPORT EMAIL</span>
              </label>
              <input
                type="email"
                required
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>
          </div>
        </div>

        {/* 2. Credits & Ad Durations */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Coins className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-black uppercase text-[#171717]">
              CREDITS & EXPIRY DURATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-stone-700">
                DEFAULT SIGNUP FREE CREDITS
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.defaultFreeCredits}
                onChange={(e) =>
                  setFormData({ ...formData, defaultFreeCredits: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-stone-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>REGULAR AD LOCK DURATION (DAYS)</span>
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={formData.adExpiryDays}
                onChange={(e) =>
                  setFormData({ ...formData, adExpiryDays: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-stone-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>PREMIUM HOMEPAGE AD DURATION (DAYS)</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.premiumExpiryDays}
                onChange={(e) =>
                  setFormData({ ...formData, premiumExpiryDays: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
            </div>
          </div>
        </div>

        {/* 3. Platform Security & Controls */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-black uppercase text-[#171717]">
              PLATFORM TOGGLES & ACCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Maintenance Mode */}
            <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#171717] block">
                  MAINTENANCE MODE
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-bold">
                  HIDE SITE TEMPORARILY
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-[#171717] cursor-pointer"
              />
            </div>

            {/* Allow Registration */}
            <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#171717] block">
                  ALLOW REGISTRATION
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-bold">
                  NEW USER SIGNUPS
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.allowRegistration}
                onChange={(e) =>
                  setFormData({ ...formData, allowRegistration: e.target.checked })
                }
                className="w-5 h-5 accent-[#171717] cursor-pointer"
              />
            </div>

            {/* Auto-Approve Listings */}
            <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#171717] block">
                  AUTO-APPROVE LISTINGS
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-bold">
                  INSTANT PUBLIC VISIBILITY
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoApproveListings}
                onChange={(e) =>
                  setFormData({ ...formData, autoApproveListings: e.target.checked })
                }
                className="w-5 h-5 accent-[#171717] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          style={{ backgroundColor: "#171717", color: "#ffffff" }}
          className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-stone-900 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
          ) : (
            <Save className="w-4 h-4 text-[#D4AF37]" />
          )}
          <span className="text-white font-black tracking-wider">
            {saving ? "SAVING TO DATABASE..." : "SAVE SETTINGS TO DATABASE"}
          </span>
        </button>
      </form>
    </div>
  );
}