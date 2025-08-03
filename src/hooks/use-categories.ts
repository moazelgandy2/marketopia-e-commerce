"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getParentCategories,
  getCategoryWithChildren,
} from "@/actions/categories";
import { useLocale } from "next-intl";

export const CATEGORIES_QUERY_KEY = "categories";
export const PARENT_CATEGORIES_QUERY_KEY = "parent-categories";
export const CATEGORY_WITH_CHILDREN_QUERY_KEY = "category-with-children";

export const useCategories = () => {
  const locale = useLocale();

  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => getCategories(locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useParentCategories = (page: number = 1) => {
  const locale = useLocale();

  return useQuery({
    queryKey: [PARENT_CATEGORIES_QUERY_KEY, page],
    queryFn: () => getParentCategories(page, locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoryWithChildren = (categoryId: number) => {
  const locale = useLocale();

  return useQuery({
    queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
    queryFn: () => getCategoryWithChildren(categoryId, locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!categoryId,
  });
};

export const useCategoryWithChildrenOnHover = (
  categoryId: number,
  enabled: boolean = false
) => {
  const locale = useLocale();

  return useQuery({
    queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
    queryFn: () => getCategoryWithChildren(categoryId, locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: enabled && !!categoryId,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();
  const locale = useLocale();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
  };

  const invalidateParentCategories = () => {
    queryClient.invalidateQueries({ queryKey: [PARENT_CATEGORIES_QUERY_KEY] });
  };

  const invalidateCategoryWithChildren = (categoryId?: number) => {
    if (categoryId) {
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY],
      });
    }
  };

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: [CATEGORIES_QUERY_KEY],
      queryFn: () => getCategories(locale),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchParentCategories = (page: number = 1) => {
    queryClient.prefetchQuery({
      queryKey: [PARENT_CATEGORIES_QUERY_KEY, page],
      queryFn: () => getParentCategories(page, locale),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchCategoryWithChildren = (categoryId: number) => {
    queryClient.prefetchQuery({
      queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
      queryFn: () => getCategoryWithChildren(categoryId, locale),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    invalidateCategories,
    invalidateParentCategories,
    invalidateCategoryWithChildren,
    prefetchCategories,
    prefetchParentCategories,
    prefetchCategoryWithChildren,
  };
};
