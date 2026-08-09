import { getPublicClient } from "./supabase-public.server";
import type { Category, OrderInput, Product, Review } from "./catalog-types";

const PRODUCT_FIELDS =
  "id, name, slug, category_id, price, compare_at_price, description, benefits, ingredients, images, stock, is_featured, rating_avg, rating_count, category:categories(name, slug, accent)";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await getPublicClient()
    .from("categories")
    .select("id, name, slug, icon, accent")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  let query = getPublicClient().from("products").select(PRODUCT_FIELDS);
  if (categorySlug) query = query.eq("categories.slug", categorySlug);
  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const products = (data ?? []) as unknown as Product[];
  return categorySlug ? products.filter((p) => p.category?.slug === categorySlug) : products;
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  const { data, error } = await getPublicClient()
    .from("products")
    .select(PRODUCT_FIELDS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as Product) ?? null;
}

export async function fetchReviews(productId?: string): Promise<Review[]> {
  let query = getPublicClient()
    .from("reviews")
    .select("id, product_id, customer_name, rating, comment, created_at, product:products(name, slug)")
    .eq("approved", true);
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query.order("created_at", { ascending: false }).limit(60);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Review[];
}

export async function insertReview(input: {
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
}) {
  const { error } = await getPublicClient().from("reviews").insert({ ...input, approved: false });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function insertOrder(input: OrderInput) {
  // Public clients no longer have INSERT access to orders; writes go through
  // this trusted server-only path after validation in the server function.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      phone: input.phone,
      address: input.address,
      city: input.city,
      pincode: input.pincode,
      items: input.items,
      total_amount: input.total_amount,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id as string };
}
