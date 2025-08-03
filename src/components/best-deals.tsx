"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBestSelling } from "@/hooks/use-best-selling";
import { BestSelling } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export const SmartphoneDeals = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const { data: products, isLoading, error } = useBestSelling();
  const t = useTranslations("HomePage.bestDeals");

  const handleProductClick = (index: number, product: BestSelling) => {
    setSelectedProduct(selectedProduct === index ? null : index);
    console.log(`Selected product: ${product.name} (ID: ${product.id})`);
  };

  // Helper function to calculate discount percentage
  const calculateDiscountPercentage = (
    originalPrice: number,
    discountPrice: number | null
  ) => {
    if (!discountPrice) return null;
    const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  // Helper function to calculate savings
  const calculateSavings = (
    originalPrice: number,
    discountPrice: number | null
  ) => {
    if (!discountPrice) return null;
    return originalPrice - discountPrice;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
              {t("subtitle")}{" "}
              <span className="text-purple-600">{t("title")}</span>
            </h2>
            <div className="w-12 md:w-16 h-1 bg-purple-600 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-full flex flex-col"
            >
              <div className="h-28 md:h-32 bg-gray-200"></div>
              <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
                <div className="h-8 md:h-10 mb-2">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="space-y-0.5">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center text-red-600">
          <p>{t("failedToLoad")}</p>
        </div>
      </section>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center text-gray-600">
          <p>{t("noDeals")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
            {t("subtitle")}{" "}
            <span className="text-purple-600">{t("title")}</span>
          </h2>
          <div className="w-12 md:w-16 h-1 bg-purple-600 rounded"></div>
        </div>
        <Link href={"/products"}>
          <Button
            variant={"outline"}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 text-sm"
          >
            {t("viewAll")}
            <span>→</span>
          </Button>
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="px-2 md:px-4">
          <CarouselContent className="-ml-1 md:-ml-2">
            {products.map((product, index) => {
              const discountPercentage = calculateDiscountPercentage(
                product.price,
                product.discount_price
              );
              const savings = calculateSavings(
                product.price,
                product.discount_price
              );

              return (
                <CarouselItem
                  key={product.id}
                  className="pl-1 md:pl-2 py-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <Link
                    href={`/products/${product.id}`}
                    passHref
                  >
                    <div
                      className={`bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col mx-1 ${
                        selectedProduct === index
                          ? "ring-2 ring-purple-500"
                          : ""
                      }`}
                      onClick={() => handleProductClick(index, product)}
                    >
                      <div className="relative">
                        {discountPercentage && (
                          <Badge className="absolute top-1 md:top-2 left-1 md:left-2 z-10 bg-red-500 hover:bg-red-600 text-xs font-semibold px-1 py-0">
                            -{discountPercentage}%
                          </Badge>
                        )}
                        <div className="h-28 md:h-32 relative bg-gray-50 overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${product.image}`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to gradient background if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = `h-28 md:h-32 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center`;
                                parent.innerHTML = `<div class="text-white text-xs font-medium text-center p-1">${product.name}</div>`;
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Card Content - Compact */}
                      <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
                        {/* Product Name - Compact */}
                        <div className="h-8 md:h-10 mb-2">
                          <h3 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors text-xs md:text-sm leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating Section - Compact */}
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(product.rate)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.total_sold})
                          </span>
                        </div>

                        {/* Pricing Section - Compact */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-sm md:text-base font-bold text-gray-900">
                              {product.discount_price
                                ? product.discount_price.toLocaleString()
                                : product.price.toLocaleString()}{" "}
                              <span className="text-xs font-normal text-gray-600">
                                EGP
                              </span>
                            </span>
                            {product.discount_price && (
                              <span className="text-xs text-gray-500 line-through">
                                {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {savings && (
                            <p className="text-green-600 text-xs font-medium">
                              {t("save")} {savings.toLocaleString()} EGP
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
        <CarouselPrevious className="left-2 md:left-4" />
        <CarouselNext className="right-2 md:right-4" />
      </Carousel>
    </section>
  );
};
