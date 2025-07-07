"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ProductsLoadingProps {
  count?: number;
}

export default function ProductsLoading({ count = 6 }: ProductsLoadingProps) {
  return (
    <div className="space-y-6">
      {/* Search skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="space-y-3"
          >
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
