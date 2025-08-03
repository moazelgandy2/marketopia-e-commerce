import { SmartphoneDeals } from "@/components/best-deals";
import { ElectronicsBrands } from "@/components/brands";

import { CategoryNav } from "@/components/elements/categories";

import { HeroBanner } from "@/components/hero";
import { TopCategories } from "@/components/top-categories";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen relative">
      <CategoryNav />
      <HeroBanner />
      <SmartphoneDeals />
      <TopCategories />
      <ElectronicsBrands />
    </div>
  );
}
