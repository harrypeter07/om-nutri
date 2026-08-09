import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";

import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories, getProducts } from "@/lib/catalog.functions";
import type { Product } from "@/lib/catalog-types";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  loader: async () => {
    const [categories, products] = await Promise.all([getCategories(), getProducts({ data: {} })]);
    return { categories, products };
  },
  head: () => ({
    meta: [
      { title: "Buy Supplements in Panipat | Whey, Gainers, Pre-Workout — OM Nutrition" },
      {
        name: "description",
        content:
          "Full supplement catalogue at OM Nutrition Panipat: whey protein, mass gainers, creatine, pre-workout, fat burners and daily wellness. Filter by goal and order on WhatsApp.",
      },
      { property: "og:title", content: "Supplement Catalogue — OM Nutrition Panipat" },
      {
        property: "og:description",
        content: "Whey, gainers, pre-workout and wellness supplements with local Panipat delivery.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

function Products() {
  const { categories, products } = Route.useLoaderData() as {
    categories: { id: string; name: string; slug: string }[];
    products: Product[];
  };
  const { category } = Route.useSearch();
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const list = category ? products.filter((p) => p.category?.slug === category) : [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case "rating":
        return list.sort((a, b) => Number(b.rating_avg) - Number(a.rating_avg));
      default:
        return list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }
  }, [products, category, sort]);

  const activeName = categories.find((c) => c.slug === category)?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Catalogue</p>
        <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
          {activeName ? `${activeName} supplements in Panipat` : "All supplements"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every product below is in stock at the store. Add what you need, then confirm the order on
          WhatsApp — you pay on pickup or delivery.
        </p>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Button variant={category ? "soft" : "brand"} size="sm" asChild>
          <Link to="/products" search={{}}>
            All
          </Link>
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={category === cat.slug ? "brand" : "soft"}
            size="sm"
            asChild
          >
            <Link to="/products" search={{ category: cat.slug }}>
              {cat.name}
            </Link>
          </Button>
        ))}

        <div className="ml-auto w-44">
          <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
            <SelectTrigger aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing in this category yet — ask us on WhatsApp and we'll order it in.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 6) * 0.04}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
