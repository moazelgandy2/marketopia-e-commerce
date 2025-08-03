"use server";

import { Banner, BannersApiResponse } from "@/types";

export async function getBanners(lang: string): Promise<Banner[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/home/banners?lang=${lang}`,
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

    const data: BannersApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch banners");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch banners"
    );
  }
}
