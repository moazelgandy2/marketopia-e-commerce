export interface Coupon {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: string;
  expiry_date: string;
  usage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface CouponApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: Coupon;
}

export interface ApplyCouponRequest {
  coupon_code: string;
}

export interface ApplyCouponResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data?: {
    discount_amount: number;
    final_total: number;
  };
}
