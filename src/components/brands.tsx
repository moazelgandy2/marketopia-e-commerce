"use client";

import { useState, useCallback, useEffect } from "react";
import { useBrands } from "@/hooks/use-brands";
import { Brand } from "@/types";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

export const ElectronicsBrands = () => {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { data: brands, isLoading, error } = useBrands();

  const handleBrandClick = (index: number, brand: Brand) => {
    setSelectedBrand(selectedBrand === index ? null : index);
    console.log(`Selected brand: ${brand.name} (ID: ${brand.id})`);
  };

  // Update carousel state when api changes
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Top <span className="text-purple-600">Electronics Brands</span>
            </h2>
            <div className="w-16 md:w-24 h-1 bg-purple-600 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-6 md:p-8 animate-pulse h-32 md:h-40 flex items-center justify-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center text-red-600">
          <p>Failed to load brands. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center text-gray-600">
          <p>No brands available.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Top <span className="text-purple-600">Electronics Brands</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-purple-600 rounded"></div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 text-sm md:text-base">
          View All
          <span>→</span>
        </button>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1 gap-2 py-4">
          {brands.map((brand, index) => (
            <CarouselItem
              key={brand.id}
              className="pl-1  basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div
                className={`bg-white border-2 border-gray-200 hover:border-purple-300 rounded-xl p-4 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg h-32 ${
                  selectedBrand === index
                    ? "ring-4 ring-purple-400 border-purple-400"
                    : ""
                }`}
                onClick={() => handleBrandClick(index, brand)}
              >
                <div className="flex items-center justify-center h-full">
                  {/* Brand Image */}
                  <div className="w-16 h-16 relative group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${brand.image}`}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to brand name if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-800 font-bold text-sm text-center">${brand.name}</div>`;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Brand Name Overlay */}
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-xs font-semibold text-gray-800 text-center truncate">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12 h-8 w-8" />
        <CarouselNext className="-right-12 h-8 w-8" />
      </Carousel>

      {/* Pagination dots - Show current slide indicator */}
      {count > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === current
                  ? "bg-purple-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
