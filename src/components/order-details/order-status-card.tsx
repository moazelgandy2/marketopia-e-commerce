"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderType as Order, OrderStatus } from "@/types/order";
import { getOrderStatusConfig } from "./order-status-config";
import { CheckCircle, Copy, Package, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const OrderStatusCard = ({
  order,
}: {
  order: Order;
  trackingNumber: string;
}) => {
  const t = useTranslations("OrderDetails.status");
  const params = useParams();
  const locale = params.locale as string;
  const orderStatuses = getOrderStatusConfig(order.status);
  const currentStatusIndex = orderStatuses.findIndex(
    (s) => s.key === order.status
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Truck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("title")}
            </h2>
            <Badge
              variant={
                order.status === OrderStatus.DELIVERED
                  ? "default"
                  : order.status === OrderStatus.CANCELLED
                  ? "destructive"
                  : "secondary"
              }
              className={`mt-1 ${
                order.status === OrderStatus.DELIVERED
                  ? "bg-green-100 text-green-800 border-green-200"
                  : order.status === OrderStatus.CANCELLED
                  ? "bg-red-100 text-red-800 border-red-200"
                  : order.status === OrderStatus.PENDING
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : order.status === OrderStatus.CONFIRMED
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : order.status === OrderStatus.PREPARING
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : order.status === OrderStatus.READY
                  ? "bg-slate-100 text-slate-800 border-slate-200"
                  : order.status === OrderStatus.ON_DELIVERY
                  ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                  : ""
              }`}
            >
              {t(`labels.${order.status}`)}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {orderStatuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={status.key}
                    className="relative flex items-center gap-4"
                  >
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          isCompleted ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {t(`labels.${status.key}`)}
                      </h3>
                      {isCurrent && (
                        <p className="text-sm text-blue-600 font-medium">
                          {t("currentStatus")}
                        </p>
                      )}
                    </div>
                    {isCompleted && !isCurrent && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {order.status === OrderStatus.CANCELLED && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-xl p-4 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-red-900 text-sm">
                      {t("orderCancelled")}
                    </h4>
                    <p className="text-red-700 text-xs mt-1">
                      {t("cancelledOn")}{" "}
                      {new Date(order.updated_at).toLocaleDateString(
                        locale === "ar" ? "ar-EG" : "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    {order.notes && (
                      <p className="text-red-600 text-xs mt-1">
                        {t("reason")}: {order.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
