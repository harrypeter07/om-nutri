import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteProduct,
  deleteReview,
  getAdminData,
  saveProduct,
  setOrderStatus,
  setReviewApproval,
} from "@/lib/admin.functions";
import { currency } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin | OM Nutrition Panipat" },
      { name: "description", content: "Manage OM Nutrition orders, products and reviews." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — OM Nutrition" },
      { property: "og:description", content: "Store management for OM Nutrition Panipat." },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: Admin,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = any;

const emptyProduct = {
  name: "",
  slug: "",
  category_id: null as string | null,
  price: 0,
  compare_at_price: null as number | null,
  description: "",
  ingredients: "",
  benefits: [] as string[],
  images: [] as string[],
  stock: 0,
  is_featured: false,
};

function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchData = useServerFn(getAdminData);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => fetchData(),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-data"] });

  const orderStatus = useMutation({
    mutationFn: (vars: { id: string; status: "pending" | "contacted" | "confirmed" | "delivered" }) =>
      setOrderStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Order updated");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reviewApproval = useMutation({
    mutationFn: (vars: { id: string; approved: boolean }) => setReviewApproval({ data: vars }),
    onSuccess: () => {
      toast.success("Review updated");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeReview = useMutation({
    mutationFn: (id: string) => deleteReview({ data: { id } }),
    onSuccess: () => {
      toast.success("Review deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeProduct = useMutation({
    mutationFn: (id: string) => deleteProduct({ data: { id } }),
    onSuccess: () => {
      toast.success("Product deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [form, setForm] = useState<typeof emptyProduct & { id?: string }>({ ...emptyProduct });

  const upsert = useMutation({
    mutationFn: () =>
      saveProduct({
        data: {
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          slug: form.slug,
          category_id: form.category_id,
          price: Number(form.price),
          compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
          description: form.description,
          ingredients: form.ingredients,
          benefits: form.benefits,
          images: form.images,
          stock: Number(form.stock),
          is_featured: form.is_featured,
        },
      }),
    onSuccess: () => {
      toast.success("Product saved");
      setForm({ ...emptyProduct });
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="p-12 text-center text-muted-foreground">Loading…</p>;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary">No admin access</h1>
        <p className="mt-3 text-sm text-muted-foreground">{(error as Error).message}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Ask for the admin role to be granted to this account, then reload.
        </p>
      </div>
    );
  }

  const orders = (data?.orders ?? []) as AnyRow[];
  const reviews = (data?.reviews ?? []) as AnyRow[];
  const products = (data?.products ?? []) as AnyRow[];
  const categories = (data?.categories ?? []) as AnyRow[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary">Store admin</h1>
        <Button
          variant="soft"
          onClick={async () => {
            await supabase.auth.signOut();
            queryClient.clear();
            navigate({ to: "/" });
          }}
        >
          <LogOut /> Sign out
        </Button>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        {/* ORDERS */}
        <TabsContent value="orders" className="mt-6 space-y-4">
          {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-primary">
                    {order.customer_name} · {order.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.address}, {order.city} - {order.pincode}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-primary">{currency(Number(order.total_amount))}</p>
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      orderStatus.mutate({ id: order.id, status: status as "pending" })
                    }
                  >
                    <SelectTrigger className="w-36" aria-label="Order status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["pending", "contacted", "confirmed", "delivered"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {(order.items as AnyRow[]).map((item, index) => (
                  <li key={index}>
                    {item.qty} × {item.name} — {currency(Number(item.price))}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TabsContent>

        {/* PRODUCTS */}
        <TabsContent value="products" className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <div className="min-w-40 flex-1">
                  <p className="font-bold text-primary">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.category?.name ?? "No category"} · stock {product.stock}
                  </p>
                </div>
                <p className="font-bold text-primary">{currency(Number(product.price))}</p>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() =>
                    setForm({
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      category_id: product.category_id ?? null,
                      price: Number(product.price),
                      compare_at_price: product.compare_at_price
                        ? Number(product.compare_at_price)
                        : null,
                      description: product.description ?? "",
                      ingredients: product.ingredients ?? "",
                      benefits: product.benefits ?? [],
                      images: product.images ?? [],
                      stock: product.stock,
                      is_featured: product.is_featured,
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeProduct.mutate(product.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>

          <form
            className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            onSubmit={(event) => {
              event.preventDefault();
              upsert.mutate();
            }}
          >
            <p className="font-bold text-primary">{form.id ? "Edit product" : "Add product"}</p>

            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                value={form.name}
                required
                className="mt-1.5"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-slug">Slug (url)</Label>
              <Input
                id="p-slug"
                value={form.slug}
                required
                className="mt-1.5"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="p-price">Price</Label>
                <Input
                  id="p-price"
                  type="number"
                  min={0}
                  value={form.price}
                  className="mt-1.5"
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="p-compare">Was price</Label>
                <Input
                  id="p-compare"
                  type="number"
                  min={0}
                  value={form.compare_at_price ?? ""}
                  className="mt-1.5"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      compare_at_price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="p-stock">Stock</Label>
                <Input
                  id="p-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  className="mt-1.5"
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.category_id ?? ""}
                onValueChange={(value) => setForm({ ...form, category_id: value })}
              >
                <SelectTrigger className="mt-1.5" aria-label="Category">
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="p-images">Image URLs (comma separated)</Label>
              <Input
                id="p-images"
                value={form.images.join(", ")}
                placeholder="/images/p-whey.jpg"
                className="mt-1.5"
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="p-benefits">Benefits (comma separated)</Label>
              <Input
                id="p-benefits"
                value={form.benefits.join(", ")}
                className="mt-1.5"
                onChange={(e) =>
                  setForm({
                    ...form,
                    benefits: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                rows={3}
                value={form.description}
                className="mt-1.5"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-ing">Ingredients</Label>
              <Textarea
                id="p-ing"
                rows={2}
                value={form.ingredients}
                className="mt-1.5"
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-primary">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Show on homepage bestsellers
            </label>

            <div className="flex gap-2">
              <Button variant="brand" disabled={upsert.isPending}>
                {upsert.isPending ? "Saving…" : "Save product"}
              </Button>
              {form.id && (
                <Button type="button" variant="ghost" onClick={() => setForm({ ...emptyProduct })}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews" className="mt-6 space-y-3">
          {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="min-w-48 flex-1">
                <p className="font-bold text-primary">
                  {review.customer_name} · {review.rating}★
                  {review.approved ? (
                    <Badge className="ml-2 bg-success text-primary-foreground">approved</Badge>
                  ) : (
                    <Badge className="ml-2 bg-warning text-primary-foreground">pending</Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  on {review.product?.name ?? "unknown product"}
                </p>
                <p className="mt-2 text-sm text-foreground">{review.comment}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={review.approved ? "soft" : "brand"}
                  onClick={() =>
                    reviewApproval.mutate({ id: review.id, approved: !review.approved })
                  }
                >
                  {review.approved ? "Unpublish" : "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeReview.mutate(review.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
