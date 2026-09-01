import { MapPin, Navigation, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const phases = [
  "PHASE 1", "PHASE 2", "PHASE 2 EXT", "PHASE 4", "PHASE 5",
  "PHASE 5 EXT", "PHASE 6", "PHASE 7", "PHASE 7 EXT", "PHASE 8"
];

export default function MapsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-dark flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sage" />
            <span>DHA KARACHI SECTOR MAP</span>
          </h1>
          <p className="text-xs text-stone-500 uppercase mt-0.5">
            EXPLORE ALL PHASES (PHASE 1 TO PHASE 8) WITH SATELLITE NAVIGATION
          </p>
        </div>

        {/* Phase Badges */}
        <div className="flex flex-wrap gap-1.5">
          {phases.slice(0, 5).map((p) => (
            <Link
              key={p}
              href={`/?phase=${encodeURIComponent(p)}`}
              className="px-3 py-1.5 bg-white border border-stone-200 hover:border-sage rounded-xl text-[10px] font-black uppercase text-dark transition-all"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      {/* Live Map Frame */}
      <div className="w-full h-[650px] rounded-3xl overflow-hidden border border-stone-200 shadow-md relative bg-stone-100">
        <iframe
          title="DHA Karachi Interactive Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57962.7758364205!2d67.04505312015243!3d24.796349580436853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33cf1cb821817%3A0xbca1e8f66858e727!2sDefence%20Housing%20Authority%2C%20Karachi%2C%20Sindh!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
        />
      </div>
    </div>
  );
}