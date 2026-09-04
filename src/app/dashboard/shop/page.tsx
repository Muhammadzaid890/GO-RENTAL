"use client";

import { useState } from "react";
import { sendBundleInquiry } from "@/actions/message";
import { ShoppingBag, Send, Check, Loader2, CheckCircle, MessageCircle } from "lucide-react";

// Admin WhatsApp Number
const ADMIN_WHATSAPP = "923162802558";

const bundles = [
  {
    id: "starter",
    name: "STARTER PACKAGE",
    price: "PKR 3,000",
    adCredits: 5,
    boostCredits: 1,
    features: [
      "5 Regular 14-Day Ads",
      "1 Top 5-Day Priority Boost",
      "Direct Admin Inbox Processing",
      "24/7 Listing Visibility",
    ],
    badge: "POPULAR",
  },
  {
    id: "growth",
    name: "GROWTH AGENCY BUNDLE",
    price: "PKR 7,500",
    adCredits: 15,
    boostCredits: 5,
    features: [
      "15 Regular 14-Day Ads",
      "5 Top 5-Day Priority Boosts",
      "Direct Admin Inbox Processing",
      "Priority Agent Badge Support",
    ],
    badge: "BEST VALUE",
  },
  {
    id: "mega",
    name: "MEGA ESTATE BUNDLE",
    price: "PKR 15,000",
    adCredits: 40,
    boostCredits: 15,
    features: [
      "40 Regular 14-Day Ads",
      "15 Top 5-Day Priority Boosts",
      "Dedicated Admin Support",
      "Maximum Brand Exposure",
    ],
    badge: "ENTERPRISE",
  },
];

export default function AgentShopPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  const handleOrder = async (pkg: (typeof bundles)[0]) => {
    setLoadingId(pkg.id);
    const res = await sendBundleInquiry({
      name: pkg.name,
      price: pkg.price,
      adCredits: pkg.adCredits,
      boostCredits: pkg.boostCredits,
    });

    setLoadingId(null);
    if (res.success) {
      setSentId(pkg.id);
      setTimeout(() => setSentId(null), 5000);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 lg:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-dark tracking-tight">
          CREDIT SHOP & PACKAGES
        </h1>
        <p className="text-[11px] sm:text-xs text-stone-500 uppercase mt-1">
          REQUEST RENTAL ADS & BOOST CREDITS DIRECTLY TO ADMIN INBOX OR VIA WHATSAPP
        </p>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {bundles.map((pkg) => {
          const whatsappText = encodeURIComponent(
            `Assalam o Alaikum Admin, I want to purchase the "${pkg.name}" (${pkg.price}) for GO RENTAL DHA.`
          );
          const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappText}`;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-sage/10 text-sage rounded-full">
                    {pkg.badge}
                  </span>
                  <ShoppingBag className="w-4 h-4 text-stone-400" />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase text-dark">
                    {pkg.name}
                  </h3>
                  <div className="text-xl sm:text-2xl font-black text-dark mt-1.5 tracking-tight">
                    {pkg.price}
                  </div>
                </div>

                {/* Credits Pill */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#FBFBF9] border border-stone-200/80 rounded-2xl text-center">
                  <div>
                    <span className="text-sm font-black text-dark block">
                      {pkg.adCredits}
                    </span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase">
                      AD CREDITS
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-black text-sage block">
                      {pkg.boostCredits}
                    </span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase">
                      BOOSTS (5 DAYS)
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-2 pt-1 text-xs text-stone-600 font-medium">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-sage shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-stone-100 space-y-2.5">
                {/* 1. Request to Inbox Button */}
                {sentId === pkg.id ? (
                  <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>REQUEST SENT TO ADMIN!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={loadingId === pkg.id}
                    onClick={() => handleOrder(pkg)}
                    className="w-full py-3 bg-dark hover:bg-stone-800 !text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingId === pkg.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                    ) : (
                      <Send className="w-4 h-4 text-white shrink-0" />
                    )}
                    <span className="!text-white font-black">REQUEST TO ADMIN INBOX</span>
                  </button>
                )}

                {/* 2. Direct WhatsApp Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 !text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="!text-white font-black">CHAT WITH ADMIN (WHATSAPP)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}