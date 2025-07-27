export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  READY = "ready",
  ON_DELIVERY = "on_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  PREPARING = "preparing",
}

export enum PaymentMethod {
  CASH = "cash",
  VISA = "visa",
  WALLET = "wallet",
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
}

export enum OrderCreationType {
  ONLINE = "online",
  POS = "pos",
}

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export type CouponType = {
  id: number;
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  expiry_date: string;
  usage_limit: number;

  updated_at: string;
  created_at: string;
};

export type AddressType = {
  id: number;
  name: string;
  address: string; // Changed from phone to address as first field
  phone: string;
  lat: string;
  lng: string;
  is_default: boolean;
  city_id: number;
  user_id: number;

  city?: CityType; // Made optional

  created_at: string;
  updated_at: string;
};

export type CityType = {
  id: number;
  name: string;

  created_at: string;
  updated_at: string;
};

export type AreaType = {
  id: number;
  city_id: number;
  name_ar: string;
  name_en: string;
  price: number;

  created_at: string;
  updated_at: string;
};

export type ProductType = {
  id: number;
  name: string; // API returns this field
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  quantity: number;
  status: string; // API returns string, not boolean
  category_id: number;
  brand_id: number;
  image: string; // API includes this field
  rate: number;

  created_at: string;
  updated_at: string;
};

export type OrderItemType = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  product: ProductType;
  created_at: string;
  updated_at: string;
};

export type OrderType = {
  id: number;
  user_id: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_type: OrderCreationType;
  subtotal: string;
  total: string;
  notes: string | null;
  coupon_id: number | null;
  discount: string | null;
  delivery_fee: number | null;
  area_id: number | null;
  deliveryman_id: number | null;
  created_by: number | null;

  // Optional tracking and delivery fields that may come from API
  tracking_number?: string | null;
  delivery_date?: string | null;
  estimated_delivery?: string | null;

  coupon?: CouponType | null;

  address_id: number | null;
  address: AddressType | null;

  area?: AreaType | null;

  order_details: OrderItemType[];

  created_at: string;
  updated_at: string;
};
