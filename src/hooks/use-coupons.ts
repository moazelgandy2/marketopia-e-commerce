import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validateCoupon, applyCouponToCart } from "@/actions";
import { CouponApiResponse, ApplyCouponResponse } from "@/types";
import { useLocale } from "next-intl";

export const useValidateCoupon = () => {
  const locale = useLocale();

  return useMutation<CouponApiResponse, Error, string>({
    mutationFn: (couponCode: string) => validateCoupon(couponCode, locale),
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation<ApplyCouponResponse, Error, string>({
    mutationFn: (couponCode: string) => applyCouponToCart(couponCode, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
