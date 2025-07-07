export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string;
  quantity: number;
  status: string;
  category_id: number;
  brand_id: number;
  image: string;
  rate: number;
}

export interface PaginatedProductsApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: {
    current_page: number;
    data: Product[];
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
