import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Category, Product, Review } from "./catalog-types";

export const getCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<Category[]> => {
    const { fetchCategories } = await import("./catalog.server");
    return fetchCategories();
  },
);

export const getProducts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ category: z.string().optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }): Promise<Product[]> => {
    const { fetchProducts } = await import("./catalog.server");
    return fetchProducts(data.category);
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<Product | null> => {
    const { fetchProduct } = await import("./catalog.server");
    return fetchProduct(data.slug);
  });

export const getReviews = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ productId: z.string().uuid().optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }): Promise<Review[]> => {
    const { fetchReviews } = await import("./catalog.server");
    return fetchReviews(data.productId);
  });

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        product_id: z.string().uuid(),
        customer_name: z.string().trim().min(2).max(60),
        rating: z.number().int().min(1).max(5),
        comment: z.string().trim().max(600),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { insertReview } = await import("./catalog.server");
    return insertReview(data);
  });

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        customer_name: z.string().trim().min(2).max(80),
        phone: z.string().trim().regex(/^[6-9]\d{9}$/),
        address: z.string().trim().min(8).max(400),
        city: z.string().trim().min(2).max(60),
        pincode: z.string().trim().regex(/^\d{6}$/),
        items: z
          .array(
            z.object({
              product_id: z.string().uuid(),
              name: z.string().min(1).max(200),
              qty: z.number().int().min(1).max(99),
              price: z.number().min(0),
            }),
          )
          .min(1)
          .max(40),
        total_amount: z.number().min(0),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { insertOrder } = await import("./catalog.server");
    return insertOrder(data);
  });
