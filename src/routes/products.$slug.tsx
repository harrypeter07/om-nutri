import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProduct, getProducts, getReviews, submitReview } from "@/lib/catalog.functions";
import type { Product, Review } from "@/lib/catalog-types";
import { currency, site, whatsappLink } from "@/lib/site";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const product = await getProduct({ data: { slug: params.slug } });
    if (!product) throw notFound();
    const [reviews, all] = await Promise.all([
      getReviews({ data: { productId: product.id } }),
      getProducts({ data: {} }),
    ]);
    return { product, reviews, related: all };
  },
  head: ({ loaderData, params }) => {
    const product = loaderData?.product;
    const title = product
      ? `${product.name} — Buy in Panipat | OM Nutrition`
      : "Product — OM Nutrition Panipat";
    const description = product
      ? `${product.name} at ${currency(Number(product.price))} from OM Nutrition, Panipat. ${
          product.description ?? ""
        }`.slice(0, 155)
      : "Genuine supplements in Panipat.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/products/${params.slug}` }],
      scripts: product
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description,
                brand: { "@type": "Brand", name: "OM Nutrition" },
                offers: {
                  "@type": "Offer",
                  price: Number(product.price),
                  priceCurrency: "INR",
                  availability:
                    product.stock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  seller: { "@type": "Organization", name: "OM Nutrition, Panipat" },
                },
                ...(product.rating_count > 0
                  ? {
                      aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: Number(product.rating_avg),
                        reviewCount: product.rating_count,
                      },
                    }
                  : {}),
              }),
            },
          ]
        : [],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product, reviews, related } = Route.useLoaderData() as {
    product: Product;
    reviews: Review[];
    related: Product[];
  };
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  const others = related
    .filter((p) => p.id !== product.id && p.category?.slug === product.category?.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted-foreground">
        <Link to="/products" search={{}} className="hover:text-brand">
          Supplements
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <img
            src={product.images[0] ?? "/images/p-whey.jpg"}
            alt={`${product.name} — genuine supplement at OM Nutrition Panipat`}
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-sm object-contain"
          />
        </div>

        <div>
          {product.category && (
            <Link
              to="/products"
              search={{ category: product.category.slug }}
              className="text-xs font-bold uppercase tracking-widest text-brand"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <Stars rating={Number(product.rating_avg)} count={product.rating_count} />
          </div>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-primary">{currency(Number(product.price))}</p>
            {product.compare_at_price && (
              <p className="text-base text-muted-foreground line-through">
                {currency(Number(product.compare_at_price))}
              </p>
            )}
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          {product.benefits.length > 0 && (
            <ul className="mt-6 space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm font-medium">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-border">
              <button
                className="px-3 py-2 text-sm font-bold text-muted-foreground"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button
                className="px-3 py-2 text-sm font-bold text-muted-foreground"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button
              variant="hero"
              size="lg"
              disabled={product.stock <= 0}
              onClick={() => {
                add(
                  {
                    product_id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    image: product.images[0] ?? null,
                  },
                  qty,
                );
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingBag /> {product.stock > 0 ? "Add to cart" : "Out of stock"}
            </Button>
            <Button variant="whatsapp" size="lg" asChild>
              <a href={whatsappLink(`Hi OM Nutrition, is ${product.name} in stock?`)}>
                <MessageCircle /> Ask about this
              </a>
            </Button>
          </div>

          <p className="mt-4 text-sm font-semibold text-success">
            {product.stock > 0 ? `In stock at the ${site.address.city} store` : "Currently sold out"}
          </p>

          {product.ingredients && (
            <div className="mt-8 rounded-2xl bg-secondary p-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                Ingredients
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-16 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-bold text-primary">Customer reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
              No reviews yet for this product. Be the first to leave one.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <Stars rating={review.rating} />
                  <p className="mt-3 text-sm text-foreground">{review.comment}</p>
                  <p className="mt-3 text-xs font-bold text-primary">{review.customer_name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ReviewForm productId={product.id} />
      </section>

      {others.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary">You might also need</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-bold text-primary">Thank you!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your review has been sent to {site.owner} for approval and will appear here shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card"
      onSubmit={async (event) => {
        event.preventDefault();
        if (name.trim().length < 2) {
          toast.error("Please enter your name");
          return;
        }
        setSending(true);
        try {
          await submitReview({
            data: { product_id: productId, customer_name: name.trim(), rating, comment: comment.trim() },
          });
          setDone(true);
        } catch {
          toast.error("Could not send your review. Please try again.");
        } finally {
          setSending(false);
        }
      }}
    >
      <h2 className="text-lg font-bold text-primary">Write a review</h2>
      <p className="mt-1 text-sm text-muted-foreground">No login needed.</p>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="review-name">Your name</Label>
          <Input
            id="review-name"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rohit K."
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Rating</Label>
          <div className="mt-1.5 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star`}
                className={
                  value <= rating
                    ? "size-9 rounded-lg bg-warning/20 text-sm font-bold text-warning"
                    : "size-9 rounded-lg bg-secondary text-sm font-bold text-muted-foreground"
                }
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="review-comment">Your experience</Label>
          <Textarea
            id="review-comment"
            value={comment}
            maxLength={600}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How did it work for you?"
            className="mt-1.5"
            rows={4}
          />
        </div>
        <Button variant="brand" className="w-full" disabled={sending}>
          {sending ? "Sending…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
