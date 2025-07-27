"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

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
                {/* Order Number */}
                {orderId && (
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

                {/* Footer Message */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">
                    Thank you for choosing Marketopia! 💙
                  </p>
                  <p className="text-sm text-gray-500">
                    You'll receive email updates about your order status.
                  </p>
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
