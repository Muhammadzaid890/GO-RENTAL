"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSessionUser } from "@/actions/auth";
import {
  LayoutDashboard,
  Building2,
  ListFilter,
  Users,
  Wallet,
  PlusCircle,
  Inbox,
  Settings,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
  Flame,
} from "lucide-react";

const navItems = [
  { label: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { label: "ALL LISTINGS", href: "/admin/all-listings", icon: Building2 },
  { label: "MY LISTINGS", href: "/admin/my-listings", icon: ListFilter },
  { label: "AGENTS & USERS", href: "/admin/agents", icon: Users },
  { label: "ADMIN WALLET", href: "/admin/wallet", icon: Wallet },
  { label: "POST LISTING", href: "/post-ad", icon: PlusCircle },
  { label: "INBOX", href: "/admin/inbox", icon: Inbox },
  { label: "SETTINGS", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadSession() {
      const user = await getSessionUser();
      setCurrentUser(user);
    }
    loadSession();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col md:flex-row">
      
      {/* 1. MOBILE TOP BAR */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-[#1A1F1C]">
            ADMIN PORTAL
          </span>
        </div>

        <Link
          href="/"
          className="text-[10px] font-black uppercase text-[#657A68] hover:underline"
        >
          VISIT SITE
        </Link>
      </div>

      {/* 2. SIDEBAR (DESKTOP FIXED + MOBILE SLIDE-OVER) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-[#E53935] flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase text-[#1A1F1C] tracking-tight">
                  ADMIN CONTROL
                </h2>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                  GO RENTAL DHA
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#1A1F1C] text-white shadow-sm"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#657A68]" : "text-stone-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-100 space-y-3 bg-[#FBFBF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center font-black text-xs uppercase">
              {currentUser?.name ? currentUser.name.charAt(0) : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black uppercase text-[#1A1F1C] truncate">
                {currentUser?.name || "SUPER ADMIN"}
              </div>
              <div className="text-[9px] font-bold text-[#E53935] uppercase">
                ADMIN PRIVILEGES
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full py-2 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>EXIT TO WEBSITE</span>
          </Link>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>

    </div>
  );
}