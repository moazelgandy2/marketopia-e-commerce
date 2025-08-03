"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanners } from "@/actions/banners";
import { getBestSelling } from "@/actions/best-selling";
import { useLocale } from "next-intl";

export const BEST_SELLING_QUERY_KEY = "best-selling";

export const useBestSelling = () => {
  const locale = useLocale();

  return useQuery({
    queryKey: [BEST_SELLING_QUERY_KEY],
    queryFn: () => getBestSelling(locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();

  const invalidateBestSelling = () => {
    queryClient.invalidateQueries({ queryKey: [BEST_SELLING_QUERY_KEY] });
  };

  const prefetchBestSelling = () => {
    queryClient.prefetchQuery({
      queryKey: [BEST_SELLING_QUERY_KEY],
      queryFn: () => getBestSelling(locale),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    invalidateBestSelling,
    prefetchBestSelling,
  };
};
