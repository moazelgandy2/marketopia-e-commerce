"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { OrderType as Order } from "@/types/order";

export const PaymentDetails = ({ order }: { order: Order }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Method</span>
            <span className="text-sm font-medium capitalize">
              {order.payment_method === "visa"
                ? "Credit Card"
                : order.payment_method === "cash"
                ? "Cash on Delivery"
                : "Digital Wallet"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge
              variant={
                order.payment_status === "paid" ? "default" : "secondary"
              }
              className={`text-xs ${
                order.payment_status === "paid"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-orange-100 text-orange-800 border-orange-200"
              }`}
            >
              {order.payment_status === "paid" ? "Paid" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
