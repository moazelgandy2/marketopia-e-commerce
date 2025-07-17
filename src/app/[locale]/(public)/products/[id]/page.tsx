"use client";

import { useParams, useRouter } from "next/navigation";
import { useProductById } from "@/hooks/use-products";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  RotateCcw,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// Helper function to get color values for color attributes
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    "dark blue": "#1e3a8a",
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#22c55e",
    yellow: "#eab308",
    purple: "#a855f7",
    pink: "#ec4899",
    gray: "#6b7280",
    grey: "#6b7280",
    brown: "#92400e",
    orange: "#f97316",
    silver: "#d1d5db",
    gold: "#fbbf24",
  };

  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || "#9ca3af"; // Default gray color
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const productId = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, number>
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const { data: product, isLoading, error } = useProductById(productId, locale);

  // Reset failed images when product changes
  useEffect(() => {
    setFailedImages(new Set());
    setCurrentImageIndex(0);
  }, [productId]);

  // Group attributes by their attribute name
  const attributeGroups =
    product?.product_attributes.reduce((groups, attr) => {
      const attributeName = attr.attribute_value.attribute.name;
      if (!groups[attributeName]) {
        groups[attributeName] = [];
      }
      groups[attributeName].push(attr);
      return groups;
    }, {} as Record<string, typeof product.product_attributes>) || {};

  // Calculate total price including selected attributes
  const calculateTotalPrice = () => {
    const basePrice = parseFloat(
      product?.discount_price || product?.price || "0"
    );
    const attributePrices = Object.values(selectedAttributes).reduce(
      (total, attributeValueId) => {
        const attribute = product?.product_attributes.find(
          (attr) => attr.attribute_value_id === attributeValueId
        );
        return total + (attribute?.price || 0);
      },
      0
    );
    return basePrice + attributePrices;
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.discount_price
    ? (
        ((parseFloat(product.price) - parseFloat(product.discount_price)) /
          parseFloat(product.price)) *
        100
      ).toFixed(0)
    : null;

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => Math.min(prev + 1, product.quantity));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  // Product images from API
  const productImages =
    product.images?.length > 0
      ? product.images.map(
          (img) => `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img.image}`
        )
      : product.image
      ? [`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`]
      : [];

  // Reset image index if it's out of bounds
  if (currentImageIndex >= productImages.length) {
    setCurrentImageIndex(0);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/products"
              className="text-gray-500 hover:text-gray-700"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-4 lg:sticky lg:top-8 lg:self-start lg:max-h-screen lg:overflow-y-auto">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="relative aspect-square max-w-md mx-auto">
                {productImages.length > 0 &&
                !failedImages.has(currentImageIndex) ? (
                  <Image
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    priority
                    onError={() =>
                      setFailedImages(
                        (prev) => new Set([...prev, currentImageIndex])
                      )
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
                {discount && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs font-bold z-10"
                  >
                    {discount}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images - Only show if there are multiple images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                      currentImageIndex === index
                        ? "border-purple-600 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      {!failedImages.has(index) ? (
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                          onError={() =>
                            setFailedImages((prev) => new Set([...prev, index]))
                          }
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rate)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.rate.toFixed(1)})
                  </span>
                </div>
                <div className="text-sm">
                  {product.quantity > 0 ? (
                    <span className="text-green-600 font-medium">
                      {product.quantity} in stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  {calculateTotalPrice().toLocaleString()} EGP
                </span>
                {product.discount_price &&
                  Object.keys(selectedAttributes).length === 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      {parseFloat(product.price).toLocaleString()} EGP
                    </span>
                  )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Base price:</span>
                  <span className="font-medium">
                    {product.discount_price
                      ? parseFloat(product.discount_price).toLocaleString()
                      : parseFloat(product.price).toLocaleString()}{" "}
                    EGP
                  </span>
                </div>

                {Object.entries(selectedAttributes).map(
                  ([attrName, attrValueId]) => {
                    const attr = product.product_attributes.find(
                      (a) => a.attribute_value_id === attrValueId
                    );
                    if (!attr || attr.price <= 0) return null;

                    return (
                      <div
                        key={attrName}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">
                          {attrName}: {attr.attribute_value.value}
                        </span>
                        <span className="font-medium text-purple-600">
                          +{attr.price.toLocaleString()} EGP
                        </span>
                      </div>
                    );
                  }
                )}

                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-lg">
                    {calculateTotalPrice().toLocaleString()} EGP
                  </span>
                </div>
              </div>

              {product.discount_price && (
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    You save{" "}
                    {(
                      parseFloat(product.price) -
                      parseFloat(product.discount_price)
                    ).toLocaleString()}{" "}
                    EGP
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Attributes */}
            {Object.keys(attributeGroups).length > 0 && (
              <div className="space-y-6">
                {/* Clear All Button */}
                {Object.keys(selectedAttributes).length > 0 && (
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Product Options
                    </h2>
                    <button
                      onClick={() => setSelectedAttributes({})}
                      className="text-sm text-red-600 hover:text-red-800 underline flex items-center space-x-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Clear All Selections</span>
                    </button>
                  </div>
                )}

                {Object.entries(attributeGroups).map(
                  ([attributeName, attributes]) => (
                    <div
                      key={attributeName}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Choose {attributeName}:
                        </h3>
                        <div className="flex items-center space-x-2">
                          {selectedAttributes[attributeName] && (
                            <span className="text-sm text-gray-600">
                              Selected:{" "}
                              {
                                attributes.find(
                                  (attr) =>
                                    attr.attribute_value_id ===
                                    selectedAttributes[attributeName]
                                )?.attribute_value.value
                              }
                            </span>
                          )}
                          {selectedAttributes[attributeName] && (
                            <button
                              onClick={() => {
                                setSelectedAttributes((prev) => {
                                  const newAttrs = { ...prev };
                                  delete newAttrs[attributeName];
                                  return newAttrs;
                                });
                              }}
                              className="text-xs text-purple-600 hover:text-purple-800 underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {attributes.map((attr) => {
                          const isSelected =
                            selectedAttributes[attributeName] ===
                            attr.attribute_value_id;
                          const hasPrice = attr.price > 0;

                          return (
                            <button
                              key={attr.id}
                              onClick={() => {
                                setSelectedAttributes((prev) => ({
                                  ...prev,
                                  [attributeName]: attr.attribute_value_id,
                                }));
                              }}
                              className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 ${
                                isSelected
                                  ? "border-purple-600 bg-purple-50 shadow-md"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                              }`}
                            >
                              {/* Color Preview for Color attributes */}
                              {attributeName.toLowerCase() === "color" && (
                                <div
                                  className={`w-8 h-8 rounded-full mx-auto mb-2 border-2 ${
                                    isSelected
                                      ? "border-purple-600"
                                      : "border-gray-300"
                                  }`}
                                  style={{
                                    backgroundColor: getColorValue(
                                      attr.attribute_value.value
                                    ),
                                  }}
                                />
                              )}

                              <div
                                className={`font-medium text-sm ${
                                  isSelected
                                    ? "text-purple-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {attr.attribute_value.value}
                              </div>

                              {hasPrice && (
                                <div
                                  className={`text-xs mt-1 ${
                                    isSelected
                                      ? "text-purple-700"
                                      : "text-gray-500"
                                  }`}
                                >
                                  +{attr.price.toLocaleString()} EGP
                                </div>
                              )}

                              {/* Selected indicator */}
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="p-2 hover:bg-gray-100 rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="p-2 hover:bg-gray-100 rounded-r-lg"
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={product.quantity <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.quantity > 0 ? "Buy Now" : "Out of Stock"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="p-3 border-2 border-gray-300 hover:bg-gray-50"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Free Delivery
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enter your postal code for Delivery Availability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-6 h-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Return Delivery
                      </h4>
                      <p className="text-sm text-gray-600">
                        Free 30 Days Delivery Returns. Details
                      </p>
                    </div>
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

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <Skeleton className="aspect-square w-full max-w-md mx-auto rounded-lg" />
            </div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <div className="flex space-x-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
