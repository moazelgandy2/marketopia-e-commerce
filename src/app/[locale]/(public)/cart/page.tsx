"use client";

import {
  useCart,
  useDeleteCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/use-cart";
import { useValidateCoupon } from "@/hooks/use-coupons";
import { CartItem, CartProductAttributeValue } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  BellIcon,
  Tag,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { data: cartData, isLoading, error } = useCart();
  const deleteCartItemMutation = useDeleteCartItem();
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const validateCouponMutation = useValidateCoupon();

  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: string;
    discount_value: string;
  } | null>(null);

  const handleDeleteItem = async (cartItemId: number) => {
    try {
      await deleteCartItemMutation.mutateAsync(cartItemId);
      toast.custom(() => (
        <Alert
          variant="success"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>Item removed from cart successfully</AlertTitle>
        </Alert>
      ));
    } catch (error) {
      toast.custom(() => (
        <Alert
          variant="destructive"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>
            Failed to remove item from cart. Please try again.
          </AlertTitle>
        </Alert>
      ));
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await updateQuantityMutation.mutateAsync({
        cartItemId,
        quantity: newQuantity,
      });

      toast.custom(() => (
        <Alert
          variant="success"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>Quantity updated successfully</AlertTitle>
        </Alert>
      ));
    } catch (error) {
      toast.custom(() => (
        <Alert
          variant="destructive"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>Failed to update quantity</AlertTitle>
        </Alert>
      ));
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.custom(() => (
        <Alert
          variant="destructive"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>Please enter a coupon code</AlertTitle>
        </Alert>
      ));
      return;
    }

    try {
      // Validate the coupon
      const validationResult = await validateCouponMutation.mutateAsync(
        couponCode
      );

      if (validationResult.status) {
        setAppliedCoupon({
          code: validationResult.data.code,
          discount_type: validationResult.data.discount_type,
          discount_value: validationResult.data.discount_value,
        });
        setCouponCode("");

        // Create discount display text
        const discountText =
          validationResult.data.discount_type === "percentage"
            ? `${validationResult.data.discount_value}% off`
            : `${formatPrice(validationResult.data.discount_value)} off`;

        toast.custom(() => (
          <Alert
            variant="success"
            appearance="outline"
            close={true}
          >
            <AlertIcon>
              <CheckCircle />
            </AlertIcon>
            <AlertTitle>
              Coupon "{validationResult.data.code}" applied successfully!
              <span className="block text-sm font-normal text-green-700 mt-1">
                You get {discountText}
              </span>
            </AlertTitle>
          </Alert>
        ));
      }
    } catch (error: any) {
      toast.custom(() => (
        <Alert
          variant="destructive"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>{error.message || "Failed to apply coupon"}</AlertTitle>
        </Alert>
      ));
    }
  };

  // Calculate coupon discount
  const calculateCouponDiscount = () => {
    if (!appliedCoupon || !cartData?.data?.pricing) return 0;

    const subtotal = cartData.data.pricing.total_price;
    if (appliedCoupon.discount_type === "percentage") {
      return Math.min(
        subtotal * (parseFloat(appliedCoupon.discount_value) / 100),
        subtotal
      );
    } else {
      return Math.min(parseFloat(appliedCoupon.discount_value), subtotal);
    }
  };

  const couponDiscount = calculateCouponDiscount();
  const finalTotal = cartData?.data?.pricing
    ? cartData.data.pricing.total_price_after_discount - couponDiscount
    : 0;

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const getAttributesTotalPrice = (attributes: CartProductAttributeValue[]) => {
    return attributes.reduce((total, attr) => total + attr.price, 0);
  };

  const getItemTotalPrice = (item: CartItem) => {
    const basePrice = Number(item.product.discount_price || item.product.price);
    const attributesPrice = getAttributesTotalPrice(
      item.product_attribute_values
    );
    return (basePrice + attributesPrice) * item.quantity;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load cart. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!cartData?.data?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { items, pricing } = cartData.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.product.image}`}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deleteCartItemMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {item.product.description}
                    </p>

                    {/* Product Attributes */}
                    {item.product_attribute_values.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {item.product_attribute_values.map((attr) => (
                            <Badge
                              key={attr.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {attr.attribute_value.attribute.name}:{" "}
                              {attr.attribute_value.value}
                              {attr.price > 0 &&
                                ` (+${formatPrice(attr.price)})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price and Quantity */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-green-600">
                          {formatPrice(item.product.discount_price)}
                        </span>
                        {item.product.discount_price !== item.product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 || updatingItems.has(item.id)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 min-w-[2rem] text-center">
                          {updatingItems.has(item.id) ? "..." : item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updatingItems.has(item.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-2 text-right">
                      <span className="text-sm text-gray-600">
                        Item Total:{" "}
                        <span className="font-semibold">
                          {formatPrice(getItemTotalPrice(item))}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(pricing.total_price)}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Product Discount:</span>
                    <span>-{formatPrice(pricing.discount)}</span>
                  </div>
                )}

                {/* Coupon Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Discount Code</span>
                  </div>

                  {appliedCoupon || pricing.applied_coupon ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {appliedCoupon?.code ||
                              pricing.applied_coupon?.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAppliedCoupon(null);
                            // TODO: Add remove coupon API call
                          }}
                          className="text-green-600 hover:text-green-700 h-6 px-2"
                        >
                          Remove
                        </Button>
                      </div>

                      {(couponDiscount > 0 || pricing.coupon_discount) && (
                        <div className="flex justify-between text-green-600">
                          <span>Coupon Discount:</span>
                          <span>
                            -
                            {formatPrice(
                              couponDiscount || pricing.coupon_discount || 0
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="flex-1"
                        disabled={
                          appliedCoupon || validateCouponMutation.isPending
                        }
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={
                          !couponCode.trim() ||
                          appliedCoupon ||
                          validateCouponMutation.isPending
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {validateCouponMutation.isPending ? "..." : "Apply"}
                      </Button>
                    </div>
                  )}
                </div>

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>
                    {formatPrice(
                      finalTotal || pricing.total_price_after_discount
                    )}
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <Link
                  href="/products"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
