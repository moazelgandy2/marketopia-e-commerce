export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  popular: number;
  parent_id: number | null;
  children?: Category[];
}

export interface CategoriesApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: Category[];
}

export interface PaginatedCategoriesApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: {
    current_page: number;
    data: Category[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface CategoryWithChildrenApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: Category;
}
