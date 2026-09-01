import Link from "next/link";
import { Users, Sparkles, ArrowLeft, ShieldCheck, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AgentsPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm text-center space-y-6">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#657A68]/15 border border-[#657A68]/20 text-[#657A68] text-[10px] font-black uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" />
          <span>UNDER DEVELOPMENT</span>
        </div>

        {/* Icon Container */}
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-[#FBFBF9] border border-stone-200 flex items-center justify-center text-[#657A68]">
          <Users className="w-10 h-10" />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#657A68] text-white flex items-center justify-center">
          
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#1A1F1C] tracking-tight">
            VERIFIED AGENTS DIRECTORY
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase text-stone-500 max-w-md mx-auto leading-relaxed">
            WE ARE BUILDING A DEDICATED DIRECTORY FOR TOP-RATED & VERIFIED DHA KARACHI REAL ESTATE AGENTS.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-stone-200/80 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#657A68] shrink-0" />
            <span className="text-[11px] font-black uppercase text-[#1A1F1C]">
              100% DHA VERIFIED PROFILES
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-stone-200/80 flex items-center gap-3">
           
            <span className="text-[11px] font-black uppercase text-[#1A1F1C]">
              DIRECT WHATSAPP & CALLS
            </span>
          </div>
        </div>

        {/* Back Action */}
        <div className="pt-4 border-t border-stone-100">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#1A1F1C] hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

      </div>
    </div>
  );
}