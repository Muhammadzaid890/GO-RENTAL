import { prisma } from "@/lib/prisma";
import { Building2, Users, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalListings, totalAgents, totalClients, boostedListings] =
    await Promise.all([
      prisma.property.count(),
      prisma.user.count({ where: { role: "AGENT" as any } }),
      prisma.user.count({ where: { role: "CLIENT" as any } }),
      prisma.property.count({ where: { isBoosted: true } }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase text-dark">
          ADMIN CONTROL DASHBOARD
        </h1>
        <p className="text-xs text-stone-500 uppercase mt-0.5">
          GO RENTAL DHA OVERVIEW & SYSTEM METRICS
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL LISTINGS</span>
            <Building2 className="w-5 h-5 text-sage" />
          </div>
          <span className="text-3xl font-black text-dark mt-2 block">{totalListings}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">REGISTERED AGENTS</span>
            <Users className="w-5 h-5 text-sage" />
          </div>
          <span className="text-3xl font-black text-dark mt-2 block">{totalAgents}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">CLIENTS (PORTAL)</span>
            <Users className="w-5 h-5 text-stone-600" />
          </div>
          <span className="text-3xl font-black text-dark mt-2 block">{totalClients}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">BOOSTED ADS</span>
            <Sparkles className="w-5 h-5 text-sage" />
          </div>
          <span className="text-3xl font-black text-dark mt-2 block">{boostedListings}</span>
        </div>
      </div>
    </div>
  );
}