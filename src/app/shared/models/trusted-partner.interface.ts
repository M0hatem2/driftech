export interface TrustedPartner {
  id: string;
  name: string;
  nameAr?: string;
  logoUrl: string;
  alt: string;
}

export interface Root {
  status: boolean;
  message: string;
  data: Data;
}

export interface Data {
  items: Items;
}

export interface Items {
  "": GeneratedType;
}

export interface GeneratedType {
  id: number;
  title: string;
  description: string;
  link: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}