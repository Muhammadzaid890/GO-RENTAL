"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ListOrdered,
  Users,
  Wallet,
  PlusSquare,
  Inbox,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { label: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { label: "ALL LISTINGS", href: "/admin/all-listings", icon: Building2 },
  { label: "MY LISTINGS", href: "/admin/my-listings", icon: ListOrdered },
  { label: "AGENTS", href: "/admin/agents", icon: Users },
  { label: "ADMIN WALLET", href: "/admin/admin-wallet", icon: Wallet },
  { label: "POST LISTING", href: "/admin/post-listing", icon: PlusSquare },
  { label: "INBOX", href: "/admin/inbox", icon: Inbox },
  { label: "SETTINGS", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between shrink-0 shadow-xs">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="px-3.5 py-3 bg-sage/10 border border-sage/20 rounded-xl flex items-center gap-2.5 text-sage">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wider uppercase leading-none">
              ADMIN PORTAL
            </span>
            <span className="text-[10px] text-stone-500 font-bold uppercase mt-0.5">
              GO RENTAL DHA
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-sage text-white shadow-xs font-black"
                    : "text-stone-600 hover:bg-[#FBFBF9] hover:text-dark"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Session Badge */}
      <div className="p-3.5 bg-[#FBFBF9] rounded-xl border border-stone-200/80 text-center">
        <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest block">
          LOGGED IN AS
        </span>
        <span className="text-xs font-black text-dark uppercase block truncate mt-0.5">
          ADMIN@GORENTALDHA.COM
        </span>
      </div>
    </aside>
  );
}