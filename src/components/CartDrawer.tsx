import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { currency } from "@/lib/site";
import { cartTotal, useCart } from "@/store/cart";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const total = cartTotal(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? null : close())}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-bold text-primary">Your cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button variant="brand" asChild onClick={close}>
              <Link to="/products">Browse supplements</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <li key={item.product_id} className="flex gap-3 rounded-xl border border-border p-3">
                  <img
                    src={item.image ?? "/images/p-whey.jpg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="size-20 rounded-lg bg-secondary object-contain p-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{currency(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="soft"
                        className="size-7"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQty(item.product_id, item.qty - 1)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                      <Button
                        size="icon"
                        variant="soft"
                        className="size-7"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQty(item.product_id, item.qty + 1)}
                      >
                        <Plus />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-auto size-7 text-muted-foreground"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => remove(item.product_id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between text-base font-bold text-primary">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                No online payment. You confirm the order on WhatsApp and pay on delivery or pickup.
              </p>
              <Button variant="hero" size="lg" className="w-full" asChild onClick={close}>
                <Link to="/checkout">Checkout on WhatsApp</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
