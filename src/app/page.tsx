import HomeFeed from "@/components/HomeFeed";
import PremiumRentals from "@/components/PremiumRentals";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Search & Discovery Tabs */}
      <HomeFeed />

      {/* 5 Premium Properties Section */}
      <PremiumRentals />
    </main>
  );
}