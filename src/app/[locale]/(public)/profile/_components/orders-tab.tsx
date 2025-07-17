import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { OrderStatus, OrderType } from "@/types";
import { format } from "date-fns";
import { CreditCard, MapPin } from "lucide-react";
import Image from "next/image";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-purple-100 text-purple-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-sky-100 text-sky-800",
  on_delivery: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};
export const OrdersTab = () => {
  const { orders, isOrdersLoading, isOrdersError } = useOrders();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOrdersLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : isOrdersError ? (
          <div className="text-red-500">
            Failed to load orders. Please try again later.
          </div>
        ) : (
          orders?.map((o: OrderType) => (
            <div
              key={o.id}
              className="border rounded-xl p-4 space-y-2 dark:border-slate-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">#{o.id}</p>
                  <p className="text-sm text-slate-600">
                    {format(new Date(o.created_at), "PPP")}
                  </p>
                </div>
                <Badge className={cn(statusColors[o.status])}>{o.status}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                <span>
                  {o.payment_method} ·{" "}
                  {o.payment_status === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{o.address?.name ?? "No address"}</span>
              </div>

              <div className="text-sm font-bold">Total: ${o.total}</div>

              {/* items */}
              <div className="space-y-1">
                {o.order_details.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Image
                      src={
                        d.product.image
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${d.product.image}`
                          : "/images/default-avatar.png"
                      }
                      alt={d.product.name}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <span>
                      {d.product.name} ×{d.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
