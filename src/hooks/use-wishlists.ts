import { getWishlists, deleteWishlistItem } from "@/actions/wishlists";
import { Wishlist } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "./use-auth";

export const useWishlists = () => {
  const { session } = useAuth();
  const t = useTranslations("errors");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const {
    data: wishlists,
    isPending: isWishlistsLoading,
    isError: isWishlistsError,
    error,
  } = useQuery<Wishlist[]>({
    queryKey: ["wishlists", session?.token, locale],
    queryFn: async () => {
      if (!session?.token) {
        return [];
      }
      const res = await getWishlists(session.token, locale as "en" | "ar");
      if (res.error) {
        throw new Error(t(res.error));
      }
      return res.data || [];
    },
    enabled: !!session?.token,
  });

  const {
    mutate: deleteItem,
    isPending: isDeleting,
    isError: isDeleteError,
  } = useMutation({
    mutationFn: (id: number) =>
      deleteWishlistItem(id, session?.token as string, locale as "en" | "ar"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });

  return {
    wishlists,
    isWishlistsLoading,
    isWishlistsError,
    error,
    deleteItem,
    isDeleting,
    isDeleteError,
  };
};
