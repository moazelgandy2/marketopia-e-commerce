"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Star,
  Copy,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useOrder } from "@/hooks/use-orders";
import { useProductById } from "@/hooks/use-products";
import { OrderStatus, OrderItemType, OrderCreationType } from "@/types/order";
import { ProductWithAttributes } from "@/types/product";

// Component to handle individual order item with product fetching
const OrderItem = ({
  item,
  formatPrice,
}: {
  item: OrderItemType;
  formatPrice: (price: string | number) => string;
}) => {
  const { data: productData, isLoading: isProductLoading } = useProductById(
    item.product_id.toString(),
    "en"
  );

  const getImageUrl = () => {
    // Check if product has images array (from ProductWithAttributes)
    if (productData?.images && productData.images.length > 0) {
      const firstImage = productData.images[0].image;

      if (firstImage.startsWith("http")) {
        return firstImage;
      }

      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${firstImage}`;
    }

    // Fallback to single image field (if exists)
    if (productData?.image) {
      if (productData.image.startsWith("http")) {
        return productData.image;
      }

      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${productData.image}`;
    }

    return "/images/placeholder-product.svg";
  };

  if (isProductLoading) {
    return (
      <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="relative">
        <Image
          src={getImageUrl()}
          alt={productData?.name || "Product"}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder-product.svg";
          }}
        />
        <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {item.quantity}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
          {productData?.name || "Unknown Product"}
        </h4>
        {productData?.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {productData.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {productData?.discount_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(productData.price)}
              </span>
            )}
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(
                productData?.discount_price || productData?.price || "0"
              )}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {formatPrice(parseFloat(item.price || "0") * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dynamic order status configuration based on actual order status
const getOrderStatusConfig = (currentStatus: OrderStatus) => {
  const baseStatuses = [
    {
      key: OrderStatus.PENDING,
      label: "Order Placed",
      icon: CheckCircle,
      color: "blue",
    },
    {
      key: OrderStatus.CONFIRMED,
      label: "Order Confirmed",
      icon: CheckCircle,
      color: "green",
    },
    {
      key: OrderStatus.PREPARING,
      label: "Preparing Order",
      icon: Package,
      color: "orange",
    },
    {
      key: OrderStatus.READY,
      label: "Ready for Pickup/Delivery",
      icon: Package,
      color: "yellow",
    },
    {
      key: OrderStatus.ON_DELIVERY,
      label: "Out for Delivery",
      icon: Truck,
      color: "blue",
    },
    {
      key: OrderStatus.DELIVERED,
      label: "Delivered",
      icon: CheckCircle,
      color: "green",
    },
  ];

  // Filter out statuses that don't make sense for cancelled orders
  if (currentStatus === OrderStatus.CANCELLED) {
    return [
      {
        key: OrderStatus.PENDING,
        label: "Order Placed",
        icon: CheckCircle,
        color: "blue",
      },
      {
        key: OrderStatus.CANCELLED,
        label: "Order Cancelled",
        icon: Package,
        color: "red",
      },
    ];
  }

  return baseStatuses;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const locale = params.locale as string;
  const { order, isOrderLoading, isOrderError } = useOrder(orderId);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    const currencyMap: Record<string, string> = {
      en: "EGP",
      ar: "EGP",
    };

    const currency = currencyMap[locale] || "USD";

    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  const copyTrackingNumber = () => {
    const trackingNumber =
      order?.tracking_number || `MKT-${orderId.toUpperCase()}`;
    navigator.clipboard.writeText(trackingNumber);
    toast.success("Tracking number copied to clipboard!");
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
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4"
                        >
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isOrderError || !order) {
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
            <Button className="bg-gray-900 hover:bg-gray-800">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get dynamic order statuses based on current order status
  const orderStatuses = getOrderStatusConfig(order.status);
  const currentStatusIndex = orderStatuses.findIndex(
    (s) => s.key === order.status
  );

  // Use delivery date from API if available, otherwise calculate estimated delivery
  const getDeliveryDate = () => {
    // Check if order has delivery_date field from API
    if (order.delivery_date) {
      return new Date(order.delivery_date);
    }

    // Check if order has estimated_delivery field from API
    if (order.estimated_delivery) {
      return new Date(order.estimated_delivery);
    }

    // Fallback: calculate based on order type and status
    const orderDate = new Date(order.created_at);
    let estimatedDays = 3; // default

    // Adjust based on order type if available
    if (order.order_type === OrderCreationType.ONLINE) {
      estimatedDays = order.delivery_fee && order.delivery_fee > 0 ? 2 : 3;
    }

    orderDate.setDate(orderDate.getDate() + estimatedDays);
    return orderDate;
  };

  const deliveryDate = getDeliveryDate();

  // Use tracking number from API if available
  const trackingNumber =
    order.tracking_number || `MKT-${orderId.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{orderId.slice(-8).toUpperCase()}
                </h1>
                <p className="text-sm text-gray-500">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOrder}
              className="hidden sm:flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order Status
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
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : order.status === OrderStatus.ON_DELIVERY
                            ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                            : ""
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1).replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Status Progress */}
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
                                    isCompleted
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {status.label}
                                </h3>
                                {isCurrent && (
                                  <p className="text-sm text-blue-600 font-medium">
                                    Current Status
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

                    {/* Tracking & Delivery Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Tracking Number - Only show if order has been confirmed */}
                      {order.status !== OrderStatus.PENDING &&
                        order.status !== OrderStatus.CANCELLED && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-blue-900 text-sm">
                                  Tracking Number
                                </h4>
                                <p className="text-blue-700 font-mono text-xs mt-1">
                                  {trackingNumber}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyTrackingNumber}
                                className="text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* Cancellation Info - Show only for cancelled orders */}
                      {order.status === OrderStatus.CANCELLED && (
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-xl p-4 sm:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-red-900 text-sm">
                                Order Cancelled
                              </h4>
                              <p className="text-red-700 text-xs mt-1">
                                Cancelled on{" "}
                                {new Date(order.updated_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                              {order.notes && (
                                <p className="text-red-600 text-xs mt-1">
                                  Reason: {order.notes}
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

              {/* Order Items */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Items ({order.order_details?.length || 0})
                  </h2>
                  <div className="space-y-3">
                    {order.order_details && order.order_details.length > 0 ? (
                      order.order_details.map((item) => (
                        <OrderItem
                          key={item.id}
                          item={item}
                          formatPrice={formatPrice}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-500">
                          No items found in this order
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(order.subtotal || "0")}
                      </span>
                    </div>
                    {order.discount && parseFloat(order.discount) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">
                          -{formatPrice(order.discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span
                        className={`font-medium ${
                          order.delivery_fee && order.delivery_fee > 0
                            ? "text-gray-900"
                            : "text-green-600"
                        }`}
                      >
                        {order.delivery_fee && order.delivery_fee > 0
                          ? formatPrice(order.delivery_fee)
                          : "Free"}
                      </span>
                    </div>
                    <div className="h-px bg-gray-200 my-3"></div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg">
                        {formatPrice(order.total || "0")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {order.address && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Delivery Address
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">
                        {order.address.name}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {order.address.phone}
                      </p>
                      <p className="text-gray-600">
                        {order.address.address}
                        <br />
                        <span className="text-gray-500">
                          {order.address.city?.name || "Unknown City"}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment
                    </h3>
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
                          order.payment_status === "paid"
                            ? "default"
                            : "secondary"
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

              {/* Coupon Info */}
              {order.coupon && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Coupon Applied
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold text-xs">
                            %
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-green-900 text-sm">
                            {order.coupon.code}
                          </p>
                          <p className="text-xs text-green-700">
                            {order.coupon.discount_type === "percentage"
                              ? `${order.coupon.discount_value}% off`
                              : `${formatPrice(
                                  order.coupon.discount_value
                                )} off`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Notes - Show if available */}
              {order.notes && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Notes
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
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
