"use client";

import { useCategoryWithChildren } from "@/hooks/use-categories";
import { useState, useMemo, useEffect } from "react";

import { useProductsByCategory } from "@/hooks/use-products";

import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  ArrowRight,
  Home,
  Package,
  AlertCircle,
  HeadphonesIcon,
  Grid2X2,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface CategoryProductsProps {
  categoryId: number;
}

export default function CategoryProducts({
  categoryId,
}: CategoryProductsProps) {
  const t = useTranslations("CategoryPage");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState<"price" | "name" | "newest">("newest");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, _] = useState<[number, number]>([0, 10000]);
  const locale = useLocale();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMessage,
  } = useProductsByCategory(categoryId, page, locale);

  const { data: categoryData, isLoading: categoryLoading } =
    useCategoryWithChildren(categoryId);

  const filteredAndSortedProducts = useMemo(() => {
    if (!productsData?.data) return [];

    let filtered = productsData.data.filter((product: Product) => {
      const price = product.discount_price
        ? parseFloat(product.discount_price)
        : parseFloat(product.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesPrice;
    });

    // Sorting
    return filtered.sort((a: Product, b: Product) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          const priceA = a.discount_price
            ? parseFloat(a.discount_price)
            : parseFloat(a.price);
          const priceB = b.discount_price
            ? parseFloat(b.discount_price)
            : parseFloat(b.price);
          comparison = priceA - priceB;
          break;
        case "newest":
        default:
          // Assuming products with higher IDs are newer
          comparison = b.id - a.id;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [productsData?.data, sortBy, sortOrder, priceRange]);

  const isLoading = productsLoading || categoryLoading;
  const hasProducts =
    filteredAndSortedProducts && filteredAndSortedProducts.length > 0;

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square w-full rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  // Breadcrumb component
  const Breadcrumb = () => (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link
        href="/"
        className="hover:text-primary transition-colors flex items-center"
      >
        <Home className="w-4 h-4 mr-1" />
        {t("home")}
      </Link>
      <ArrowRight className="w-4 h-4" />
      <Link
        href="/categories"
        className="hover:text-primary transition-colors"
      >
        {t("breadcrumb")}
      </Link>
      {categoryData && (
        <>
          <ArrowRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{categoryData.name}</span>
        </>
      )}
    </nav>
  );

  // Category header component
  const CategoryHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryData?.name || "Products"}
          </h1>
          {productsData?.data && (
            <div className="text-gray-600">
              {filteredAndSortedProducts.length !== productsData.data.length ? (
                <p>
                  Showing {filteredAndSortedProducts.length} of{" "}
                  {productsData.data.length} products
                </p>
              ) : (
                <p>
                  {productsData.data.length}{" "}
                  {productsData.data.length === 1 ? "product" : "products"}{" "}
                  found
                </p>
              )}
            </div>
          )}
        </div>
        {categoryData?.image && (
          <div className="hidden md:block">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${categoryData.image}`}
              alt={categoryData.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
        )}
      </div>

      {categoryData?.children && categoryData.children.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Subcategories</h3>
          <div className="flex flex-wrap gap-2">
            {categoryData.children.map((child: Category) => (
              <Link
                key={child.id}
                href={`/categories/${child.id}`}
              >
                <Badge
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {child.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Filters and sorting component
  const FiltersAndSorting = () => (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === "price" ? "name" : "price")}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t("sortBy")}:{" "}
                {sortBy === "price"
                  ? t("sortOptions.price")
                  : sortBy === "name"
                  ? t("sortOptions.name")
                  : t("sortOptions.newest")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center gap-2"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                {sortOrder === "asc"
                  ? t("sortOrder.lowToHigh")
                  : t("sortOrder.highToLow")}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2 h-8"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("viewMode.grid")}</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2 h-8"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">{t("viewMode.list")}</span>
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(sortBy !== "newest" || sortOrder !== "asc") && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">
                {t("activeFilters")}
              </span>

              {(sortBy !== "newest" || sortOrder !== "asc") && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {t("sortBy")}:{" "}
                  {sortBy === "price"
                    ? t("sortOptions.price")
                    : sortBy === "name"
                    ? t("sortOptions.name")
                    : t("sortOptions.newest")}{" "}
                  (
                  {sortOrder === "asc"
                    ? t("sortOrder.lowToHigh")
                    : t("sortOrder.highToLow")}
                  )
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setSortOrder("asc");
                    }}
                    className="ml-1 hover:text-red-500 text-lg leading-none"
                    aria-label={t("clearSortFilter")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSortBy("newest");
                  setSortOrder("asc");
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Empty state component
  const EmptyState = () => {
    const hasOriginalData = productsData?.data && productsData.data.length > 0;
    const isFiltered = sortBy !== "newest" || sortOrder !== "asc";

    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <Package className="w-full h-full" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hasOriginalData && isFiltered
            ? t("noProducts.noMatching")
            : t("noProducts.title")}
        </h3>
        <p className="text-gray-600 mb-6">{t("noProducts.subtitle")}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isFiltered && (
            <Button
              variant="outline"
              onClick={() => {
                setSortBy("newest");
                setSortOrder("asc");
              }}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {t("clearFilters")}
            </Button>
          )}
          <Link href="/categories">
            <Button variant="primary">{t("noProducts.browseOther")}</Button>
          </Link>
        </div>
      </div>
    );
  };

  // Error state component
  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 text-red-300">
        <AlertCircle className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t("errorState.title")}
      </h3>
      <p className="text-gray-600 mb-6">
        {productsErrorMessage?.message || t("errorState.subtitle")}
      </p>
      <Button
        variant="primary"
        onClick={() => window.location.reload()}
      >
        {t("errorState.retry")}
      </Button>
    </div>
  );

  // Enhanced pagination component
  const EnhancedPagination = () => {
    // Only show pagination if no client-side filters are active
    // and there are multiple pages from the API
    if (!productsData || productsData.last_page <= 1) return null;

    const hasActiveFilters = sortBy !== "newest" || sortOrder !== "asc";

    // Hide pagination when filters are active since we're showing filtered results
    if (hasActiveFilters) {
      return (
        <div className="text-center mt-8">
          <div className="text-sm text-gray-500 mb-4">
            Showing {filteredAndSortedProducts.length} filtered results from
            page {productsData.current_page}
          </div>
          {productsData.last_page > 1 && (
            <div className="text-sm text-gray-400">
              Clear filters to browse other pages ({productsData.current_page}{" "}
              of {productsData.last_page})
            </div>
          )}
        </div>
      );
    }

    const currentPage = productsData.current_page;
    const totalPages = productsData.last_page;
    const showPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div className="text-sm text-gray-600">
          Showing {productsData.from} to {productsData.to} of{" "}
          {productsData.total} products
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "primary" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb />
          <ErrorState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />

        {!categoryLoading && <CategoryHeader />}

        <FiltersAndSorting />

        {isLoading ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1"
            }`}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : !hasProducts ? (
          <EmptyState />
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <EnhancedPagination />
          </>
        )}

        {/* Navigation Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                {t("helpfulLinks.needHelp.text")}
              </p>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent font-semibold"
                >
                  <HeadphonesIcon className="h-4 w-4 mr-1" />
                  {t("helpfulLinks.needHelp.linkText")}
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                {t("helpfulLinks.viewAll.text")}
              </p>
              <Link href="/categories">
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent font-semibold"
                >
                  <Grid2X2 className="h-4 w-4 mr-1" />
                  {t("helpfulLinks.viewAll.linkText")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Back to Categories Button */}
          <div className="text-center mt-6 pt-4 border-t">
            <Link href="/categories">
              <Button
                variant="outline"
                className="flex items-center gap-2 mx-auto bg-gray-50 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("backToCategories")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
