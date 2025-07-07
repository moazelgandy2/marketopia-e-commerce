"use client";

import ProductsList from "@/components/elements/products-list";

export default function ProductsPage() {
  return (
    <div className="w-full min-h-screen relative bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Grab the best deal on{" "}
                <span className="text-purple-600">Products</span>
              </h1>
              <div className="w-16 h-1 bg-purple-600 mt-2"></div>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
              View All →
            </button>
          </div>

          <ProductsList perPage={15} />
        </div>
      </div>
    </div>
  );
}
