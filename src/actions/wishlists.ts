import { getLocale } from "next-intl/server";
import { Wishlist } from "../types";
import { ActionResponse } from "./orders";

export const getWishlists = async (
  token: string,
  lang: "en" | "ar"
): Promise<ActionResponse<Wishlist[]>> => {
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists?lang=${locale}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.message || "Something went wrong",
      data: null,
      status: response.status,
    };
  }
  return {
    error: null,
    data: data.data,
    status: response.status,
  };
};

export const deleteWishlistItem = async (
  id: number,
  token: string,
  lang: "en" | "ar"
) => {
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${id}?lang=${locale}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.message || "Something went wrong",
      data: null,
      status: response.status,
    };
  }
  return {
    error: null,
    data: data.data,
    status: response.status,
  };
};
