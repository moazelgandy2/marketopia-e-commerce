import { SmartphoneDeals } from "@/components/best-deals";
import { ElectronicsBrands } from "@/components/brands";
import { DailyEssentials } from "@/components/daily-essentials";
import { CategoryNav } from "@/components/elements/categories";
import { Header } from "@/components/elements/header";
import { Footer } from "@/components/footer";
import { HeroBanner } from "@/components/hero";
import { TopCategories } from "@/components/top-categories";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen relative">
      <Header />
      <CategoryNav />
      <HeroBanner />
      <SmartphoneDeals />
      <TopCategories />
      <ElectronicsBrands />
      {/* <DailyEssentials /> */}
      <Footer />
    </div>
  );
}
