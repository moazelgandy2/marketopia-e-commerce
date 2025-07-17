export interface City {
  id: number;
  name: string;
}

export interface Address {
  id: number;
  name: string;
  address: string;
  phone: string;
  lat: string;
  lng: string;
  is_default: 1 | 0;
  city_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  city: City;
}
