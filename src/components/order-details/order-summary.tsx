"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderType as Order } from "@/types/order";
import { useTranslations } from "next-intl";

export const OrderSummary = ({
  order,
  formatPrice,
}: {
  order: Order;
  formatPrice: (price: number | string) => string;
}) => {
  const t = useTranslations("OrderDetails.summary");
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("title")}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("subtotal")}</span>
            <span className="font-medium">
              {formatPrice(order.subtotal || "0")}
            </span>
          </div>
          {order.discount && parseFloat(order.discount) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t("discount")}</span>
              <span className="font-medium">
                -{formatPrice(order.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("delivery")}</span>
            <span
              className={`font-medium ${
                order.delivery_fee && order.delivery_fee > 0
                  ? "text-gray-900"
                  : "text-green-600"
              }`}
            >
              {order.delivery_fee && order.delivery_fee > 0
                ? formatPrice(order.delivery_fee)
                : t("free")}
            </span>
          </div>
          <div className="h-px bg-gray-200 my-3"></div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">{t("total")}</span>
            <span className="font-bold text-lg">
              {formatPrice(order.total || "0")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
