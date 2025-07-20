import { getOrders } from "@/actions";
import { OrderType } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "./use-auth";

export const useOrders = () => {
  const {session} = useAuth();
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
