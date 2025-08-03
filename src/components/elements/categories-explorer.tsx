"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ParentCategoriesList } from "./parent-categories-list";
import { CategoryWithChildren } from "./category-with-children";

interface CategoriesExplorerProps {
  className?: string;
}

export function CategoriesExplorer({ className }: CategoriesExplorerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const t = useTranslations("CategoriesExplorer");

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleBackToList = () => {
    setSelectedCategoryId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`w-full ${className}`}>
      {selectedCategoryId ? (
        <CategoryWithChildren
          categoryId={selectedCategoryId}
          onBack={handleBackToList}
          className="max-w-4xl mx-auto"
        />
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h2>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
          <ParentCategoriesList
            page={currentPage}
            onPageChange={handlePageChange}
            onCategoryClick={handleCategoryClick}
            showPagination={true}
          />
        </div>
      )}
    </div>
  );
}
