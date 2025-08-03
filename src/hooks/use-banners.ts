"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanners } from "@/actions/banners";
import { useLocale } from "next-intl";

export const BANNERS_QUERY_KEY = "banners";

export const useBanners = () => {
  const locale = useLocale();

  return useQuery({
    queryKey: [BANNERS_QUERY_KEY],
    queryFn: () => getBanners(locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const invalidateBanners = () => {
    queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
  };

  const prefetchBanners = () => {
    queryClient.prefetchQuery({
      queryKey: [BANNERS_QUERY_KEY],
      queryFn: () => getBanners(locale),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    invalidateBanners,
    prefetchBanners,
  };
};
