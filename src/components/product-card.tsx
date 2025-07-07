"use client";
import { Product } from "@/types/product";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.discount_price &&
    (
      ((parseFloat(product.price) - parseFloat(product.discount_price)) /
        parseFloat(product.price)) *
      100
    ).toFixed(0);

  return (
    <Card className="group relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <Link
        className="block"
        href={`/products/${product.id}`}
      >
        <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl">
          {discount && (
            <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-bold">
              {discount}%<div className="text-[10px] font-normal">OFF</div>
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
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex flex-col gap-1">
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
            {product.discount_price && (
              <p className="text-xs font-medium text-green-600">
                Save -{" "}
                {(
                  parseFloat(product.price) - parseFloat(product.discount_price)
                ).toLocaleString()}{" "}
                EGP
              </p>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
