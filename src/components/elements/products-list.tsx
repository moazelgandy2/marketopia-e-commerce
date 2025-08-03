"use client";

import React, { useState, useCallback } from "react";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product-card";
import ProductsSearch from "@/components/elements/products-search";
import Pagination from "@/components/elements/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface ProductsListProps {
  initialSearch?: string;
  initialPage?: number;
  perPage?: number;
}

export default function ProductsList({
  initialSearch = "",
  initialPage = 1,
  perPage = 6,
}: ProductsListProps) {
  const t = useTranslations("ProductsPage");
  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const locale = useLocale();

  const { data, isLoading, error, isFetching } = useProducts(
    search,
    currentPage,
    perPage,
    locale
  );

  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col">
      <Skeleton className="aspect-square w-full rounded-t-2xl" />
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-auto space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <ProductsSearch
          onSearch={handleSearch}
          placeholder={t("search.placeholder")}
          initialValue={search}
        />

        {data && (
          <div className="text-sm text-gray-600">
            {data.total}{" "}
            {data.total === 1 ? t("results.found") : t("results.foundPlural")}{" "}
            {t("results.foundText")}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <div className="text-red-800">
            {error instanceof Error ? error.message : t("error")}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
          {Array.from({ length: perPage }).map((_, index) => (
            <div
              key={index}
              className="h-full"
            >
              <ProductSkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {data && data.data && (
        <>
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
              </div>
            )}

            {data.data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
                {data.data.map((product) => (
                  <div
                    key={product.id}
                    className="h-full"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  {t("noProducts.title")}
                </div>
                {search && (
                  <p className="text-gray-400">{t("noProducts.subtitle")}</p>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data.data.length > 0 && data.last_page > 1 && (
            <Pagination
              currentPage={data.current_page}
              totalPages={data.last_page}
              onPageChange={handlePageChange}
              showingFrom={data.from}
              showingTo={data.to}
              total={data.total}
            />
          )}
        </>
      )}
    </div>
  );
}
