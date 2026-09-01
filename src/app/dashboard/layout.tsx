import { getSessionUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ListOrdered,
  Wallet,
  ShoppingBag,
  PlusCircle,
  Settings,
  ShieldAlert,
  Home,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  // Real-time user fetch for Wallet and Ban Status
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { wallet: true },
  });

  if (!user) {
    redirect("/login");
  }

  const isBanned = user.isBanned;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Ban Warning Banner */}
      {isBanned && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-sm font-black uppercase">ACCOUNT SUSPENDED / BANNED</h3>
              <p className="text-xs opacity-90 uppercase">
                YOUR ACCOUNT HAS BEEN RESTRICTED BY ADMIN. YOU CAN ONLY VIEW ALL ADS.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Navigation */}
        <aside className="md:col-span-1 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-6 md:sticky md:top-24">
          {/* User Profile Info */}
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage/10 text-sage font-black flex items-center justify-center text-sm uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="font-black text-xs text-dark uppercase truncate">{user.name}</div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">{user.role}</div>
              </div>
            </div>

            {/* Quick Wallet Info */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-center">
              <div className="bg-[#FBFBF9] p-2 rounded-xl border border-stone-200/60">
                <span className="text-xs font-black text-dark block">{user.wallet?.adCredits ?? 0}</span>
                <span className="text-[9px] text-stone-400 font-bold uppercase">AD CREDITS</span>
              </div>
              <div className="bg-[#FBFBF9] p-2 rounded-xl border border-stone-200/60">
                <span className="text-xs font-black text-sage block">{user.wallet?.boostCredits ?? 0}</span>
                <span className="text-[9px] text-stone-400 font-bold uppercase">BOOSTS</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold uppercase">
            {/* 1. All Ads (Feed) */}
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-dark transition-all"
            >
              <Home className="w-4 h-4 text-stone-400" />
              <span>ALL ADS</span>
            </Link>

            {/* 2. My Ads */}
            <Link
              href={isBanned ? "#" : "/dashboard/my-ads"}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isBanned
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-50 hover:text-dark"
              }`}
            >
              <ListOrdered className="w-4 h-4 text-stone-400" />
              <span>MY ADS</span>
            </Link>

            {/* 3. My Wallet */}
            <Link
              href={isBanned ? "#" : "/dashboard/wallet"}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isBanned
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-50 hover:text-dark"
              }`}
            >
              <Wallet className="w-4 h-4 text-sage" />
              <span>MY WALLET</span>
            </Link>

            {/* 4. Shop */}
            <Link
              href={isBanned ? "#" : "/dashboard/shop"}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isBanned
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-50 hover:text-dark"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-stone-400" />
              <span>SHOP</span>
            </Link>

            {/* 5. Post Listing */}
            <Link
              href={isBanned ? "#" : "/post-ad"}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isBanned
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-sage hover:bg-sage/10 font-black"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-sage" />
              <span>POST LISTING</span>
            </Link>

            {/* 6. Settings */}
            <Link
              href={isBanned ? "#" : "/dashboard/settings"}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isBanned
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-50 hover:text-dark"
              }`}
            >
              <Settings className="w-4 h-4 text-stone-400" />
              <span>SETTINGS</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-3">
          {isBanned ? (
            <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-lg font-black uppercase text-dark">ACCESS RESTRICTED</h2>
              <p className="text-xs text-stone-500 uppercase max-w-md mx-auto">
                YOU CANNOT POST ADS, MANAGE WALLET OR ACCESS SETTINGS WHILE YOUR ACCOUNT IS SUSPENDED.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2.5 bg-dark text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                VIEW HOMEPAGE LISTINGS
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}