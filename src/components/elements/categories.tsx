"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState("Groceries");

  const categories = [
    "Groceries",
    "Premium Fruits",
    "Home & Kitchen",
    "Fashion",
    "Electronics",
    "Beauty",
    "Home Improvement",
    "Sports, Toys & Luggage",
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100/50">
      <div className="mx-auto px-6 py-4 flex justify-center">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2.5 bg-[#F3F9FB] rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-[#660DC2] to-[#D2087F] text-white shadow-lg shadow-purple-500/25"
                  : " hover:bg-gray-300"
              }`}
            >
              {category}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
