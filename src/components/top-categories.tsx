"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const TopCategories = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const { data: categories, isLoading, error } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleCategoryClick = (index: number, category: Category) => {
    setActiveCategory(index);
    router.push(`/categories/${category.id}`);
    console.log(`Selected category: ${category.name} (ID: ${category.id})`);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Shop From <span className="text-purple-600">Top Categories</span>
            </h2>
            <div className="w-16 md:w-24 h-1 bg-purple-600 rounded"></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="text-center flex-shrink-0"
            >
              <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-16 md:w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
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
          <p>Failed to load categories. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center text-gray-600">
          <p>No categories available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Shop From <span className="text-purple-600">Top Categories</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-purple-600 rounded"></div>
        </div>
        <Link href={"/categories"}>
          <Button
            variant={"outline"}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 text-sm md:text-base"
          >
            View All
            <span>→</span>
          </Button>
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 hidden md:flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 hidden md:flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable Categories Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-2 md:px-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group cursor-pointer text-center transition-all duration-300 flex-shrink-0 ${
                activeCategory === index
                  ? "transform scale-110"
                  : "hover:transform hover:scale-105"
              }`}
              onClick={() => handleCategoryClick(index, category)}
            >
              <div
                className={`w-28 h-28 md:w-36 md:h-36 mx-auto mb-2 md:mb-4 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                  activeCategory === index
                    ? "bg-purple-600 text-white shadow-lg ring-4 ring-purple-200"
                    : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
                }`}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${category.image}`}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDEzVjE3TTEyIDEzSDhNMTIgMTNIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+";
                  }}
                />
              </div>
              <h3
                className={`font-medium transition-colors duration-300 text-xs md:text-sm max-w-[80px] mx-auto leading-tight ${
                  activeCategory === index
                    ? "text-purple-600"
                    : "text-gray-700 group-hover:text-purple-600"
                }`}
              >
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
