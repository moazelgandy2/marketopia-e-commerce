"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanners } from "@/actions/banners";

export const BANNERS_QUERY_KEY = "banners";

export const useBanners = () => {
  return useQuery({
    queryKey: [BANNERS_QUERY_KEY],
    queryFn: getBanners,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();

  const invalidateBanners = () => {
    queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
  };

  const prefetchBanners = () => {
    queryClient.prefetchQuery({
      queryKey: [BANNERS_QUERY_KEY],
      queryFn: getBanners,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    invalidateBanners,
    prefetchBanners,
  };
};
