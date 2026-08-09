import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { currency } from "@/lib/site";
import { cartTotal, useCart } from "@/store/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | OM Nutrition Panipat" },
      {
        name: "description",
        content:
          "Review the supplements in your cart, then confirm your OM Nutrition Panipat order on WhatsApp. No advance payment needed.",
      },
      { property: "og:title", content: "Your Cart — OM Nutrition Panipat" },
      { property: "og:description", content: "Review your supplement order before WhatsApp checkout." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove } = useCart();
  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary md:text-4xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <p className="text-muted-foreground">Your cart is empty right now.</p>
          <Button variant="brand" className="mt-6" asChild>
            <Link to="/products" search={{}}>
              Browse supplements
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li
                key={item.product_id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <img
                  src={item.image ?? "/images/p-whey.jpg"}
                  alt={item.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="size-24 rounded-xl bg-secondary object-contain p-2"
                />
                <div className="min-w-40 flex-1">
                  <Link
                    to="/products/$slug"
                    params={{ slug: item.slug }}
                    className="font-bold text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{currency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="soft"
                    className="size-8"
                    aria-label="Decrease quantity"
                    onClick={() => setQty(item.product_id, item.qty - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-8 text-center font-bold">{item.qty}</span>
                  <Button
                    size="icon"
                    variant="soft"
                    className="size-8"
                    aria-label="Increase quantity"
                    onClick={() => setQty(item.product_id, item.qty + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
                <p className="w-24 text-right font-bold text-primary">
                  {currency(item.price * item.qty)}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.product_id)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-6 shadow-card">
            <div>
              <p className="text-sm text-muted-foreground">Order total</p>
              <p className="text-2xl font-bold text-primary">{currency(total)}</p>
            </div>
            <Button variant="hero" size="lg" asChild>
              <Link to="/checkout">Continue to checkout</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
