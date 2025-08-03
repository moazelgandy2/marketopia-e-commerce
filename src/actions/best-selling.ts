"use server";

import { BestSelling, BestSellingApiResponse } from "@/types";
import { getLocale } from "next-intl/server";

export async function getBestSelling(): Promise<BestSelling[]> {
  try {
    const locale = await getLocale();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/home/products?lang=${locale}`,
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

    const data: BestSellingApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch best selling products");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch best selling products"
    );
  }
}
