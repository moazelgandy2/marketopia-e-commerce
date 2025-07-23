export interface CartProductAttributeValue {
  id: number;
  product_id: number;
  attribute_value_id: number;
  price: number;
  created_at: string;
  updated_at: string;
  pivot: {
    cart_id: number;
    product_attribute_value_id: number;
  };
  attribute_value: {
    id: number;
    value: string;
    attribute_id: number;
    created_at: string;
    updated_at: string;
    attribute: {
      id: number;
      name: string;
    };
  };
}

export interface CartProduct {
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

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_attribute_values: CartProductAttributeValue[];
  product: CartProduct;
}

export interface CartPricing {
  total_price: number;
  total_price_after_discount: number;
  discount: number;
  coupon_discount?: number;
  applied_coupon?: {
    code: string;
    discount_type: string;
    discount_value: string;
  };
}

export interface CartData {
  items: CartItem[];
  pricing: CartPricing;
}

export interface CartApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: CartData;
}

export interface DeleteCartItemResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
}
