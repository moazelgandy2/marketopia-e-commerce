"use server";

import {
  PaginatedProductsApiResponse,
  ProductDetailApiResponse,
} from "@/types/product";

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

export async function getProducts(
  search: string = "",
  page: number = 1,
  perPage: number = 6
) {
  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (search) {
      searchParams.append("search", search);
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/products?${searchParams.toString()}`,
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

export async function getProductById(id: string, lang: string = "en") {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}?lang=${lang}`;
    console.log("Fetching product from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Product API response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductDetailApiResponse = await response.json();
    console.log("Product API response data:", data);

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch product");
    }

    console.log("Returning product data:", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch product"
    );
  }
}
