"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  MapPin,
  Phone,
  Star,
  Share2,
  Download,
  Home,
  ShoppingBag,
  Gift,
  Sparkles,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useOrder } from "@/hooks/use-orders";
import { OrderStatus, OrderCreationType } from "@/types/order";

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const locale = (params.locale as string) || "en";
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch order data if orderId is available
  const { order, isOrderLoading, isOrderError } = useOrder(orderId || "");

  useEffect(() => {
    // Trigger animations
    setIsVisible(true);
    setShowConfetti(true);

    // Stop confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(confettiTimer);
  }, []);

  // Calculate estimated delivery based on order data
  const getEstimatedDelivery = () => {
    if (!order) return null;

    // Use API delivery date if available
    if (order.delivery_date) {
      return new Date(order.delivery_date);
    }

    if (order.estimated_delivery) {
      return new Date(order.estimated_delivery);
    }

    // Calculate based on order type and creation date
    const orderDate = new Date(order.created_at);
    let estimatedDays = 3; // default

    if (order.order_type === OrderCreationType.ONLINE) {
      estimatedDays = order.delivery_fee && order.delivery_fee > 0 ? 2 : 3;
    }

    orderDate.setDate(orderDate.getDate() + estimatedDays);
    return orderDate;
  };

  const estimatedDelivery = getEstimatedDelivery();

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    // Dynamic currency based on locale
    const currencyMap: Record<string, string> = {
      en: "USD",
      ar: "EGP", // Egyptian Pound for Arabic locale
    };

    const currency = currencyMap[locale] || "USD";

    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-bounce delay-200"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-40 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-bounce delay-700"></div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${
                i % 4 === 0
                  ? "from-green-400 to-green-600"
                  : i % 4 === 1
                  ? "from-blue-400 to-blue-600"
                  : i % 4 === 2
                  ? "from-purple-400 to-purple-600"
                  : "from-yellow-400 to-yellow-600"
              } rounded-full animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Success Card */}
          <Card
            className={`overflow-hidden border-0 shadow-2xl transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <CardContent className="p-0">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white p-8 text-center relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-pulse">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold mb-2 animate-fade-in">
                    Order Confirmed! 🎉
                  </h1>
                  <p className="text-green-100 text-lg">
                    Thank you for your purchase! Your order has been
                    successfully placed.
                  </p>
                </div>

                {/* Floating elements */}
                <Sparkles className="absolute top-4 left-4 h-6 w-6 text-yellow-300 animate-spin" />
                <Gift className="absolute top-6 right-6 h-8 w-8 text-pink-300 animate-bounce" />
                <Star className="absolute bottom-4 left-8 h-4 w-4 text-yellow-300 animate-pulse" />
                <Star className="absolute bottom-8 right-4 h-6 w-6 text-yellow-300 animate-pulse delay-300" />
              </div>

              {/* Order Details Section */}
              <div className="p-8 space-y-6">
                {/* Loading State */}
                {isOrderLoading && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Skeleton className="h-12 w-64 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-24 w-full rounded-lg" />
                      <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                  </div>
                )}

                {/* Order Number */}
                {orderId && !isOrderLoading && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full">
                      <Package className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-600 font-medium">
                        Order Number:
                      </span>
                      <span className="font-bold text-lg text-gray-900">
                        #{orderId}
                      </span>
                    </div>
                  </div>
                )}

                {/* Order Summary - Show if order data is available */}
                {order && !isOrderLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Total */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900">
                            Order Total
                          </h4>
                          <p className="text-xl font-bold text-blue-800">
                            {formatPrice(order.total)}
                          </p>
                          <p className="text-xs text-blue-600">
                            {order.order_details?.length || 0} item(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    {estimatedDelivery && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-900">
                              Est. Delivery
                            </h4>
                            <p className="text-sm font-semibold text-green-800">
                              {estimatedDelivery.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-green-600">
                              {order.payment_method === "cash"
                                ? "Cash on Delivery"
                                : "Prepaid"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {orderId && (
                    <Link href={`/orders/${orderId}`}>
                      <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                        <Package className="h-4 w-4 mr-2" />
                        View Order Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Footer Message */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">
                    Thank you for choosing Marketopia! 💙
                  </p>
                  <p className="text-sm text-gray-500">
                    You'll receive email updates about your order status.
                  </p>
                  {order?.address && (
                    <p className="text-xs text-gray-400 mt-2">
                      Delivering to: {order.address.name},{" "}
                      {order.address.city?.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
