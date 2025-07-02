"use server";

import { Category, CategoriesApiResponse } from "@/types";

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/home/categories`,
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

    const data: CategoriesApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch categories"
    );
  }
}
