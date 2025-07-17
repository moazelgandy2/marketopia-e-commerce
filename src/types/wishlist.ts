import { Product } from ".";

export interface Wishlist {
  user_id: number;
  product_id: number;
  updated_at: string;
  created_at: string;
  id: number;
  product: Product;
}
