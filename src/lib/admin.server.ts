import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Client = SupabaseClient<Database>;

export async function assertAdmin(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin access required");
}

export async function loadAdminData(supabase: Client) {
  const [orders, reviews, products, categories] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("reviews").select("*, product:products(name, slug)").order("created_at", { ascending: false }).limit(200),
    supabase.from("products").select("*, category:categories(name, slug)").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  for (const result of [orders, reviews, products, categories]) {
    if (result.error) throw new Error(result.error.message);
  }
  return {
    orders: orders.data ?? [],
    reviews: reviews.data ?? [],
    products: products.data ?? [],
    categories: categories.data ?? [],
  };
}
