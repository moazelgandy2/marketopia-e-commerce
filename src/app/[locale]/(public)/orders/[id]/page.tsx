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
import { OrderStatus, OrderItemType } from "@/types/order";
import { ProductWithAttributes } from "@/types/product";

// Component to handle individual order item with product fetching
const OrderItem = ({
  item,
  formatPrice,
}: {
  item: OrderItemType;
  formatPrice: (price: string | number) => string;
}) => {
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useProductById(item.product_id.toString(), "en");

  // Debug logging
  console.log("Item:", item);
  console.log("Product ID:", item.product_id);
  console.log("Product Data:", productData);
  console.log("Product Loading:", isProductLoading);
  console.log("Product Error:", productError);

  const getImageUrl = () => {
    console.log("Getting image URL for product:", productData);

    // Check if product has images array (from ProductWithAttributes)
    if (productData?.images && productData.images.length > 0) {
      const firstImage = productData.images[0].image;
      console.log("Using first image from images array:", firstImage);

      if (firstImage.startsWith("http")) {
        return firstImage;
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${firstImage}`;
      console.log("Constructed image URL from images array:", imageUrl);
      return imageUrl;
    }

    // Fallback to single image field (if exists)
    if (productData?.image) {
      console.log("Using single image field:", productData.image);

      if (productData.image.startsWith("http")) {
        return productData.image;
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${productData.image}`;
      console.log("Constructed image URL from image field:", imageUrl);
      return imageUrl;
    }

    console.log("No product image found, using placeholder");
    return "/images/placeholder-product.svg";
  };

  if (isProductLoading) {
    return (
      <div className="flex gap-4 pb-4 border-b last:border-0">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 pb-4 border-b last:border-0">
      <Image
        src={getImageUrl()}
        alt={productData?.name || "Product"}
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/placeholder-product.svg";
        }}
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">
          {productData?.name || "Unknown Product"}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          {productData?.description || ""}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
          <div className="flex items-center gap-2">
            {productData?.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(productData.price)}
              </span>
            )}
            <span className="text-sm font-medium">
              {formatPrice(
                productData?.discount_price || productData?.price || "0"
              )}{" "}
              × {item.quantity}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-semibold text-lg">
            Total: {formatPrice(parseFloat(item.price || "0") * item.quantity)}
          </span>
        </div>
      </div>
      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
        >
          <Star className="h-4 w-4 mr-2" />
          Review
        </Button>
      </div>
    </div>
  );
};

const orderStatuses = [
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
    key: OrderStatus.READY,
    label: "Preparing",
    icon: Package,
    color: "yellow",
  },
  {
    key: "shipped",
    label: "Shipped",
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

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const locale = params.locale as string;
  const { order, isOrderLoading, isOrderError } = useOrder(orderId);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  const copyTrackingNumber = () => {
    const trackingNumber = `TRK${orderId}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
    navigator.clipboard.writeText(trackingNumber);
    toast.success("Tracking number copied to clipboard!");
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderId}`,
        text: `Check out my order from Marketopia!`,
        url: window.location.href,
      });
    }
  };

  if (isOrderLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isOrderError || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Package className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link href="/profile?tab=orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = orderStatuses.findIndex(
    (s) => s.key === order.status
  );

  // Calculate estimated delivery (3 days from creation)
  const estimatedDelivery = new Date(order.created_at);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const trackingNumber = `TRK${orderId}${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{orderId}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareOrder}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Order Status
                    <Badge
                      variant={
                        order.status === OrderStatus.DELIVERED
                          ? "default"
                          : "secondary"
                      }
                      className="ml-2"
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Status Progress */}
                    <div className="space-y-4">
                      {orderStatuses.map((status, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const StatusIcon = status.icon;

                        return (
                          <div
                            key={status.key}
                            className="flex items-center gap-4"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? `bg-${status.color}-500 text-white`
                                  : "bg-gray-200 text-gray-400"
                              } ${
                                isCurrent
                                  ? "ring-4 ring-blue-100 ring-opacity-50"
                                  : ""
                              }`}
                            >
                              <StatusIcon className="h-5 w-5" />
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
                                  In Progress
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

                    {/* Tracking Number */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900">
                            Tracking Number
                          </h4>
                          <p className="text-blue-700 font-mono">
                            {trackingNumber}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyTrackingNumber}
                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-900">
                            Estimated Delivery
                          </h4>
                          <p className="text-green-700">
                            {estimatedDelivery.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal || "0")}</span>
                    </div>
                    {order.discount && parseFloat(order.discount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span
                        className={
                          order.delivery_fee && order.delivery_fee > 0
                            ? ""
                            : "text-green-600"
                        }
                      >
                        {order.delivery_fee && order.delivery_fee > 0
                          ? formatPrice(order.delivery_fee)
                          : "Free"}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatPrice(order.total || "0")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {order.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{order.address.name}</p>
                      <p className="text-sm text-gray-600">
                        {order.address.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.address.address}
                        <br />
                        {order.address.city?.name || "Unknown City"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {order.payment_method === "visa"
                          ? "Credit Card"
                          : order.payment_method === "cash"
                          ? "Cash on Delivery"
                          : "Digital Wallet"}
                      </p>
                      <p
                        className={`text-sm ${
                          order.payment_status === "paid"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Info */}
              {order.coupon && (
                <Card>
                  <CardHeader>
                    <CardTitle>Coupon Applied</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="font-medium text-green-900">
                        Code: {order.coupon.code}
                      </p>
                      <p className="text-sm text-green-700">
                        {order.coupon.discount_type === "percentage"
                          ? `${order.coupon.discount_value}% off`
                          : `${formatPrice(order.coupon.discount_value)} off`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
