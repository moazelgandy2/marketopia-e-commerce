import { getAddresses } from "@/actions";
import { Address } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "./use-auth";

export const useAddresses = () => {
  const session = useAuth();
  const t = useTranslations("errors");
  const locale = useLocale();
  const {
    data: addresses,
    isPending: isAddressesLoading,
    isError: isAddressesError,
    error,
  } = useQuery<Address[]>({
    queryKey: ["addresses", session?.token, locale],
    queryFn: async () => {
      if (!session?.token) {
        return [];
      }
      const res = await getAddresses(session.token, locale as "en" | "ar");
      if (res.error) {
        throw new Error(t(res.error));
      }
      return res.data || [];
    },
    enabled: !!session?.token,
  });

  return { addresses, isAddressesLoading, isAddressesError, error };
};
