import { getOrders, getOrderById } from "@/actions";
import { OrderType } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "./use-auth";

export const useOrders = () => {
  const { session } = useAuth();
  const t = useTranslations("errors");
  const locale = useLocale();
  const {
    data: orders,
    isPending: isOrdersLoading,
    isError: isOrdersError,
    error,
  } = useQuery<OrderType[]>({
    queryKey: ["orders", session?.token, locale],
    queryFn: async () => {
      if (!session?.token) {
        return [];
      }
      const res = await getOrders(session.token, locale as "en" | "ar");
      if (res.error) {
        throw new Error(t(res.error));
      }
      return res.data || [];
    },
    enabled: !!session?.token,
  });

  return { orders, isOrdersLoading, isOrdersError, error };
};

export const useOrder = (orderId: string) => {
  const { session } = useAuth();
  const t = useTranslations("errors");
  const locale = useLocale();

  const {
    data: order,
    isPending: isOrderLoading,
    isError: isOrderError,
    error,
  } = useQuery<OrderType>({
    queryKey: ["order", orderId, session?.token, locale],
    queryFn: async () => {
      if (!session?.token) {
        throw new Error("No authentication token");
      }
      const res = await getOrderById(
        orderId,
        session.token,
        locale as "en" | "ar"
      );
      if (res.error) {
        throw new Error(res.error);
      }
      if (!res.data) {
        throw new Error("Order not found");
      }
      return res.data;
    },
    enabled: !!session?.token && !!orderId && orderId !== "current",
    retry: 1,
  });

  return { order, isOrderLoading, isOrderError, error };
};
