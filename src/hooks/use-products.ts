"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/actions/products";

export const PRODUCTS_BY_CATEGORY_QUERY_KEY = "products-by-category";

export const useProductsByCategory = (categoryId: number, page: number = 1) => {
  return useQuery({
    queryKey: [PRODUCTS_BY_CATEGORY_QUERY_KEY, categoryId, page],
    queryFn: () => getProductsByCategory(categoryId, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!categoryId,
  });
};
