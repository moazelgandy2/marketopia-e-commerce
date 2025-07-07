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
    <Card className="group relative w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-950">
      <Link
        className="block"
        href="#"
      >
        <div className="relative overflow-hidden">
          {discount && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 z-10"
            >
              {discount}% OFF
            </Badge>
          )}
          <Image
            alt={product.name}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            height={400}
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
            width={400}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold md:text-xl">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold md:text-xl">
              {product.discount_price
                ? `${product.discount_price} EGP`
                : `${product.price} EGP`}
            </span>
            {product.discount_price && (
              <span className="text-base text-gray-500 line-through dark:text-gray-400">
                {product.price} EGP
              </span>
            )}
          </div>
          {product.discount_price && (
            <p className="mt-1 text-sm font-medium text-green-600">
              Save -{" "}
              {parseFloat(product.price) - parseFloat(product.discount_price)}{" "}
              EGP
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
}
