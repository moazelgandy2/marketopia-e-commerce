"use client";
import { Product } from "@/types/product";
import Image from "next/image";

import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  useAddToCart,
  useCart,
  useUpdateCartItemQuantity,
} from "@/hooks/use-cart";
import { getProductById } from "@/actions/products";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("ProductCard");
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItemQuantity();
  const { data: cartData } = useCart();
  const locale = useLocale();

  const discount =
    product.discount_price &&
    (
      ((parseFloat(product.price) - parseFloat(product.discount_price)) /
        parseFloat(product.price)) *
      100
    ).toFixed(0);

  const getExistingCartItemSimple = () => {
    if (!cartData?.data?.items) return null;

    return cartData.data.items.find((cartItem) => {
      return cartItem.product_id === product.id;
    });
  };

  const getExistingCartItem = (defaultAttributeValues: number[]) => {
    if (!cartData?.data?.items) return null;

    return cartData.data.items.find((cartItem) => {
      if (cartItem.product_id !== product.id) return false;

      const cartItemAttributeIds =
        cartItem.product_attribute_values?.map((attr) => attr.id) || [];

      if (defaultAttributeValues.length !== cartItemAttributeIds.length)
        return false;

      return defaultAttributeValues.every((attrId) =>
        cartItemAttributeIds.includes(attrId)
      );
    });
  };

  const existingCartItemSimple = getExistingCartItemSimple();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const productDetails = await getProductById(
        product.id.toString(),
        locale
      );

      const defaultAttributeValues: number[] = [];
      if (
        productDetails.product_attributes &&
        productDetails.product_attributes.length > 0
      ) {
        const attributeGroups = productDetails.product_attributes.reduce(
          (groups, attr) => {
            const attributeId = attr.id;
            if (!groups[attributeId]) {
              groups[attributeId] = [];
            }
            groups[attributeId].push(attr);
            return groups;
          },
          {} as Record<number, typeof productDetails.product_attributes>
        );

        Object.values(attributeGroups).forEach((group) => {
          if (group && group.length > 0) {
            defaultAttributeValues.push(group[0].id);
          }
        });
      }

      const existingCartItem = getExistingCartItem(defaultAttributeValues);

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + 1;

        if (newQuantity > product.quantity) {
          toast.error(t("toasts.cannotAdd"), {
            description: t("toasts.onlyAvailable", {
              available: product.quantity,
              inCart: existingCartItem.quantity,
            }),
          });
          return;
        }

        await updateCartItemMutation.mutateAsync({
          cartItemId: existingCartItem.id,
          quantity: newQuantity,
        });

        toast.success(t("toasts.cartUpdated"), {
          description: t("toasts.quantityUpdated", {
            productName: product.name,
            quantity: newQuantity,
            plural: newQuantity > 1 ? "s" : "",
          }),
        });
      } else {
        console.log("Sending to cart:", {
          productId: product.id,
          quantity: 1,
          product_attribute_value_ids: defaultAttributeValues,
        });

        await addToCartMutation.mutateAsync({
          productId: product.id,
          quantity: 1,
          product_attribute_value_ids: defaultAttributeValues,
        });

        toast.success(t("toasts.productAdded"), {
          description: t("toasts.addedToCart", { productName: product.name }),
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(t("toasts.addFailed"), {
        description:
          error instanceof Error ? error.message : t("toasts.tryAgain"),
      });
    }
  };

  return (
    <Card className="group relative w-full h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <Link
        className="flex-1 flex flex-col"
        href={`/products/${product.id}`}
      >
        <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl">
          {discount && (
            <div className="absolute top-3 left-3 z-10 bg-slate-600 text-white px-2 py-1 rounded-md text-xs font-bold">
              {discount}%
              <div className="text-[10px] font-normal">{t("discount")}</div>
            </div>
          )}
          {existingCartItemSimple && (
            <div className="absolute top-3 right-3 z-10 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              {existingCartItemSimple.quantity}
            </div>
          )}
          <Image
            alt={product.name}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            height={300}
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
            width={300}
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight h-10 mb-2">
            {product.name}
          </h3>
          <div className="flex flex-col gap-1 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {product.discount_price
                  ? `${parseFloat(product.discount_price).toLocaleString()} EGP`
                  : `${parseFloat(product.price).toLocaleString()} EGP`}
              </span>
              {product.discount_price && (
                <span className="text-sm text-gray-400 line-through">
                  {parseFloat(product.price).toLocaleString()} EGP
                </span>
              )}
            </div>
            <div className="h-4">
              {product.discount_price && (
                <p className="text-xs font-medium text-green-600">
                  {t("save")} -{" "}
                  {(
                    parseFloat(product.price) -
                    parseFloat(product.discount_price)
                  ).toLocaleString()}{" "}
                  EGP
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          onClick={handleAddToCart}
          disabled={
            addToCartMutation.isPending ||
            updateCartItemMutation.isPending ||
            product.quantity <= 0
          }
          className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {addToCartMutation.isPending || updateCartItemMutation.isPending
              ? existingCartItemSimple
                ? t("updating")
                : t("adding")
              : product.quantity <= 0
              ? t("outOfStock")
              : existingCartItemSimple
              ? `${t("updateCart")} (${existingCartItemSimple.quantity} ${t(
                  "inCart"
                )})`
              : t("addToCart")}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
