"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductById } from "@/hooks/use-products";
import { OrderItemType } from "@/types/order";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const OrderItem = ({
  item,
  formatPrice,
}: {
  item: OrderItemType;
  formatPrice: (price: string | number) => string;
}) => {
  const t = useTranslations("OrderDetails.items");
  const params = useParams();
  const locale = params.locale as string;
  const { data: productData, isLoading: isProductLoading } = useProductById(
    item.product_id.toString(),
    locale
  );

  const getImageUrl = () => {
    if (productData?.images && productData.images.length > 0) {
      const firstImage = productData.images[0].image;
      if (firstImage.startsWith("http")) {
        return firstImage;
      }
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${firstImage}`;
    }
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
          {productData?.name || t("unknownProduct")}
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
