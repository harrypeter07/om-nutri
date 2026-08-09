import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { getReviews } from "@/lib/catalog.functions";
import type { Review } from "@/lib/catalog-types";

export const Route = createFileRoute("/reviews")({
  loader: async () => ({ reviews: await getReviews({ data: {} }) }),
  head: () => ({
    meta: [
      { title: "Customer Reviews | OM Nutrition Panipat Supplement Store" },
      {
        name: "description",
        content:
          "Real reviews from OM Nutrition customers in Panipat on whey protein, mass gainers, creatine and pre-workout bought at the store.",
      },
      { property: "og:title", content: "Customer Reviews — OM Nutrition Panipat" },
      {
        property: "og:description",
        content: "What Panipat customers say about supplements bought at OM Nutrition.",
      },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: Reviews,
});

function Reviews() {
  const { reviews } = Route.useLoaderData() as { reviews: Review[] };
  const average =
    reviews.length > 0 ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Social proof</p>
        <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">Customer reviews</h1>
        {reviews.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <Stars rating={average} count={reviews.length} />
            <span className="text-sm text-muted-foreground">approved reviews</span>
          </div>
        )}
      </Reveal>

      {reviews.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          No approved reviews yet. Buy something and be the first to write one.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={Math.min(i, 6) * 0.04}>
              <figure className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-card">
                <Stars rating={review.rating} />
                <blockquote className="text-sm leading-relaxed text-foreground">
                  “{review.comment}”
                </blockquote>
                <figcaption className="mt-auto text-sm font-bold text-primary">
                  {review.customer_name}
                  {review.product && (
                    <Link
                      to="/products/$slug"
                      params={{ slug: review.product.slug }}
                      className="block text-xs font-medium text-brand"
                    >
                      on {review.product.name}
                    </Link>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal className="mt-12">
        <Button variant="brand" asChild>
          <Link to="/products" search={{}}>
            Shop supplements
          </Link>
        </Button>
      </Reveal>
    </div>
  );
}
