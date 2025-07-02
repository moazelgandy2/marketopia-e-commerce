"use server";

import { Brand, BrandsApiResponse } from "@/types";

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/home/brands`,
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

    const data: BrandsApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch brands");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch brands"
    );
  }
}
