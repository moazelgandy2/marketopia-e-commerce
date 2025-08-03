"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/elements/pagination";
import {
  ArrowRight,
  Home,
  Search,
  Grid3X3,
  Package,
  Filter,
  SortAsc,
  SortDesc,
  HeadphonesIcon,
  ShoppingBag,
} from "lucide-react";
import { useParentCategories } from "@/hooks/use-categories";
import { Category } from "@/types";
import { useTranslations } from "next-intl";

export default function AllCategoriesPage() {
  const t = useTranslations("CategoriesPage");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading, error } = useParentCategories(currentPage);

  // Filter and sort categories based on search term and sort order
  const filteredAndSortedCategories = useMemo(() => {
    if (!data?.categories) return [];

    let filtered = data.categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [data?.categories, searchTerm, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 mb-2">
                <Package className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                {t("errorState.title")}
              </h3>
              <p className="text-red-600 text-sm mb-4">
                {error instanceof Error
                  ? error.message
                  : t("errorState.message")}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                {t("errorState.tryAgain")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center group"
          >
            <Home className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
            {t("home")}
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{t("breadcrumb")}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          {data?.pagination && (
            <div className="mt-4 text-sm text-gray-500">
              {t("showingText", {
                from: data.pagination.from,
                to: data.pagination.to,
                total: data.pagination.total,
              })}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <Button
              onClick={toggleSortOrder}
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              {sortOrder === "asc" ? t("sortAZ") : t("sortZA")}
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden"
              >
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredAndSortedCategories.map((category: Category) => (
              <Card
                key={category.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1 overflow-hidden bg-white"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200">
                      {category.image ? (
                        <>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${category.image}`}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div
                            className="hidden items-center justify-center h-full absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"
                            style={{ display: "none" }}
                          >
                            <Grid3X3 className="w-12 h-12 text-gray-400" />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Grid3X3 className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      {category.popular === 1 && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500/90 text-white border-0 shadow-md"
                        >
                          {t("popular")}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {t("productDescription", {
                        categoryName: category.name.toLowerCase(),
                      })}
                    </p>
                    <Link href={`/categories/${category.id}`}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-primary border-0">
                        {t("browseCategory")}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("noCategories.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? t("noCategories.subtitle", { searchTerm })
                  : t("noCategories.noResults")}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                >
                  {t("noCategories.clearSearch")}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.last_page > 1 && !searchTerm && (
          <div className="mb-8">
            <Pagination
              currentPage={data.pagination.current_page}
              totalPages={data.pagination.last_page}
              onPageChange={handlePageChange}
              showingFrom={data.pagination.from}
              showingTo={data.pagination.to}
              total={data.pagination.total}
            />
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 mx-auto bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
            >
              <Home className="w-4 h-4" />
              {t("backToHome")}
            </Button>
          </Link>
        </div>

        {/* Helpful Navigation Links */}
        <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
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
                {t("helpfulLinks.viewProducts.text")}
              </p>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent font-semibold"
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {t("helpfulLinks.viewProducts.linkText")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
