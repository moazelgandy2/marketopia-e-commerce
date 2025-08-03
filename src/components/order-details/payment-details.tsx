"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { OrderType as Order } from "@/types/order";
import { useTranslations } from "next-intl";

export const PaymentDetails = ({ order }: { order: Order }) => {
  const t = useTranslations("OrderDetails.payment");
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t("method")}</span>
            <span className="text-sm font-medium capitalize">
              {t(`methods.${order.payment_method}`)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t("status")}</span>
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
              {t(`statuses.${order.payment_status}`)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
