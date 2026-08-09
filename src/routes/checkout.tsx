import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { placeOrder } from "@/lib/catalog.functions";
import { currency, site, whatsappLink } from "@/lib/site";
import { cartTotal, useCart } from "@/store/cart";

const schema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().trim().min(8, "Please enter your full address").max(400),
  city: z.string().trim().min(2, "City is required").max(60),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | OM Nutrition Panipat — Confirm on WhatsApp" },
      {
        name: "description",
        content:
          "Enter your delivery details and confirm your OM Nutrition Panipat supplement order directly on WhatsApp. No online payment required.",
      },
      { property: "og:title", content: "Checkout — OM Nutrition Panipat" },
      {
        property: "og:description",
        content: "Confirm your supplement order on WhatsApp. Pay on delivery or pickup.",
      },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, clear } = useCart();
  const total = cartTotal(items);
  const [placed, setPlaced] = useState<{ message: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customer_name: "", phone: "", address: "", city: "Panipat", pincode: "" },
  });

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="grid mx-auto size-14 place-items-center rounded-2xl bg-success/15 text-success">
          <MessageCircle className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-primary">Order received!</h1>
        <p className="mt-4 text-muted-foreground">
          We've opened WhatsApp with your order summary — please hit send so {site.owner} can confirm
          stock, timing and total.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="whatsapp" size="lg" asChild>
            <a href={whatsappLink(placed.message)}>
              <MessageCircle /> Open WhatsApp again
            </a>
          </Button>
          <Button variant="soft" size="lg" asChild>
            <Link to="/products" search={{}}>
              Continue shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-primary">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Add a few supplements before checking out.</p>
        <Button variant="brand" className="mt-6" asChild>
          <Link to="/products" search={{}}>
            Browse supplements
          </Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      items: items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        qty: i.qty,
        price: Number(i.price),
      })),
      total_amount: total,
    };

    try {
      await placeOrder({ data: payload });
    } catch {
      toast.error("Could not save your order. Please try again or message us on WhatsApp.");
      return;
    }

    const message = [
      "New Order — OM Nutrition",
      `Name: ${values.customer_name}`,
      `Phone: ${values.phone}`,
      `Address: ${values.address}, ${values.city} - ${values.pincode}`,
      "Items:",
      ...items.map((i) => `- ${i.qty} x ${i.name} — ${currency(i.price * i.qty)}`),
      `Total: ${currency(total)}`,
    ].join("\n");

    clear();
    setPlaced({ message });
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary md:text-4xl">Checkout</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        No online payment. We save your order, then open WhatsApp with the summary so you can confirm
        with {site.owner} directly.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <form
          className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-card"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <Label htmlFor="customer_name">Full name</Label>
            <Input id="customer_name" className="mt-1.5" {...form.register("customer_name")} />
            <FieldError message={form.formState.errors.customer_name?.message} />
          </div>

          <div>
            <Label htmlFor="phone">WhatsApp mobile number</Label>
            <Input
              id="phone"
              inputMode="numeric"
              maxLength={10}
              placeholder="98130 26045"
              className="mt-1.5"
              {...form.register("phone")}
            />
            <FieldError message={form.formState.errors.phone?.message} />
          </div>

          <div>
            <Label htmlFor="address">Delivery address</Label>
            <Textarea id="address" rows={3} className="mt-1.5" {...form.register("address")} />
            <FieldError message={form.formState.errors.address?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" className="mt-1.5" {...form.register("city")} />
              <FieldError message={form.formState.errors.city?.message} />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                inputMode="numeric"
                maxLength={6}
                className="mt-1.5"
                {...form.register("pincode")}
              />
              <FieldError message={form.formState.errors.pincode?.message} />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            <MessageCircle />
            {form.formState.isSubmitting ? "Saving order…" : "Confirm order on WhatsApp"}
          </Button>
        </form>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold text-primary">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.product_id} className="flex justify-between gap-3 text-sm">
                <span className="text-foreground">
                  {item.qty} × {item.name}
                </span>
                <span className="font-bold text-primary">{currency(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-base font-bold text-primary">
            <span>Total</span>
            <span>{currency(total)}</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Delivery inside {site.address.city} is same-day. Outside the city, we'll confirm charges
            on WhatsApp before dispatch.
          </p>
        </aside>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-semibold text-destructive">{message}</p>;
}

