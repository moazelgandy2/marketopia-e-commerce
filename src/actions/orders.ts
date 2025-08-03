import { getLocale } from "next-intl/server";
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
  const locale = await getLocale();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders?lang=${locale}`,
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
    data: data.data.data,
    status: response.status,
  };
};

export const getOrderById = async (
  orderId: string,
  token: string,
  lang: "en" | "ar"
): Promise<ActionResponse<OrderType>> => {
  try {
    const locale = await getLocale();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}?lang=${locale}`,
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

    // Handle the response structure - if API returns array, find specific order
    let orderData: OrderType | null = null;

    if (data.data?.data && Array.isArray(data.data.data)) {
      // If it's an array, find the specific order
      orderData = data.data.data.find(
        (order: OrderType) => order.id.toString() === orderId
      );
    } else if (data.data?.data && !Array.isArray(data.data.data)) {
      // If it's a single object
      orderData = data.data.data;
    } else if (data.data && !data.data.data) {
      // If the order is directly in data
      orderData = data.data;
    }

    if (!orderData) {
      return {
        error: "Order not found",
        data: null,
        status: 404,
      };
    }

    return {
      error: null,
      data: orderData,
      status: response.status,
    };
  } catch (error) {
    return {
      error: "Network error or server unavailable",
      data: null,
      status: 500,
    };
  }
};
