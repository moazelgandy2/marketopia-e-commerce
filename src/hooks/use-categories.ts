"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/actions/categories";

export const CATEGORIES_QUERY_KEY = "categories";

export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
  };

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: [CATEGORIES_QUERY_KEY],
      queryFn: getCategories,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    invalidateCategories,
    prefetchCategories,
  };
};
