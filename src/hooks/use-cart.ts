import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  deleteCartItem,
  updateCartItemQuantity,
  addToCart,
} from "@/actions";
import { CartApiResponse, DeleteCartItemResponse } from "@/types";
import { useLocale } from "next-intl";

export const useCart = () => {
  const locale = useLocale();

  return useQuery<CartApiResponse>({
    queryKey: ["cart", locale],
    queryFn: () => getCart(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCartItemResponse, Error, number>({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      // Invalidate and refetch cart data after successful deletion
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation<
    CartApiResponse,
    Error,
    { cartItemId: number; quantity: number }
  >({
    mutationFn: ({ cartItemId, quantity }) =>
      updateCartItemQuantity(cartItemId, quantity, locale),
    onSuccess: () => {
      // Invalidate and refetch cart data after successful update
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation<
    CartApiResponse,
    Error,
    { productId: number; quantity?: number; attributeValues?: number[] }
  >({
    mutationFn: ({ productId, quantity = 1, attributeValues = [] }) =>
      addToCart(productId, quantity, attributeValues, locale),
    onSuccess: () => {
      // Invalidate and refetch cart data after successful addition
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
