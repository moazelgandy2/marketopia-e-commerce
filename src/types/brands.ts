export interface Brand {
  id: number;
  name: string;
  image: string;
}

export interface BrandsApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: Brand[];
}
