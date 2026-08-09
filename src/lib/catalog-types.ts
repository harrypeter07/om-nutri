export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  accent: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  description: string | null;
  benefits: string[];
  ingredients: string | null;
  images: string[];
  stock: number;
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
  category?: { name: string; slug: string; accent: string | null } | null;
};

export type Review = {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product?: { name: string; slug: string } | null;
};

export type OrderItemInput = {
  product_id: string;
  name: string;
  qty: number;
  price: number;
};

export type OrderInput = {
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItemInput[];
  total_amount: number;
};
