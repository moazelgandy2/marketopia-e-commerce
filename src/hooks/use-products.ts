"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProductsByCategory,
  getProducts,
  getProductById,
} from "@/actions/products";

export const PRODUCTS_BY_CATEGORY_QUERY_KEY = "products-by-category";
export const PRODUCTS_QUERY_KEY = "products";
export const PRODUCT_BY_ID_QUERY_KEY = "product-by-id";

export const useProductsByCategory = (
  categoryId: number,
  page: number = 1,
  lang: string
) => {
  return useQuery({
    queryKey: [PRODUCTS_BY_CATEGORY_QUERY_KEY, categoryId, page],
    queryFn: () => getProductsByCategory(categoryId, page, lang),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!categoryId,
  });
};

export const useProducts = (
  search: string = "",
  page: number = 1,
  perPage: number = 6,
  lang: string
) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, search, page, perPage],
    queryFn: () => getProducts(search, page, perPage, lang),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProductById = (id: string, lang: string = "en") => {
  return useQuery({
    queryKey: [PRODUCT_BY_ID_QUERY_KEY, id, lang],
    queryFn: () => getProductById(id, lang),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};
