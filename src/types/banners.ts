export interface Banner {
  id: number;
  name: string;
  image: string;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface BannersApiResponse {
  status: boolean;
  errorNum: number | null;
  message: string;
  data: Banner[];
}
