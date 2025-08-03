import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { OrderStatus, OrderType } from "@/types";
import { format } from "date-fns";
import {
  CreditCard,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const statusColors: Record<OrderStatus, string> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  confirmed:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  preparing:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  ready:
    "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
  on_delivery:
    "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800",
  delivered:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  cancelled:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
};

const statusIcons: Record<OrderStatus, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: Package,
  on_delivery: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export const OrdersTab = () => {
  const { orders, isOrdersLoading, isOrdersError } = useOrders();
  const router = useRouter();
  const t = useTranslations("ProfilePage.orders");

  const viewOrderDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };
  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </div>
        {orders && (
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {orders.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {t("totalOrders")}
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isOrdersLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isOrdersError ? (
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-8 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                {t("error.title")}
              </h3>
              <p className="text-red-600 dark:text-red-400">
                {t("error.subtitle")}
              </p>
            </CardContent>
          </Card>
        ) : !orders || orders.length === 0 ? (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t("empty.title")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t("empty.subtitle")}
              </p>
            </CardContent>
          </Card>
        ) : (
          orders?.map((o: OrderType) => {
            const StatusIcon = statusIcons[o.status];
            return (
              <Card
                key={o.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {t("orderNumber")} #{o.id}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {format(new Date(o.created_at), "PPP")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          className={cn(
                            "border px-3 py-1 font-medium",
                            statusColors[o.status]
                          )}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {t(`status.${o.status}`)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrderDetails(o.id.toString())}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t("view")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Payment & Address Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {o.payment_method}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {o.payment_status === "paid"
                              ? t("payment.paid")
                              : t("payment.unpaid")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {o.address?.name ?? t("noAddress")}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {t("deliveryAddress")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {t("orderItems")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {o.order_details.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                          >
                            <div className="relative">
                              <Image
                                src={
                                  d.product.image
                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${d.product.image}`
                                    : "/images/default-avatar.jpg"
                                }
                                alt={d.product.name}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {d.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {d.product.name}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                ${d.price} {t("each")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400">
                        {t("orderTotal")}
                      </span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ${o.total}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
