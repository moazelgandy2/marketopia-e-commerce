"use client";

import { useProductsByCategory } from "@/hooks/use-products";
import { useCategoryWithChildren } from "@/hooks/use-categories";
import { useState } from "react";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/category";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ArrowRight,
  Home,
  Package,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface CategoryProductsProps {
  categoryId: number;
}

export default function CategoryProducts({
  categoryId,
}: CategoryProductsProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "name" | "newest">("newest");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMessage,
  } = useProductsByCategory(categoryId, page);

  const { data: categoryData, isLoading: categoryLoading } =
    useCategoryWithChildren(categoryId);

  const isLoading = productsLoading || categoryLoading;
  const hasProducts = productsData?.data && productsData.data.length > 0;

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
        Home
      </Link>
      <ArrowRight className="w-4 h-4" />
      <Link
        href="/categories"
        className="hover:text-primary transition-colors"
      >
        Categories
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
          {productsData?.total && (
            <p className="text-gray-600">
              {productsData.total}{" "}
              {productsData.total === 1 ? "product" : "products"} found
            </p>
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
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

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
                Sort:{" "}
                {sortBy === "price"
                  ? "Price"
                  : sortBy === "name"
                  ? "Name"
                  : "Newest"}
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
                {sortOrder === "asc" ? "Low to High" : "High to Low"}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2 h-8"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2 h-8"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || sortBy !== "newest") && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  Sort: {sortBy} ({sortOrder})
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setSortOrder("asc");
                    }}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
        <Package className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        {searchTerm
          ? `No products match "${searchTerm}" in this category.`
          : "This category doesn't have any products yet."}
      </p>
      {searchTerm && (
        <Button
          variant="outline"
          onClick={() => setSearchTerm("")}
          className="mb-4"
        >
          Clear search
        </Button>
      )}
      <div>
        <Link href="/categories">
          <Button variant="default">Browse all categories</Button>
        </Link>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 text-red-300">
        <AlertCircle className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">
        {productsErrorMessage?.message ||
          "Unable to load products. Please try again."}
      </p>
      <Button
        variant="default"
        onClick={() => window.location.reload()}
      >
        Try again
      </Button>
    </div>
  );

  // Enhanced pagination component
  const EnhancedPagination = () => {
    if (!productsData || productsData.last_page <= 1) return null;

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
              variant={pageNum === currentPage ? "default" : "outline"}
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
              {productsData.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <EnhancedPagination />
          </>
        )}
      </div>
    </div>
  );
}
