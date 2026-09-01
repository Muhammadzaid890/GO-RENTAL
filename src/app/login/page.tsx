"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/auth";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginUser(email);

    if (res.success) {
      if (res.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard/wallet");
      }
    } else {
      setError(res.error || "LOGIN FAILED.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-[#1A1F1C] mx-auto flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase text-[#1A1F1C]">
            PORTAL LOGIN
          </h1>
          <p className="text-xs text-stone-500 uppercase font-bold">
            LOGIN AS ADMIN, AGENT, OR CLIENT
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-[#1A1F1C] mb-1.5">
              REGISTERED EMAIL
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs font-bold lowercase focus:outline-none focus:border-[#657A68] focus:ring-2 focus:ring-[#657A68]/20 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-white border-2 border-[#1A1F1C] text-[#1A1F1C] hover:bg-[#657A68] hover:border-[#657A68] hover:text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "LOGGING IN..." : "LOGIN TO DASHBOARD"}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500 font-bold">
          NEW CLIENT?{" "}
          <Link href="/signup" className="text-[#657A68] hover:underline uppercase font-black">
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}