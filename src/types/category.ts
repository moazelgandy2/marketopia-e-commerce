export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  popular: number;
  parent_id: number | null;
}

export interface CategoriesApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: Category[];
}
