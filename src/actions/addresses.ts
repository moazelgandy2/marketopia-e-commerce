import { Address } from "../types";
import { ActionResponse } from "./orders";

export const getAddresses = async (
  token: string,
  lang: string
): Promise<ActionResponse<Address[]>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses?lang=${lang}`,
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
  lang: string,
  addressData: SaveAddressData
): Promise<ActionResponse<Address>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses?lang=${lang}`,
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
  lang: string,
  addressId: number
): Promise<ActionResponse<null>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}?lang=${lang}`,
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
  lang: string,
  addressId: number,
  addressData: SaveAddressData
): Promise<ActionResponse<Address>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}?lang=${lang}`,
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
