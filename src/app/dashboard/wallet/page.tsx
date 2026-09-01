import { prisma } from "@/lib/prisma";
import { Wallet, Sparkles, PlusCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function UserWalletPage() {
  // Demo user data fetch (for production, replace with auth session)
  const user = await prisma.user.findUnique({
    where: { email: "user@gorentaldha.com" },
    include: {
      wallet: true,
      properties: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-bold uppercase text-stone-500">USER NOT FOUND.</p>
      </div>
    );
  }

  const now = new Date();

  // Boost action trigger form
  async function handleBoostAction(formData: FormData) {
    "use server";
    const propertyId = formData.get("propertyId") as string;
    const { boostRentalAd } = await import("@/actions/property");
    await boostRentalAd(propertyId, "user@gorentaldha.com");
  }

  return (
    <div className="space-y-8">
      {/* Wallet Credit Summary Card */}
      <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                USER ACCOUNT
              </span>
              <h1 className="text-2xl font-black uppercase text-dark">
                {user.name}
              </h1>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FBFBF9] border border-stone-200/80 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                REGULAR ADS
              </span>
              <span className="text-2xl font-black text-dark">
                {user.wallet?.adCredits ?? 0}
              </span>
            </div>

            <div className="bg-sage/10 border border-sage/20 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                BOOST CREDITS
              </span>
              <span className="text-2xl font-black text-sage">
                {user.wallet?.boostCredits ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posted Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-dark">
            MY POSTED PROPERTIES
          </h2>
          <Link
            href="/post-ad"
            className="flex items-center gap-1.5 text-xs font-bold text-sage hover:text-sage-dark uppercase tracking-wide"
          >
            <PlusCircle className="w-4 h-4" />
            <span>POST NEW AD</span>
          </Link>
        </div>

        {user.properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-xs font-bold uppercase">
              YOU HAVE NOT POSTED ANY ADS YET.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.properties.map((ad) => {
              const isBoostActive =
                ad.isBoosted &&
                ad.boostExpiresAt &&
                new Date(ad.boostExpiresAt) > now;

              return (
                <div
                  key={ad.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs hover:border-stone-300 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-20 bg-stone-100 rounded-xl overflow-hidden shrink-0">
                      {ad.images.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 font-bold uppercase">
                          NO PHOTO
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-dark">
                          PKR {Number(ad.rentPrice).toLocaleString()} / MO
                        </span>
                        <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md uppercase">
                          {ad.propertyType}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold uppercase text-dark line-clamp-1">
                        {ad.title}
                      </h3>
                      <p className="text-xs text-stone-500 uppercase">
                        {ad.phase}, DHA KARACHI
                      </p>
                    </div>
                  </div>

                  {/* Boost Status & Trigger Button */}
                  <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 justify-between md:justify-end">
                    {isBoostActive ? (
                      <div className="flex items-center gap-2 bg-sage/10 text-sage border border-sage/30 px-3.5 py-2 rounded-xl text-xs font-bold uppercase">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          ACTIVE UNTIL{" "}
                          {ad.boostExpiresAt
                            ? new Date(ad.boostExpiresAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <form action={handleBoostAction}>
                        <input type="hidden" name="propertyId" value={ad.id} />
                        <button
                          type="submit"
                          disabled={(user.wallet?.boostCredits ?? 0) < 1}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-dark hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          <Zap className="w-3.5 h-3.5 text-sage" />
                          <span>BOOST AD (5 DAYS)</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}