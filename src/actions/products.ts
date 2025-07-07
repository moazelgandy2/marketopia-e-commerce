"use server";

import { PaginatedProductsApiResponse } from "@/types/product";

export async function getProductsByCategory(
  categoryId: number,
  page: number = 1
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${categoryId}?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PaginatedProductsApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
}
