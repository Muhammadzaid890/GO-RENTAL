"use client";

import { useState, useEffect } from "react";
import { updateAgentProfile } from "@/actions/profile";
import { User, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/agent/profile");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      }
      setInitialLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const res = await updateAgentProfile({
      name: formData.name,
      phone: formData.phone,
    });

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "FAILED TO UPDATE PROFILE.");
    }
    setLoading(false);
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-xs font-bold uppercase text-stone-400">LOADING SETTINGS...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase text-dark">ACCOUNT SETTINGS</h1>
        <p className="text-xs text-stone-500 uppercase mt-0.5">
          UPDATE YOUR PUBLIC DISPLAY NAME AND CONTACT WHATSAPP NUMBER
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6 max-w-xl">
        {success && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>PROFILE DETAILS UPDATED SUCCESSFULLY!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">
              EMAIL ADDRESS (LOCKED)
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 text-xs font-bold focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1">
              FULL NAME / AGENCY NAME
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.G. ALI REAL ESTATE"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold uppercase focus:outline-none focus:border-sage bg-[#FBFBF9]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1">
              WHATSAPP / CONTACT NUMBER
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:outline-none focus:border-sage bg-[#FBFBF9]"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-dark hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? "SAVING CHANGES..." : "SAVE PROFILE SETTINGS"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}