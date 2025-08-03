"use client";

import { Button } from "@/components/ui/button";

import { Package } from "lucide-react";
import Link from "next/link";

export const OrderNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center py-16 px-4">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The order you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Link href="/profile?tab=orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    </div>
  );
};
