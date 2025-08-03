"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const essentials = [
  {
    name: "Daily Essentials",
    discount: "UP to 50% OFF",
    image: "🛍️",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  {
    name: "Vegetables",
    discount: "UP to 50% OFF",
    image: "🥬",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    name: "Fruits",
    discount: "UP to 50% OFF",
    image: "🍎",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    name: "Strawberry",
    discount: "UP to 50% OFF",
    image: "🍓",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  {
    name: "Mango",
    discount: "UP to 50% OFF",
    image: "🥭",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  {
    name: "Cherry",
    discount: "UP to 50% OFF",
    image: "🍒",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
  },
];

export const DailyEssentials = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const t = useTranslations("HomePage.dailyEssentials");

  const handleItemClick = (index: number) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    console.log(`Selected essential: ${essentials[index].name}`);
  };

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            {t("title.part1")}{" "}
            <span className="text-purple-600">{t("title.part2")}</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-purple-600 rounded"></div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 text-sm md:text-base">
          {t("viewAll")}
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
        {essentials.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} ${
              selectedItems.includes(index)
                ? "ring-2 ring-purple-500"
                : item.borderColor
            } border-2 rounded-xl p-3 md:p-6 text-center group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
            onClick={() => handleItemClick(index)}
          >
            <div className="text-3xl md:text-6xl mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300">
              {item.image}
            </div>
            <h3
              className={`font-semibold mb-1 md:mb-2 transition-colors text-xs md:text-base ${
                selectedItems.includes(index)
                  ? "text-purple-600"
                  : "text-gray-800 group-hover:text-purple-600"
              }`}
            >
              {item.name}
            </h3>
            <p className="text-xs md:text-sm font-medium text-green-600">
              {item.discount}
            </p>
          </div>
        ))}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-purple-50 rounded-lg">
          <p className="text-purple-700 font-medium text-sm md:text-base">
            {t("selectedItems")}:{" "}
            {selectedItems.map((i) => essentials[i].name).join(", ")}
          </p>
        </div>
      )}
    </section>
  );
};
