export interface Variant {
  price: number;
  discountPrice?: number | null;
  stock: number;
}

export interface ApiProduct {
  _id: string;
  name: string;
  images?: string[];
  variants?: Variant[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number | null;
  image: string;
  inStock: boolean;
  createdAt: string;
}