import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, MessageCircle, QrCode, ShieldCheck, Sparkles, ChevronRight, Lock, Truck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { placeOrder } from "@/lib/catalog.functions";
import { currency, site, whatsappLink } from "@/lib/site";
import { cartTotal, useCart } from "@/store/cart";
import { createUpiUrl } from "@/lib/upi";
import { generateQrDataUrl } from "@/lib/qr";
import { MobilePayButtons } from "@/components/upi/MobilePayButtons";

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
      { title: "Checkout | OM Nutrition Panipat — Secure Payment" },
      {
        name: "description",
        content:
          "Complete your order details and choose UPI Payment or Cash on Delivery for fast delivery in Panipat.",
      },
      { property: "og:title", content: "Checkout — OM Nutrition Panipat" },
      {
        property: "og:description",
        content: "Pay online via UPI or Cash on Delivery. 100% genuine sealed supplements.",
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
  const [placed, setPlaced] = useState<{ orderId: string; message: string; paymentMode: "UPI_ONLINE" | "WHATSAPP_COD" } | null>(null);
  const [paymentMode, setPaymentMode] = useState<"UPI_ONLINE" | "WHATSAPP_COD">("UPI_ONLINE");
  const [showQr, setShowQr] = useState<boolean>(false);
  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>("");

  const upiId = "9322909257@ybl";
  const payeeName = "OM Nutrition";

  // Generate QR only when user explicitly clicks / requests QR Code
  const handleGenerateQr = async () => {
    if (total <= 0) return;
    setIsGeneratingQr(true);
    setShowQr(true);
    setPaymentMode("UPI_ONLINE");

    try {
      const upiDeepLink = createUpiUrl({
        upiId,
        payeeName,
        amount: total,
        transactionNote: `Order OM Nutrition ₹${total}`,
      });
      const url = await generateQrDataUrl(upiDeepLink, { width: 500, margin: 2 });
      setUpiQrUrl(url);
    } catch {
      setUpiQrUrl(null);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customer_name: "", phone: "", address: "", city: "Panipat", pincode: "" },
  });

  // Industry-grade Order Placed Confirmation Screen
  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="grid mx-auto size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
          <CheckCircle2 className="size-12 stroke-[2.2]" />
        </span>
        <div className="mt-6">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 uppercase tracking-wider">
            Order Ref: #{placed.orderId.slice(-6).toUpperCase()}
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Order Successfully Placed!
          </h1>
          <p className="mt-3 text-sm font-semibold text-gray-600 leading-relaxed max-w-md mx-auto">
            Thank you, <strong className="text-black">{form.getValues("customer_name") || "Customer"}</strong>!
            Your order has been recorded. Our store team is preparing your package for local delivery in Panipat.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left text-xs space-y-2">
          <div className="flex justify-between border-b border-gray-200 pb-2 font-bold text-gray-700">
            <span>Payment Method:</span>
            <span className="text-black font-black uppercase">
              {placed.paymentMode === "UPI_ONLINE" ? "UPI Payment (Online)" : "Cash on Delivery (COD)"}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2 font-bold text-gray-700">
            <span>Total Payable:</span>
            <span className="text-black font-black text-sm">{currency(total || 0)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-600 pt-1">
            <span>Delivery Location:</span>
            <span className="text-black font-bold">{form.getValues("city") || "Panipat"}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="whatsapp" size="lg" className="w-full sm:w-auto font-black uppercase tracking-wider py-6" asChild>
            <a href={whatsappLink(placed.message)} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" /> Track & Confirm Order Support
            </a>
          </Button>
          <Button variant="soft" size="lg" className="w-full sm:w-auto font-black uppercase tracking-wider py-6" asChild>
            <Link to="/products" search={{}}>
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-black">Your cart is empty</h1>
        <p className="mt-3 text-sm text-gray-600">Add a few supplements before checking out.</p>
        <Button variant="brand" className="mt-6 font-black uppercase tracking-wider" asChild>
          <Link to="/products" search={{}}>
            Browse Supplements
          </Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    let res: { id: string } = { id: `ord_${Date.now()}` };

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
      const result = await placeOrder({ data: payload });
      if (result && result.id) res = result;
    } catch {
      toast.error("Could not save your order. Please try again or message us on WhatsApp.");
      return;
    }

    const modeText = paymentMode === "UPI_ONLINE" ? "UPI Payment (Online)" : "Cash on Delivery (COD)";
    const utrText = utrNumber.trim() ? `\nUPI UTR / Ref: ${utrNumber.trim()}` : "";

    const message = [
      `New Order — OM Nutrition (#${res.id.slice(-6).toUpperCase()})`,
      `Payment Method: ${modeText}${utrText}`,
      `Customer Name: ${values.customer_name}`,
      `Contact Phone: ${values.phone}`,
      `Delivery Address: ${values.address}, ${values.city} - ${values.pincode}`,
      "Order Items:",
      ...items.map((i) => `- ${i.qty} x ${i.name} — ${currency(i.price * i.qty)}`),
      `Total Payable: ${currency(total)}`,
    ].join("\n");

    clear();
    setPlaced({ orderId: res.id, message, paymentMode });
    toast.success("Order placed successfully!");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-xs font-semibold text-gray-600">
          Enter your delivery details and choose your preferred payment option to place your order.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
        {/* Main Delivery & Payment Form */}
        <form
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          {/* Section 1: Customer Delivery Details */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-black text-[11px] text-white">1</span>
              Delivery Address
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name" className="text-xs font-bold text-gray-700">Full Name *</Label>
                <Input id="customer_name" className="mt-1 font-bold text-black" {...form.register("customer_name")} />
                <FieldError message={form.formState.errors.customer_name?.message} />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-bold text-gray-700">Contact Mobile Number *</Label>
                <Input
                  id="phone"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98130 26045"
                  className="mt-1 font-bold text-black"
                  {...form.register("phone")}
                />
                <FieldError message={form.formState.errors.phone?.message} />
              </div>

              <div>
                <Label htmlFor="address" className="text-xs font-bold text-gray-700">Delivery Address *</Label>
                <Textarea id="address" rows={2} className="mt-1 font-bold text-black" {...form.register("address")} />
                <FieldError message={form.formState.errors.address?.message} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city" className="text-xs font-bold text-gray-700">City *</Label>
                  <Input id="city" className="mt-1 font-bold text-black" {...form.register("city")} />
                  <FieldError message={form.formState.errors.city?.message} />
                </div>
                <div>
                  <Label htmlFor="pincode" className="text-xs font-bold text-gray-700">Pincode *</Label>
                  <Input
                    id="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    className="mt-1 font-bold text-black"
                    {...form.register("pincode")}
                  />
                  <FieldError message={form.formState.errors.pincode?.message} />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 2: Payment Options */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-black text-[11px] text-white">2</span>
              Payment Option
            </h2>

            <div className="grid gap-3">
              {/* Option A: Direct Online UPI Payment */}
              <div
                className={`rounded-xl border p-4 transition-all ${
                  paymentMode === "UPI_ONLINE"
                    ? "border-black bg-amber-50/50 ring-2 ring-black"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className="flex cursor-pointer items-start gap-3"
                  onClick={() => setPaymentMode("UPI_ONLINE")}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === "UPI_ONLINE"}
                    onChange={() => setPaymentMode("UPI_ONLINE")}
                    className="mt-1 size-4 accent-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <Lock className="size-3.5 text-black" /> UPI Payment (Instant QR & Apps)
                      </span>
                      <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-black">
                        FAST & SECURE
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-gray-600">
                      Pay via Google Pay, PhonePe, Paytm, BHIM, or Scan QR code ({currency(total)} pre-filled).
                    </p>
                  </div>
                </div>

                {/* Explicit Generate QR Button */}
                {paymentMode === "UPI_ONLINE" && !showQr && (
                  <div className="mt-4 pt-3 border-t border-amber-200/80">
                    <button
                      type="button"
                      onClick={handleGenerateQr}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black py-2.5 px-4 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-colors shadow-xs"
                    >
                      <QrCode className="size-4 text-amber-400" /> Click to Display QR Code ({currency(total)})
                      <ChevronRight className="size-4 ml-auto" />
                    </button>
                  </div>
                )}
              </div>

              {/* Option B: Cash on Delivery (COD) */}
              <div
                className={`rounded-xl border p-4 transition-all cursor-pointer ${
                  paymentMode === "WHATSAPP_COD"
                    ? "border-black bg-gray-50 ring-2 ring-black"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => {
                  setPaymentMode("WHATSAPP_COD");
                  setShowQr(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === "WHATSAPP_COD"}
                    onChange={() => {
                      setPaymentMode("WHATSAPP_COD");
                      setShowQr(false);
                    }}
                    className="mt-1 size-4 accent-black"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Truck className="size-4 text-emerald-600" /> Cash on Delivery (COD)
                    </span>
                    <p className="mt-1 text-[11px] font-semibold text-gray-600">
                      Pay in cash or UPI when your order is delivered to your doorstep in Panipat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Online UPI QR Section */}
          {paymentMode === "UPI_ONLINE" && showQr && (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/60 p-4 space-y-5 transition-all animate-in fade-in-50 duration-300">
              {/* Direct Mobile App Launch Buttons */}
              <MobilePayButtons amount={total} upiId={upiId} payeeName={payeeName} />

              <hr className="border-amber-200" />

              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-black">Or Scan QR Code to Pay</p>
                  <p className="text-[11px] font-bold text-amber-900">Pre-filled Amount: {currency(total)}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-white border border-amber-300 px-2 py-1 rounded text-black">
                  {upiId}
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                {isGeneratingQr ? (
                  <div className="size-36 bg-gray-100 animate-pulse rounded-lg grid place-items-center text-xs font-semibold text-gray-400">
                    Generating QR...
                  </div>
                ) : upiQrUrl ? (
                  <div className="bg-white p-2.5 rounded-lg border border-gray-300 shadow-2xs shrink-0">
                    <img src={upiQrUrl} alt="Order Payment UPI QR Code" className="size-36 object-contain" />
                  </div>
                ) : (
                  <div className="size-36 bg-gray-100 rounded-lg grid place-items-center text-xs font-semibold text-gray-400">
                    QR Unavailable
                  </div>
                )}
                <div className="flex-1 space-y-2 text-xs">
                  <p className="font-extrabold text-black flex items-center gap-1">
                    <Sparkles className="size-3.5 text-amber-500" /> Instructions:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 font-medium text-[11px]">
                    <li>Open GPay, PhonePe, Paytm, or any UPI app.</li>
                    <li>Scan this QR code — amount <strong className="text-black font-black">{currency(total)}</strong> is pre-filled.</li>
                    <li>Complete payment in your app.</li>
                  </ol>
                  <div className="pt-1">
                    <label htmlFor="utr" className="block text-[10px] font-black uppercase tracking-wider text-gray-700 mb-1">
                      UPI UTR / Reference No. (Optional)
                    </label>
                    <input
                      id="utr"
                      type="text"
                      placeholder="e.g. 329019284710"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Industry Grade Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full font-black uppercase tracking-wider py-6 text-sm"
            disabled={form.formState.isSubmitting}
          >
            {paymentMode === "UPI_ONLINE" ? (
              <>
                <Lock className="size-4 text-amber-400" />
                {form.formState.isSubmitting ? "Placing Order..." : `Place Order & Pay ${currency(total)}`}
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" />
                {form.formState.isSubmitting ? "Placing Order..." : "Place Order (Cash on Delivery)"}
              </>
            )}
          </Button>
        </form>

        {/* Order Summary Aside */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black uppercase tracking-wider text-black">Order Summary</h2>
          <ul className="mt-4 divide-y divide-gray-100 space-y-3">
            {items.map((item) => (
              <li key={item.product_id} className="flex justify-between gap-3 text-xs font-bold pt-3 first:pt-0">
                <span className="text-gray-800">
                  {item.qty} × {item.name}
                </span>
                <span className="text-black">{currency(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-gray-200 pt-4 text-base font-black text-black">
            <span>Total Payable</span>
            <span className="text-amber-600">{currency(total)}</span>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-3.5 border border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-black">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>100% Genuine & Sealed Guarantee</span>
            </div>
            <p className="text-[11px] font-medium text-gray-500">
              Same-day delivery inside Panipat city. We verify all orders before dispatch.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-red-600">{message}</p>;
}
