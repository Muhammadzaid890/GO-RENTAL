"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1F1C] text-stone-300 border-t border-stone-800 mt-auto">
      {/* Top Banner / Trust Strip */}
      <div className="border-b border-stone-800/80 bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold uppercase text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#657A68]" />
            <span>100% VERIFIED DHA KARACHI RENTAL DIRECTORY</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>DIRECT AGENT CONTACT</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>ZERO COMMISSION BROWSING</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Logo & About */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* EXACT /logo.png NAVBAR BRAND */}
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="GO RENTAL DHA"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-tight text-white leading-none">
                  GO RENTAL DHA
                </span>
                <span className="text-[10px] font-bold text-[#657A68] uppercase tracking-widest mt-1">
                  KARACHI VERIFIED DIRECTORY
                </span>
              </div>
            </Link>

            <p className="text-xs font-medium text-stone-400 leading-relaxed uppercase max-w-sm">
              KARACHI'S PREMIER DEDICATED RENTAL PORTAL FOR DHA PHASES 1 TO 8. DISCOVER LUXURY BUNGALOWS, MODERN APARTMENTS, CORPORATE OFFICES, AND COMMERCIAL SPACES WITH DIRECT AGENT ACCESS.
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <a
                href="https://wa.me/923009232409"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#657A68]/20 hover:bg-[#657A68]/30 text-[#657A68] text-xs font-black uppercase tracking-wider border border-[#657A68]/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WHATSAPP SUPPORT</span>
              </a>

              <Link
                href="/post-ad"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#1A1F1C] text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <span>POST FREE AD</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#657A68]" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              PORTAL NAVIGATION
            </h3>
            <ul className="space-y-2 text-xs font-bold uppercase text-stone-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition-colors">
                  ALL PROPERTIES
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="hover:text-white transition-colors">
                  POST RENTAL AD
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: DHA Karachi Phases */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              DHA PHASES
            </h3>
            <ul className="space-y-2 text-xs font-bold uppercase text-stone-400">
              <li>
                <Link href="/properties?phase=PHASE%208" className="hover:text-white transition-colors">
                  DHA PHASE 8
                </Link>
              </li>
              <li>
                <Link href="/properties?phase=PHASE%206" className="hover:text-white transition-colors">
                  DHA PHASE 6
                </Link>
              </li>
              <li>
                <Link href="/properties?phase=PHASE%205" className="hover:text-white transition-colors">
                  DHA PHASE 5
                </Link>
              </li>
              <li>
                <Link href="/properties?phase=PHASE%207" className="hover:text-white transition-colors">
                  DHA PHASE 7
                </Link>
              </li>
              <li>
                <Link href="/properties?phase=PHASE%204" className="hover:text-white transition-colors">
                  DHA PHASE 4 & 2
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              CONTACT & HELPLINE
            </h3>
            
            <div className="space-y-2.5 text-xs font-bold uppercase text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#657A68] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  DHA KARACHI, SINDH, PAKISTAN
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#657A68] shrink-0" />
                <a href="tel:+923009232409" className="hover:text-white transition-colors">
                  +92 300 9232409
                </a>
              </div>

              <div className="flex items-center gap-2.5 lowercase">
                <Mail className="w-4 h-4 text-[#657A68] shrink-0" />
                <a href="mailto:support@gorentaldha.com" className="hover:text-white transition-colors">
                  support@gorentaldha.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-stone-800/80 py-6 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-bold uppercase text-stone-500">
          <div>
            © {new Date().getFullYear()} GO RENTAL DHA. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/properties" className="hover:text-stone-300 transition-colors">
              VERIFIED LISTINGS
            </Link>
            <Link href="/post-ad" className="hover:text-stone-300 transition-colors">
              POST AD
            </Link>
            <span className="text-stone-600">|</span>
            <span className="text-[#657A68]">DESIGNED FOR DHA KARACHI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}