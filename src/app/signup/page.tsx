"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupClient } from "@/actions/auth";
import Link from "next/link";
import { UserCheck, Shield, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signupClient(formData);

    if (res.success) {
      router.push("/dashboard/wallet");
    } else {
      setError(res.error || "FAILED TO SIGN UP.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage mx-auto flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase text-dark">
            CLIENT SIGNUP
          </h1>
          <p className="text-xs text-stone-500 uppercase">
            SIGN UP AND GET 3 FREE RENTAL AD CREDITS
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1.5">
              FULL NAME
            </label>
            <input
              type="text"
              required
              placeholder="E.G. ALI AHMED"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-bold uppercase focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="ali@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-bold lowercase focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1.5">
              WHATSAPP / PHONE NUMBER
            </label>
            <input
              type="tel"
              required
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-bold focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-sage hover:bg-sage-dark text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP AS CLIENT"}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link href="/login" className="font-bold text-sage hover:underline uppercase">
            LOG IN HERE
          </Link>
        </div>
      </div>
    </div>
  );
}