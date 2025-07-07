"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useParentCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";

interface ParentCategoriesListProps {
  page?: number;
  onPageChange?: (page: number) => void;
  onCategoryClick?: (categoryId: number) => void;
  showPagination?: boolean;
  className?: string;
}

export function ParentCategoriesList({
  page = 1,
  onPageChange,
  onCategoryClick,
  showPagination = true,
  className,
}: ParentCategoriesListProps) {
  const { data, isLoading, error } = useParentCategories(page);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600 text-sm">Failed to load categories</p>
      </div>
    );
  }

  if (!data || data.categories.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 text-sm">No categories found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.categories.map((category) => (
          <div
            key={category.id}
            className="group cursor-pointer"
            onClick={() => onCategoryClick?.(category.id)}
          >
            <div className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.popular > 0 ? "Popular Category" : "Category"}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPagination && data.pagination.last_page > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {data.pagination.from} to {data.pagination.to} of{" "}
            {data.pagination.total} categories
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {data.pagination.current_page} of {data.pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= data.pagination.last_page}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
