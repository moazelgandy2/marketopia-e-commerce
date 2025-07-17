import { Address } from "../types";
import { ActionResponse } from "./orders";

export const getAddresses = async (
  token: string,
  lang: "en" | "ar"
): Promise<ActionResponse<Address[]>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
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
