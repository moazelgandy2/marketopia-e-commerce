"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useAddresses } from "@/hooks/use-addresses";
import { useConfigData } from "@/hooks/use-config";
import { useMutation } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Truck,
  Banknote,
  Wallet2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { CartItem, CartProductAttributeValue } from "@/types";

interface CheckoutData {
  address_id: number | null;
  payment_method: "cash" | "visa" | "wallet";
  area_id?: number | null;
  coupon_id: number | null;
  notes: string;
}

// Order submission function
const submitOrder = async (orderData: CheckoutData) => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
        "Accept-Language": "en",
      },
      body: JSON.stringify(orderData),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Failed to place order");
  }

  return response.json();
};

export default function CheckoutPage() {
  const { data: cartData, isLoading: isCartLoading } = useCart();
  const { addresses, isAddressesLoading } = useAddresses();
  const { config, cities, isLoading: isConfigLoading } = useConfigData();
  const router = useRouter();

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    address_id: null,
    payment_method: "cash",
    area_id: null,
    coupon_id: null,
    notes: "",
  });

  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  // Set coupon_id from cart data if available
  useEffect(() => {
    // For now, we'll use a default coupon_id if a coupon is applied
    // This should be updated when the API provides the actual coupon ID
    if (cartData?.data?.pricing?.applied_coupon?.code) {
      setCheckoutData((prev) => ({
        ...prev,
        coupon_id: 1, // Placeholder - should come from API
      }));
    }
  }, [cartData]);

  // Update selected city when address changes
  useEffect(() => {
    if (checkoutData.address_id && addresses) {
      const selectedAddress = addresses.find(
        (addr) => addr.id === checkoutData.address_id
      );
      if (selectedAddress) {
        setSelectedCityId(selectedAddress.city_id);
        // Reset area_id when city changes
        setCheckoutData((prev) => ({ ...prev, area_id: null }));
      }
    }
  }, [checkoutData.address_id, addresses]);

  const orderMutation = useMutation({
    mutationFn: submitOrder,
    onSuccess: (response) => {
      // Redirect to success page with order ID
      const orderId = response.data?.order_id;
      router.push(`/orders/success?order_id=${orderId}`);
    },
    onError: (error: any) => {
      toast.error("Failed to place order", {
        description: error.message || "Please try again later.",
      });
    },
  });

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

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!checkoutData.address_id) {
      toast.error("Please select a delivery address");
      return;
    }

    // Check if area selection is required
    if (
      config?.deliveryman &&
      config?.delivery_fee_type === "area" &&
      !checkoutData.area_id
    ) {
      toast.error("Please select a delivery area");
      return;
    }

    // Log the data being sent (for debugging)
    console.log("Submitting order data:", checkoutData);

    orderMutation.mutate(checkoutData);
  };

  if (isCartLoading || isAddressesLoading || isConfigLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
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
            Add some items to your cart before checkout.
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
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses && addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          checkoutData.address_id === address.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setCheckoutData((prev) => ({
                            ...prev,
                            address_id: address.id,
                          }))
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.is_default && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {address.city?.name}
                            </p>
                          </div>
                          {checkoutData.address_id === address.id && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}

                    <Link href="/profile?tab=addresses">
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        + Add New Address
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <Link href="/profile?tab=addresses">
                      <Button>Add Delivery Address</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Area - Only show if deliveryman is enabled and fee type is area */}
            {config?.deliveryman &&
              config?.delivery_fee_type === "area" &&
              selectedCityId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Select the delivery area for fee calculation
                      </p>

                      <Select
                        value={checkoutData.area_id?.toString() || ""}
                        onValueChange={(value) =>
                          setCheckoutData((prev) => ({
                            ...prev,
                            area_id: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery area" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities
                            .find((city) => city.id === selectedCityId)
                            ?.areas?.map((area) => (
                              <SelectItem
                                key={area.id}
                                value={area.id.toString()}
                              >
                                <div className="flex justify-between w-full">
                                  <span>{area.name}</span>
                                  <span className="ml-4 text-green-600">
                                    +{formatPrice(area.price)}
                                  </span>
                                </div>
                              </SelectItem>
                            )) || (
                            <SelectItem
                              value=""
                              disabled
                            >
                              No areas available for this city
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                      {checkoutData.area_id && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Area selected:{" "}
                              {
                                cities
                                  .find((city) => city.id === selectedCityId)
                                  ?.areas?.find(
                                    (area) => area.id === checkoutData.area_id
                                  )?.name
                              }
                            </span>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            Delivery fee:{" "}
                            {formatPrice(
                              cities
                                .find((city) => city.id === selectedCityId)
                                ?.areas?.find(
                                  (area) => area.id === checkoutData.area_id
                                )?.price || 0
                            )}
                          </p>
                        </div>
                      )}
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
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      checkoutData.payment_method === "cash"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setCheckoutData((prev) => ({
                        ...prev,
                        payment_method: "cash",
                      }))
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Banknote className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium">Cash on Delivery</h3>
                          <p className="text-sm text-gray-500">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                      {checkoutData.payment_method === "cash" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      checkoutData.payment_method === "visa"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setCheckoutData((prev) => ({
                        ...prev,
                        payment_method: "visa",
                      }))
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-500">
                            Pay securely with your card
                          </p>
                        </div>
                      </div>
                      {checkoutData.payment_method === "visa" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      checkoutData.payment_method === "wallet"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setCheckoutData((prev) => ({
                        ...prev,
                        payment_method: "wallet",
                      }))
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet2 className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium">Digital Wallet</h3>
                          <p className="text-sm text-gray-500">
                            Pay with your digital wallet
                          </p>
                        </div>
                      </div>
                      {checkoutData.payment_method === "wallet" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special instructions for your order..."
                  value={checkoutData.notes}
                  onChange={(e) =>
                    setCheckoutData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-3 border-b last:border-0"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.product.image}`}
                          alt={item.product.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {item.product.name}
                          </h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-medium">
                              {formatPrice(getItemTotalPrice(item))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 pt-4 border-t">
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

                    {pricing.coupon_discount && pricing.coupon_discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount:</span>
                        <span>-{formatPrice(pricing.coupon_discount)}</span>
                      </div>
                    )}

                    {checkoutData.coupon_id && (
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Coupon Applied
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      {config?.deliveryman &&
                      config?.delivery_fee_type === "area" &&
                      checkoutData.area_id ? (
                        <span className="text-blue-600">
                          +
                          {formatPrice(
                            cities
                              .find((city) => city.id === selectedCityId)
                              ?.areas?.find(
                                (area) => area.id === checkoutData.area_id
                              )?.price || 0
                          )}
                        </span>
                      ) : (
                        <span className="text-green-600">Free</span>
                      )}
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>
                        {formatPrice(
                          pricing.total_price_after_discount +
                            (config?.deliveryman &&
                            config?.delivery_fee_type === "area" &&
                            checkoutData.area_id
                              ? cities
                                  .find((city) => city.id === selectedCityId)
                                  ?.areas?.find(
                                    (area) => area.id === checkoutData.area_id
                                  )?.price || 0
                              : 0)
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmitOrder}
                    disabled={
                      orderMutation.isPending ||
                      !checkoutData.address_id ||
                      (config?.deliveryman &&
                        config?.delivery_fee_type === "area" &&
                        !checkoutData.area_id)
                    }
                  >
                    {orderMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing Order...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Place Order
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By placing your order, you agree to our Terms & Conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
