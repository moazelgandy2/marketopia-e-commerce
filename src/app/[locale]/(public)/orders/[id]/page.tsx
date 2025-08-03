"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useOrder } from "@/hooks/use-orders";
import { OrderHeader } from "@/components/order-details/order-header";
import { OrderStatusCard } from "@/components/order-details/order-status-card";
import { OrderItemsList } from "@/components/order-details/order-items-list";
import { OrderSummary } from "@/components/order-details/order-summary";
import { DeliveryAddress } from "@/components/order-details/delivery-address";
import { PaymentDetails } from "@/components/order-details/payment-details";
import { CouponInfo } from "@/components/order-details/coupon-info";
import { OrderNotes } from "@/components/order-details/order-notes";
import { OrderDetailsSkeleton } from "@/components/order-details/order-details-skeleton";
import { OrderNotFound } from "@/components/order-details/order-not-found";
import { AddressType, CouponType } from "@/types/order";
import { Address } from "@/types/address";
import { Coupon } from "@/types/coupon";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const locale = params.locale as string;
  const { order, isOrderLoading, isOrderError } = useOrder(orderId);

  const convertAddressType = (addressType: AddressType): Address => ({
    ...addressType,
    is_default: addressType.is_default ? 1 : 0,
    city: addressType.city || { id: addressType.city_id, name: "" },
  });

  const convertCouponType = (couponType: CouponType): Coupon => ({
    ...couponType,
    discount_type:
      couponType.discount_type === "percentage" ? "percentage" : "fixed_amount",
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    const currencyMap: Record<string, string> = {
      en: "EGP",
      ar: "EGP",
    };
    const currency = currencyMap[locale] || "EGP";
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderId}`,
        text: `Check out my order from Narmer!`,
        url: window.location.href,
      });
    }
  };

  if (isOrderLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (isOrderError || !order) {
    return <OrderNotFound />;
  }

  const trackingNumber =
    order.tracking_number || `MKT-${orderId.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <OrderHeader
            orderId={orderId}
            createdAt={order.created_at}
            shareOrder={shareOrder}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OrderStatusCard
                order={order}
                trackingNumber={trackingNumber}
              />
              <OrderItemsList
                items={order.order_details || []}
                formatPrice={formatPrice}
              />
            </div>

            <div className="space-y-6">
              <OrderSummary
                order={order}
                formatPrice={formatPrice}
              />
              {order.address && (
                <DeliveryAddress address={convertAddressType(order.address)} />
              )}
              <PaymentDetails order={order} />
              {order.coupon && (
                <CouponInfo
                  coupon={convertCouponType(order.coupon)}
                  formatPrice={formatPrice}
                />
              )}
              {order.notes && <OrderNotes notes={order.notes} />}
            </div>
          </div>
        </div>
      </div>

      <style
        jsx
        global
      >{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
