"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Settings,
  User,
  ChevronDown,
  Globe,
  Coins,
  Maximize2,
  X,
  Map,
  Layers,
  Users,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { logoutUser } from "@/actions/auth";
import { usePreferences, AreaUnit, Currency, Language } from "@/context/PreferencesContext";

const phases = [
  "PHASE 1", "PHASE 2", "PHASE 2 EXT", "PHASE 4", "PHASE 5",
  "PHASE 5 EXT", "PHASE 6", "PHASE 7", "PHASE 7 EXT", "PHASE 8",
];

export default function Navbar() {
  const [areasOpen, setAreasOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { language, setLanguage, unit, setUnit, currency, setCurrency, t } = usePreferences();

  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    role?: string;
    email?: string;
  } | null>(null);

  const areasDropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/agent/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setCurrentUser(data);
          }
        }
      } catch {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (areasDropdownRef.current && !areasDropdownRef.current.contains(event.target as Node)) {
        setAreasOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setAuthOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 100% Reliable Client-Side Logout Handler
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setAuthOpen(false);
      await logoutUser();
      
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* 1. GLASSMORPHISM HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#FBFBF9]/80 backdrop-blur-xl border-b border-stone-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] supports-[backdrop-filter]:bg-[#FBFBF9]/75 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="GO RENTAL DHA"
              className="h-35 w-auto max-w-[600px] object-contain"
            />
          </Link>

          {/* NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-black uppercase tracking-wider text-stone-900">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl hover:bg-stone-200/40 transition-colors"
            >
              {t("HOME")}
            </Link>

            <Link
              href="/properties"
              className="px-3.5 py-2 rounded-xl hover:bg-stone-200/40 transition-colors"
            >
              {t("PROPERTIES")}
            </Link>

            <Link
              href="/maps"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-stone-200/40 text-stone-700 hover:text-stone-900 transition-colors"
            >
              <Map className="w-4 h-4 text-emerald-600" />
              <span>{t("MAPS")}</span>
            </Link>

            {/* AREAS DROPDOWN */}
            <div className="relative" ref={areasDropdownRef}>
              <button
                type="button"
                onClick={() => setAreasOpen(!areasOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  areasOpen ? "bg-stone-200/50 text-emerald-600" : "hover:bg-stone-200/40 text-stone-700 hover:text-stone-900"
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>{t("AREAS")}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    areasOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {areasOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white/90 backdrop-blur-2xl rounded-2xl border border-stone-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-stone-200/60 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                      DHA KARACHI PHASES
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {phases.map((phase) => (
                      <Link
                        key={phase}
                        href={`/properties?phase=${encodeURIComponent(phase)}`}
                        onClick={() => setAreasOpen(false)}
                        className="px-3 py-2 rounded-lg text-[11px] font-bold text-stone-700 hover:bg-stone-100/80 hover:text-stone-900 transition-all truncate"
                      >
                        {phase}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/agents"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-stone-200/40 text-stone-700 hover:text-stone-900 transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>{t("AGENTS")}</span>
            </Link>
          </nav>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/post-ad"
              style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
              className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-stone-800 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span className="hidden sm:inline">{t("POST_PROPERTY")}</span>
            </Link>

            {/* GEAR ICON */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-xl border border-stone-200/70 bg-white/60 backdrop-blur-md hover:bg-white text-stone-700 hover:text-stone-950 transition-all cursor-pointer shadow-xs"
              title="Preferences & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* USER ICON */}
            <div className="relative" ref={authDropdownRef}>
              <button
                type="button"
                onClick={() => setAuthOpen(!authOpen)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  currentUser
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                    : "border-stone-200/70 bg-white/60 backdrop-blur-md hover:bg-white text-stone-700 hover:text-stone-950"
                }`}
                title={currentUser ? currentUser.name : "Account Login / Register"}
              >
                <User className="w-4 h-4" />
              </button>

              {authOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl border border-stone-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-black uppercase">
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2.5 border-b border-stone-200/60 mb-1">
                        <div className="text-stone-900 truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-stone-400 font-bold">{currentUser.role}</div>
                      </div>

                      <Link
                        href={currentUser.role === "ADMIN" ? "/admin/all-listings" : "/dashboard/my-ads"}
                        onClick={() => setAuthOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>DASHBOARD</span>
                      </Link>

                      {/* Client-Handled Direct Logout */}
                      <button
                        type="button"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50/80 transition-all cursor-pointer text-left disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setAuthOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-stone-700 hover:bg-stone-100/80 hover:text-stone-900 transition-all"
                      >
                        <LogIn className="w-4 h-4 text-emerald-600" />
                        <span>SIGN IN / LOGIN</span>
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setAuthOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-emerald-700 hover:bg-emerald-50/80 transition-all"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-600" />
                        <span>REGISTER ACCOUNT</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. PREFERENCES MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="bg-[#FBFBF9]/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-stone-200/80 relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-stone-900">{t("PREFERENCES")}</h3>
                  <p className="text-[11px] text-stone-400 font-bold uppercase">CUSTOMIZE YOUR VIEWING EXPERIENCE</p>
                </div>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold uppercase">
              {/* Language */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/60 shadow-2xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>LANGUAGE</span>
                </div>
                <div className="flex bg-stone-200/50 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLanguage("EN")}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      language === "EN" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    ENGLISH
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("UR")}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      language === "UR" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {/* Area Unit */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/60 shadow-2xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Maximize2 className="w-4 h-4 text-stone-500" />
                  <span>AREA UNIT</span>
                </div>
                <div className="flex bg-stone-200/50 p-1 rounded-xl">
                  {(["Sq. Yards", "Marla", "Sq. Ft"] as AreaUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        unit === u ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/60 shadow-2xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>CURRENCY</span>
                </div>
                <div className="flex bg-stone-200/50 p-1 rounded-xl">
                  {(["PKR", "USD", "AED"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        currency === c ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md transition-all"
            >
              {t("SAVE_PREFERENCES")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}