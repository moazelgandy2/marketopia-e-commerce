export interface BestSelling {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  quantity: number;
  status: string;
  category_id: number;
  brand_id: number;
  total_sold: number;
  image: string;
  rate: number;
}

export interface BestSellingApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: BestSelling[];
}
