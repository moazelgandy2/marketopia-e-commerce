"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getParentCategories,
  getCategoryWithChildren,
} from "@/actions/categories";

export const CATEGORIES_QUERY_KEY = "categories";
export const PARENT_CATEGORIES_QUERY_KEY = "parent-categories";
export const CATEGORY_WITH_CHILDREN_QUERY_KEY = "category-with-children";

export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useParentCategories = (page: number = 1) => {
  return useQuery({
    queryKey: [PARENT_CATEGORIES_QUERY_KEY, page],
    queryFn: () => getParentCategories(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategoryWithChildren = (categoryId: number) => {
  return useQuery({
    queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
    queryFn: () => getCategoryWithChildren(categoryId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!categoryId,
  });
};

export const useCategoryWithChildrenOnHover = (
  categoryId: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
    queryFn: () => getCategoryWithChildren(categoryId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: enabled && !!categoryId,
  });
};

export const useCategoriesQueryClient = () => {
  const queryClient = useQueryClient();

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
      queryFn: getCategories,
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchParentCategories = (page: number = 1) => {
    queryClient.prefetchQuery({
      queryKey: [PARENT_CATEGORIES_QUERY_KEY, page],
      queryFn: () => getParentCategories(page),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchCategoryWithChildren = (categoryId: number) => {
    queryClient.prefetchQuery({
      queryKey: [CATEGORY_WITH_CHILDREN_QUERY_KEY, categoryId],
      queryFn: () => getCategoryWithChildren(categoryId),
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
