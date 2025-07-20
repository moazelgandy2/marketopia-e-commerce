"use client";

import ProductsList from "@/components/elements/products-list";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  return (
    <div className="w-full min-h-screen relative bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {search ? (
                  <>
                    Search results for{" "}
                    <span className="text-purple-600">"{search}"</span>
                  </>
                ) : (
                  <>
                    Grab the best deal on{" "}
                    <span className="text-purple-600">Products</span>
                  </>
                )}
              </h1>
              <div className="w-16 h-1 bg-purple-600 mt-2"></div>
            </div>
          </div>

          <ProductsList
            perPage={15}
            initialSearch={search}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen relative bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-1 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
