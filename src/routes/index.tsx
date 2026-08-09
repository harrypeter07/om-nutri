import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Flame, MessageSquare, ShieldCheck, Truck, UserCheck } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/catalog.functions";
import type { Category, Product } from "@/lib/catalog-types";
import { site, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const [categories, products] = await Promise.all([
        getCategories(),
        getProducts({ data: {} }),
      ]);
      return { categories, products };
    } catch {
      return { categories: [], products: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "OM Nutrition Panipat — Real Supplements. Real Shop. Real Results." },
      {
        name: "description",
        content:
          "Buy genuine whey protein, mass gainers, pre-workout and vitamins in Panipat. Guide by Sameer Deshwal.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

// Top Picks Products matching screenshot
const TOP_PICKS = [
  {
    id: "p1",
    name: "Gold Standard Whey",
    slug: "on-gold-standard-whey",
    brand: "Optimum Nutrition",
    weight: "(2 lbs)",
    price: 4299,
    badge: "BEST SELLER",
    images: ["/images/prod-on-whey.jpg"],
    stock: 10,
    price_num: 4299,
  },
  {
    id: "p2",
    name: "Creatine Monohydrate",
    slug: "mb-creatine-monohydrate",
    brand: "MuscleBlaze",
    weight: "(250g)",
    price: 999,
    badge: "POPULAR",
    images: ["/images/prod-mb-creatine.jpg"],
    stock: 15,
    price_num: 999,
  },
  {
    id: "p3",
    name: "Real Mass Gainer",
    slug: "bm-real-mass-gainer",
    brand: "BigMuscles Nutrition",
    weight: "(5 lbs)",
    price: 3499,
    images: ["/images/prod-bm-mass.jpg"],
    stock: 8,
    price_num: 3499,
  },
  {
    id: "p4",
    name: "Nitro Tech Whey",
    slug: "mt-nitro-tech-whey",
    brand: "MuscleTech",
    weight: "(2 lbs)",
    price: 4199,
    images: ["/images/prod-mt-nitro.jpg"],
    stock: 6,
    price_num: 4199,
  },
  {
    id: "p5",
    name: "Fish Oil",
    slug: "on-fish-oil",
    brand: "Optimum Nutrition",
    weight: "(90 Softgels)",
    price: 899,
    images: ["/images/prod-on-fishoil.jpg"],
    stock: 20,
    price_num: 899,
  },
];

// Categories matching screenshot
const CATEGORY_ITEMS = [
  { name: "WHEY PROTEIN", image: "/images/p-whey.jpg", slug: "whey-protein" },
  { name: "MASS GAINERS", image: "/images/p-gainer.jpg", slug: "mass-gainers" },
  { name: "CREATINE", image: "/images/p-wellness.jpg", slug: "creatine" },
  { name: "PRE-WORKOUT", image: "/images/p-preworkout.jpg", slug: "pre-workout" },
  { name: "FAT BURNERS", image: "/images/p-burner.jpg", slug: "fat-burners", isIcon: true },
  { name: "VITAMINS", image: "/images/prod-on-fishoil.jpg", slug: "vitamins" },
];

function Home() {
  return (
    <div className="bg-white text-gray-900 pb-16">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#f1f2f4]">
          <div className="grid items-center gap-6 md:grid-cols-12">
            {/* Left Content Column */}
            <div className="p-6 sm:p-10 md:p-12 md:col-span-5 lg:col-span-5">
              <h1 className="font-sans text-4xl font-black uppercase tracking-tight text-black sm:text-5xl lg:text-6xl leading-[1.05]">
                REAL
                <br />
                SUPPLEMENTS.
                <br />
                REAL SHOP.
                <br />
                <span className="relative inline-block text-amber-500">
                  REAL RESULTS.
                  <span className="absolute left-0 -bottom-1 h-1.5 w-24 bg-amber-400 rounded-full" />
                </span>
              </h1>

              <p className="mt-6 text-sm font-semibold text-gray-700 leading-relaxed max-w-md">
                Sameer Deshwal has been guiding lifters in Panipat on what to actually take — and what
                to skip. Browse the catalogue, add to cart, and confirm your order on WhatsApp.
              </p>

              <p className="mt-4 text-xs font-black uppercase tracking-wider text-black">
                NO ADVANCE PAYMENT.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  SHOP SUPPLEMENTS <ArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappLink("Hi OM Nutrition, I want to ask a question.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <MessageSquare className="size-4 text-emerald-600" /> ASK ON WHATSAPP
                </a>
              </div>
            </div>

            {/* Right Studio Image Render Column (Edge to Edge, No Borders) */}
            <div className="md:col-span-7 lg:col-span-7 h-full w-full flex items-center justify-end overflow-hidden">
              <img
                src="/images/hero-podium.jpg"
                alt="Real Supplements ON Gold Standard Whey, Creatine, and MB Multivitamin"
                className="h-full w-full object-cover object-center max-h-[480px] md:max-h-[540px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4-VALUE PROPOSITION STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="grid grid-cols-2 divide-x divide-y md:divide-y-0 md:grid-cols-4 rounded-lg border border-gray-200 bg-white py-4 shadow-2xs">
          <div className="flex items-center gap-3 px-4 py-2 justify-center text-center md:text-left">
            <ShieldCheck className="size-6 shrink-0 text-black" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">100%</p>
              <p className="text-[11px] font-extrabold uppercase tracking-tight text-gray-700">SEALED & GENUINE</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 justify-center text-center md:text-left">
            <Truck className="size-6 shrink-0 text-black" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">SAME-DAY</p>
              <p className="text-[11px] font-extrabold uppercase tracking-tight text-gray-700">LOCAL DELIVERY</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 justify-center text-center md:text-left">
            <span className="text-xl font-black text-black">₹</span>
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">₹0</p>
              <p className="text-[11px] font-extrabold uppercase tracking-tight text-gray-700">ADVANCE PAYMENT</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 justify-center text-center md:text-left">
            <UserCheck className="size-6 shrink-0 text-black" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">TRUSTED BY</p>
              <p className="text-[11px] font-extrabold uppercase tracking-tight text-gray-700">1000+ LIFTERS</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-base font-black uppercase tracking-wider text-black">BROWSE BY CATEGORY</h2>
          <Link to="/products" className="flex items-center gap-1 text-xs font-extrabold uppercase text-black hover:underline">
            VIEW ALL <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_ITEMS.map((cat) => (
            <Link
              key={cat.name}
              to="/products"
              search={{ category: cat.slug }}
              className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-[#f9fafb] p-4 text-center transition-all hover:bg-white hover:shadow-md"
            >
              <div className="grid h-24 w-full place-items-center overflow-hidden">
                {cat.isIcon ? (
                  <Flame className="size-14 text-orange-500 fill-orange-500" />
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <span className="mt-3 text-xs font-black uppercase tracking-wider text-black">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TOP PICKS FOR YOU SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-base font-black uppercase tracking-wider text-black">TOP PICKS FOR YOU</h2>
          <Link to="/products" className="flex items-center gap-1 text-xs font-extrabold uppercase text-black hover:underline">
            VIEW ALL <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TOP_PICKS.map((item) => (
            <ProductCard
              key={item.id}
              product={item as unknown as Product}
              badge={item.badge}
              brand={item.brand}
              weight={item.weight}
            />
          ))}
        </div>
      </section>

      {/* 5. TRUST / ASSURANCE STRIP (4 Highlights) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 divide-x divide-y md:divide-y-0 md:grid-cols-4 rounded-lg border border-gray-200 bg-white py-5 shadow-xs">
          <div className="flex items-center gap-3 px-4 py-2">
            <ShieldCheck className="size-6 text-black shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">100% AUTHENTIC</p>
              <p className="text-[11px] font-semibold text-gray-500">Original products only</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <UserCheck className="size-6 text-black shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">EXPERT GUIDANCE</p>
              <p className="text-[11px] font-semibold text-gray-500">Get advice from experts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <Truck className="size-6 text-black shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">FAST DELIVERY</p>
              <p className="text-[11px] font-semibold text-gray-500">Same-day in Panipat</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <ShieldCheck className="size-6 text-black shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-black">SECURE & EASY</p>
              <p className="text-[11px] font-semibold text-gray-500">Pay on delivery (COD)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DUAL CALL-TO-ACTION (WHY SHOP WITH US? & NEED HELP CHOOSING?) */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Card: WHY SHOP WITH US? (Dark Black Card) */}
          <div className="relative overflow-hidden rounded-xl bg-black p-6 text-white sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                WHY SHOP WITH US?
              </h3>
              <ul className="mt-6 space-y-3.5 text-xs font-bold text-gray-200">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-white shrink-0 mt-0.5" />
                  <span>Handpicked, effective supplements</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-white shrink-0 mt-0.5" />
                  <span>Honest advice — what to take & what to skip</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-white shrink-0 mt-0.5" />
                  <span>No advance payment — pay on delivery</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-white shrink-0 mt-0.5" />
                  <span>Trusted by 1000+ fitness enthusiasts</span>
                </li>
              </ul>
            </div>

            {/* Coach Photo Positioned Bottom-Right */}
            <div className="mt-8 flex justify-end">
              <img
                src="/images/sameer-coach.jpg"
                alt="Sameer Deshwal"
                className="h-36 w-auto object-cover rounded-lg border border-gray-800"
              />
            </div>
          </div>

          {/* Right Card: NEED HELP CHOOSING? (Bright Gold / Yellow Card) */}
          <div className="relative overflow-hidden rounded-xl bg-amber-400 p-6 text-black sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black sm:text-2xl">
                NEED HELP CHOOSING?
              </h3>
              <p className="mt-3 text-xs font-extrabold text-black/80">
                Chat with Sameer Deshwal
              </p>
              <p className="mt-1 text-xs font-semibold text-black/70">
                Get personal recommendations based on your goal.
              </p>

              <div className="mt-6">
                <a
                  href={whatsappLink("Hi Sameer, I need help choosing the right supplement for my goal.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <MessageSquare className="size-4 text-emerald-400" /> CHAT ON WHATSAPP
                </a>
              </div>
            </div>

            {/* Coach Hoodie Photo & Signature overlay */}
            <div className="mt-6 flex items-end justify-between">
              <span className="font-serif italic text-2xl font-bold text-black/80">
                Sameer Deshwal
              </span>
              <img
                src="/images/sameer-hoodie.jpg"
                alt="Sameer Deshwal hoodie"
                className="h-36 w-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROMOTIONAL CARDS STRIP (3 Columns) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: COMBO OFFER */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9fafb] p-5">
            <div>
              <span className="rounded bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
                COMBO OFFER
              </span>
              <h4 className="mt-2 text-xs font-black text-black leading-snug">
                Whey + Creatine
                <br />
                Extra 5% Off
              </h4>
              <Link
                to="/products"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-black uppercase text-black hover:underline"
              >
                SHOP NOW <ArrowRight className="size-3" />
              </Link>
            </div>
            <img
              src="/images/prod-on-whey.jpg"
              alt="Whey + Creatine Combo"
              className="h-20 w-auto object-contain shrink-0"
            />
          </div>

          {/* Card 2: NEW ARRIVAL */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9fafb] p-5">
            <div>
              <span className="rounded bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
                NEW ARRIVAL
              </span>
              <h4 className="mt-2 text-xs font-black text-black leading-snug">
                Premium Pre-Workouts
                <br />
                Power your performance
              </h4>
              <Link
                to="/products"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-black uppercase text-black hover:underline"
              >
                EXPLORE NOW <ArrowRight className="size-3" />
              </Link>
            </div>
            <img
              src="/images/prod-mb-creatine.jpg"
              alt="Pre-Workout"
              className="h-20 w-auto object-contain shrink-0"
            />
          </div>

          {/* Card 3: BULK ORDERS */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9fafb] p-5">
            <div>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
                BULK ORDERS
              </span>
              <h4 className="mt-2 text-xs font-black text-black leading-snug">
                Special Prices for
                <br />
                Gyms & Teams
              </h4>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-black uppercase text-black hover:underline"
              >
                CONTACT NOW <ArrowRight className="size-3" />
              </Link>
            </div>
            <img
              src="/images/p-gainer.jpg"
              alt="Bulk Gym Supplements"
              className="h-20 w-auto object-contain shrink-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

