"use server";

import {
  Category,
  CategoriesApiResponse,
  PaginatedCategoriesApiResponse,
  CategoryWithChildrenApiResponse,
} from "@/types";

export async function getCategories(lang: string): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/home/categories?lang=${lang}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoriesApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch categories"
    );
  }
}

export async function getParentCategories(
  page: number = 1,
  lang: string
): Promise<{
  categories: Category[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/parent?page=${page}&lang=${lang}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PaginatedCategoriesApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch parent categories");
    }

    return {
      categories: data.data.data,
      pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
        from: data.data.from,
        to: data.data.to,
      },
    };
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch parent categories"
    );
  }
}

export async function getCategoryWithChildren(
  categoryId: number,
  lang: string
): Promise<Category> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/children/${categoryId}?lang=${lang}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoryWithChildrenApiResponse = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch category with children");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching category with children:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch category with children"
    );
  }
}
