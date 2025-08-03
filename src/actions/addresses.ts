import { getLocale } from "next-intl/server";
import { Address } from "../types";
import { ActionResponse } from "./orders";

export const getAddresses = async (
  token: string,
  lang: "en" | "ar"
): Promise<ActionResponse<Address[]>> => {
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses?lang=${locale}`,
    {
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

export interface SaveAddressData {
  name: string;
  address: string;
  phone: string;
  lat: string;
  lng: string;
  is_default: number;
  city_id: number;
}

export const saveAddress = async (
  token: string,
  lang: "en" | "ar",
  addressData: SaveAddressData
): Promise<ActionResponse<Address>> => {
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses?lang=${locale}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
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

export const deleteAddress = async (
  token: string,
  lang: "en" | "ar",
  addressId: number
): Promise<ActionResponse<null>> => {
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}?lang=${locale}`,
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
    data: null,
    status: response.status,
  };
};

export const updateAddress = async (
  token: string,
  lang: "en" | "ar",
  addressId: number,
  addressData: SaveAddressData
): Promise<ActionResponse<Address>> => {
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}?lang=${locale}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
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
