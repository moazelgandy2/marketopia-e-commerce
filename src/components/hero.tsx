"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useBanners } from "@/hooks/use-banners";

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: banners, isLoading, error } = useBanners();
  const t = useTranslations("HomePage.hero");

  const nextSlide = () => {
    if (banners && banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners && banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="relative">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="relative bg-gray-200 rounded-xl md:rounded-2xl overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
              </div>
              <div className="w-48 h-48 md:w-80 md:h-80 bg-gray-300 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="relative bg-red-100 rounded-xl md:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-center p-6 md:p-12">
              <p className="text-red-600">{t("failedToLoad")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <section className="relative">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="relative bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-center p-6 md:p-12">
              <p className="text-gray-600">{t("noBanners")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
          <div className="relative w-full h-48 md:h-96">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${currentBanner.image}`}
              alt={currentBanner.name}
              fill
              className="object-fit w-full h-full"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/hero-1.png";
              }}
            />

            {currentBanner.link && (
              <a
                href={currentBanner.link}
                className="absolute inset-0 z-10 block"
                aria-label={t("goTo", { name: currentBanner.name })}
              />
            )}
          </div>

          {banners.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full w-8 h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 rounded-full w-8 h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </Button>
            </>
          )}

          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
