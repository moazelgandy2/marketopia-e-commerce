import { OrderType } from "../types/order";

export interface ActionResponse<T> {
  error: string | null;
  data: T | null;
  status: number;
}
export const getOrders = async (
  token: string,
  lang: "en" | "ar"
): Promise<ActionResponse<OrderType[]>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
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
    data: data.data.data,
    status: response.status,
  };
};
