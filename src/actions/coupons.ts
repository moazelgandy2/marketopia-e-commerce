"use server";

import { CouponApiResponse, ApplyCouponResponse } from "@/types";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const validateCoupon = async (
  couponCode: string,
  lang: string = "en"
): Promise<CouponApiResponse> => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Authentication required");
  }
  const locale = await getLocale();

  const response = await fetch(
    `${API_BASE_URL}/api/coupons/${couponCode}?lang=${locale}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    }
  );
  const data = await response.json();

  console.log("Coupon validation response:", data);

  if (!response.ok) {
    throw new Error("Invalid or expired coupon code");
  }

  if (!data.status) {
    throw new Error(data.message || "Invalid coupon code");
  }

  return data;
};

export const applyCouponToCart = async (
  couponCode: string,
  lang: string = "en"
): Promise<ApplyCouponResponse> => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Authentication required");
  }
  const locale = await getLocale();

  const response = await fetch(
    `${API_BASE_URL}/api/coupons/${couponCode}?lang=${locale}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  // Check if the response is JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error(
      "Non-JSON response received:",
      response.status,
      response.statusText
    );
    throw new Error("Invalid API endpoint - received HTML instead of JSON");
  }

  const data = await response.json();

  console.log("Apply coupon response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to apply coupon");
  }

  return data;
};
