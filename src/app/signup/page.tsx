"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { User, Mail, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "AGENT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await registerUser(formData);
      if (res.success) {
        router.push("/dashboard/my-ads");
      } else {
        setError(res.error || "FAILED TO REGISTER ACCOUNT");
      }
    } catch (err: any) {
      setError(err?.message || "SOMETHING WENT WRONG");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* LOGO CONTAINER - Transparent with No Background */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/signup-logo.png"
              alt="GO RENTAL DHA"
              className="h-16 w-auto object-contain bg-transparent border-0 outline-none shadow-none"
            />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase text-[#171717] tracking-tight">
              CREATE AGENT ACCOUNT
            </h1>
            <p className="text-xs text-stone-500 uppercase tracking-wide mt-1">
              JOIN GO RENTAL DHA TO POST AND MANAGE PROPERTIES
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-black uppercase rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-stone-700 tracking-wider">
              FULL NAME / AGENCY NAME
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="ENTER FULL NAME"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-stone-700 tracking-wider">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="AGENT@EXAMPLE.COM"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Phone / WhatsApp */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-stone-700 tracking-wider">
              CONTACT NUMBER / WHATSAPP
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-stone-700 tracking-wider">
              ACCOUNT TYPE
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "AGENT" })}
                style={{
                  backgroundColor: formData.role === "AGENT" ? "#171717" : "#FBFBF9",
                  color: formData.role === "AGENT" ? "#ffffff" : "#171717",
                }}
                className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                  formData.role === "AGENT"
                    ? "border-[#D4AF37]/50 shadow-sm"
                    : "border-stone-200 text-stone-500"
                }`}
              >
                REAL ESTATE AGENT
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "USER" })}
                style={{
                  backgroundColor: formData.role === "USER" ? "#171717" : "#FBFBF9",
                  color: formData.role === "USER" ? "#ffffff" : "#171717",
                }}
                className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                  formData.role === "USER"
                    ? "border-[#D4AF37]/50 shadow-sm"
                    : "border-stone-200 text-stone-500"
                }`}
              >
                 CLIENT
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#171717", color: "#ffffff" }}
            className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-stone-900 transition-all cursor-pointer disabled:opacity-50 shadow-md mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
            ) : (
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span className="text-white font-black tracking-wider">CREATE ACCOUNT</span>
          </button>
        </form>

        {/* Footer Login Link */}
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs font-bold uppercase text-stone-500">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link
              href="/login"
              className="text-[#657A68] hover:text-[#171717] underline underline-offset-4 transition-colors font-black"
            >
              LOGIN HERE
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}