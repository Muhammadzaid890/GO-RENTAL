import { prisma } from "@/lib/prisma";
import { Wallet, Zap, Sparkles, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getSessionUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserWalletPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.id || "" },
        { email: session.email?.toLowerCase() || "" },
      ],
    },
    include: {
      wallet: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.wallet) {
    const newWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        adCredits: 5,
        boostCredits: 2,
      },
    });
    user = { ...user, wallet: newWallet };
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Account Overview Header */}
      <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                AGENT WALLET
              </span>
              <h1 className="text-2xl font-black uppercase text-dark">
                {user.name || "MY CREDITS"}
              </h1>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
          </div>

          <Link
            href="/dashboard/shop"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-dark hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>RECHARGE CREDITS</span>
            <ArrowUpRight className="w-4 h-4 text-sage" />
          </Link>
        </div>
      </div>

      {/* Credit Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Regular Ad Credits */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
              REGULAR ADS
            </span>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-dark tracking-tight">
              {user.wallet?.adCredits ?? 0}
            </span>
            <p className="text-[11px] text-stone-400 font-medium uppercase mt-1">
              STANDARD PROPERTY LISTINGS
            </p>
          </div>
        </div>

        {/* Boost Credits */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-sage tracking-wider">
              BOOST CREDITS
            </span>
            <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-sage tracking-tight">
              {user.wallet?.boostCredits ?? 0}
            </span>
            <p className="text-[11px] text-stone-400 font-medium uppercase mt-1">
              7-DAY TOP SEARCH HIGHLIGHTS
            </p>
          </div>
        </div>

        {/* Premium Credits */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-500 tracking-wider">
              PREMIUM CREDITS
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-dark tracking-tight">
              {user.role === "ADMIN" ? "VIP" : 0}
            </span>
            <p className="text-[11px] text-stone-400 font-medium uppercase mt-1">
              {user.role === "ADMIN" ? "UNLIMITED HOMEPAGE SLOTS" : "HOMEPAGE VIP BADGE ADS"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}