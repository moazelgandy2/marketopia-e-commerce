"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useCategoryWithChildren } from "@/hooks/use-categories";
import { Category } from "@/types/category";

// Utility function to construct image URLs
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://192.168.1.15/NarmerEcommerce/public/storage/${imagePath}`;
};

interface CategoryWithChildrenProps {
  categoryId: number;
  onBack?: () => void;
  className?: string;
}

export function CategoryWithChildren({
  categoryId,
  onBack,
  className,
}: CategoryWithChildrenProps) {
  const {
    data: category,
    isLoading,
    error,
  } = useCategoryWithChildren(categoryId);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="h-6 bg-gray-200 animate-pulse rounded w-32"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3"
            >
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
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
        <p className="text-red-600 text-sm">Failed to load category details</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 text-sm">Category not found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-slate-500 rounded-lg flex items-center justify-center">
            <img
              src={getImageUrl(category.image)}
              alt={category.name}
              className="w-6 h-6 rounded object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <h3 className="font-bold text-xl text-gray-900">{category.name}</h3>
        </div>
      </div>

      {category.children && category.children.length > 0 ? (
        <div className="space-y-3">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition-all duration-200 group border border-transparent hover:border-blue-200 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-slate-200 transition-all duration-200 flex-shrink-0">
                <img
                  src={getImageUrl(child.image)}
                  alt={child.name}
                  className="w-6 h-6 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {child.name}
                </div>
                {child.popular > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Popular Category
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No subcategories found</p>
          <Link
            href={`/categories/${category.slug}`}
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            View {category.name} Products
          </Link>
        </div>
      )}
    </div>
  );
}
