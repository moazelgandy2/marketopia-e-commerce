import { useQuery } from "@tanstack/react-query";

interface Area {
  id: number;
  name: string;
  price: number;
  city_id: number;
}

interface City {
  id: number;
  name: string;
  areas: Area[];
}

interface Config {
  id: number;
  android_app_version: number;
  ios_app_version: number;
  android_app_url: string;
  ios_app_url: string;
  terms_and_conditions: string;
  privacy_policy: string;
  refund_policy: string;
  about_us: string;
  contact_us: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
  deliveryman: boolean;
  delivery_fee_type: string;
}

interface ConfigResponse {
  status: boolean;
  errorNum: null | number;
  message: string;
  data: {
    config: Config;
    cities: City[];
    brands: any[];
  };
}

const fetchConfig = async (lang: string = "ar"): Promise<ConfigResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/config?lang=${lang}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch config");
  }
  return response.json();
};

export const useConfig = (lang: string = "ar") => {
  return useQuery({
    queryKey: ["config", lang],
    queryFn: () => fetchConfig(lang),
  });
};

export const useCities = (lang: string = "ar") => {
  const { data, isLoading, error } = useConfig(lang);
  return {
    cities: data?.data?.cities || [],
    isLoading,
    error,
  };
};

export const useConfigData = (lang: string = "ar") => {
  const { data, isLoading, error } = useConfig(lang);
  return {
    config: data?.data?.config,
    cities: data?.data?.cities || [],
    isLoading,
    error,
  };
};
