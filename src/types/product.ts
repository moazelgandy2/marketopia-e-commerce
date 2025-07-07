export interface ProductAttribute {
  id: number;
  product_id: number;
  attribute_value_id: number;
  price: number;
  created_at: string;
  updated_at: string;
  attribute_value: {
    id: number;
    attribute_id: number;
    value: string;
    attribute: {
      id: number;
      name: string;
    };
  };
}

export interface ProductImage {
  id: number;
  image: string;
  product_id: number;
  created_at: string;
  updated_at: string;
}

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
  product_attributes?: ProductAttribute[];
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

export interface ProductWithAttributes extends Product {
  images: ProductImage[];
  product_attributes: ProductAttribute[];
}

export interface ProductDetailApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: ProductWithAttributes;
}
