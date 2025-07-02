"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanners } from "@/actions/banners";
import { getBrands } from "@/actions/brands";

export const BRANDS_QUERY_KEY = "brands";

export const useBrands = () => {
  return useQuery({
    queryKey: [BRANDS_QUERY_KEY],
    queryFn: getBrands,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();

  const invalidateBrands = () => {
    queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
  };

  const prefetchBrands = () => {
    queryClient.prefetchQuery({
      queryKey: [BRANDS_QUERY_KEY],
      queryFn: getBanners,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    invalidateBrands,
    prefetchBrands,
  };
};
