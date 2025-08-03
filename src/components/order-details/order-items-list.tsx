"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrderItem } from "./order-item";
import { Package } from "lucide-react";
import { OrderItemType } from "@/types";

export const OrderItemsList = ({
  items,
  formatPrice,
}: {
  items: OrderItemType[];
  formatPrice: (price: number | string) => string;
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Items ({items?.length || 0})
        </h2>
        <div className="space-y-3">
          {items && items.length > 0 ? (
            items.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                formatPrice={formatPrice}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No items found in this order</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
