"use server";

import { CartApiResponse, DeleteCartItemResponse } from "@/types";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCart = async (
  lang: string = "en"
): Promise<CartApiResponse> => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Authentication required");
  }
  const locale = await getLocale();

  const response = await fetch(`${API_BASE_URL}/api/carts?lang=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
};

export const deleteCartItem = async (
  cartItemId: number
): Promise<DeleteCartItemResponse> => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Authentication required");
  }
  const locale = await getLocale();

  const response = await fetch(
    `${API_BASE_URL}/api/carts/${cartItemId}?lang=${locale}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete cart item");
  }

  return response.json();
};

export const addToCart = async (
  productId: number,
  quantity: number = 1,
  product_attribute_value_ids: number[] = [],
  lang: string = "en"
): Promise<CartApiResponse> => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Authentication required");
  }
  const locale = await getLocale();

  const response = await fetch(`${API_BASE_URL}/api/carts?lang=${locale}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity,
      product_attribute_value_ids: product_attribute_value_ids,
    }),
  });
  console.log("req=>", productId, quantity, product_attribute_value_ids, lang);

  const data = await response.json();

  console.log("data=>", data);

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return data;
};

export const updateCartItemQuantity = async (
  cartItemId: number,
  quantity: number,
  lang: string = "en"
): Promise<CartApiResponse> => {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Authentication required");
  }
  const locale = await getLocale();

  const response = await fetch(
    `${API_BASE_URL}/api/carts/${cartItemId}?lang=${locale}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ quantity }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update cart item quantity");
  }

  return response.json();
};
