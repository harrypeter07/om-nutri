# OM Nutrition Hub

# OM Nutrition — Master Build Prompt
**For use with Claude Code, v0, Cursor, or any AI dev tool. Paste this whole doc as the brief.**

---

## 0. Project one-liner

Build a modern, animated, SEO-optimized e-commerce website for **OM Nutrition**, a supplement store in Panipat, India (owner: Sameer Deshwal). Stack: **Next.js 14 (App Router) + Supabase + Tailwind CSS + Framer Motion/GSAP**. No online payment gateway — checkout ends by saving the order to the database and redirecting the customer to the owner's **WhatsApp** with a pre-filled order summary.

---

## 1. Brand & Design System

**Logo reference:** circular navy badge, blue gym/muscle mascot, bold "OM NUTRITIONS" wordmark.

**Direction:** light-mode-first (white/off-white canvas), NOT a dark Instagram-style theme — use the logo's blue as the accent/energy color instead of as a background.

```
--color-bg:            #F8FAFC   /* off-white canvas */
--color-surface:       #FFFFFF   /* cards */
--color-primary:       #0B1F4D   /* deep navy — logo blue, headings, nav */
--color-accent:        #2D8CFF   /* electric blue — CTAs, links, highlights */
--color-accent-2:      #38E1C6   /* cyan/teal — secondary highlight, gradients */
--color-text:          #10192E   /* near-black navy for body text */
--color-muted:         #64748B   /* secondary text */
--color-success:       #22C55E   /* stock/in-stock, confirmations */
--color-warning:       #F59E0B   /* low stock, ratings */
--color-border:        #E2E8F0
```

- **Typography:** a geometric/grotesk sans for headings (e.g. Space Grotesk / Sora — bold, slightly futuristic) + a clean readable sans for body (Inter/Manrope).
- **Visual language:** soft gradients (navy → electric blue), subtle glassmorphism cards, rounded-2xl corners, glowing accent edges on hover, micro-interactions everywhere. Avoid generic Bootstrap look — asymmetric hero, layered depth, real photography of the store/products (not stock icons).
- **Category colors** (pull straight from their Instagram highlights, keep as tags across the site): Weight Gain, Weight Loss, Pre-Workout, Healthy Gain / Wellness, General Supplements.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, Server Components, ISR) |
| Styling | Tailwind CSS + shadcn/ui components |
| Animation | Framer Motion (page/element transitions) + GSAP + ScrollTrigger (hero parallax, scroll reveals) |
| Backend/DB | Supabase (Postgres + Row Level Security) |
| Storage | Supabase Storage (product images) |
| Auth | Supabase Auth — **admin only**, customers checkout as guests |
| Hosting | Vercel (free tier) |
| Forms/validation | React Hook Form + Zod |
| State (cart) | Zustand with persist middleware (localStorage) |
| Email (optional backup) | Resend free tier — order confirmation email to owner as backup to WhatsApp |
| Analytics | Google Analytics 4 + Meta Pixel (free) |
| Search console | Google Search Console + Bing Webmaster Tools (free) |

---

## 3. Site architecture

```
/                     → Home (hero, categories, bestsellers, testimonials, trust bar, store location)
/products             → Product listing (filter by category/goal, sort by price/rating)
/products/[slug]      → Product detail (images, description, benefits, reviews, related products)
/cart                 → Cart drawer or full page
/checkout             → Address form → order review → "Confirm Order" (see §5)
/about                → Owner story, store photos, certifications, why-trust-us
/reviews              → All reviews aggregated (optional, or embedded per-product only)
/contact              → Map embed (Panipat), phone numbers, WhatsApp button, store hours
/admin (protected)    → Supabase-auth-gated: manage products, view orders, moderate reviews
```

---

## 4. Supabase schema

```sql
-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,          -- Weight Gain, Weight Loss, Pre-Workout, Healthy Gain, General
  slug text unique not null,
  icon text
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category_id uuid references categories(id),
  price numeric not null,
  compare_at_price numeric,           -- for "was/now" pricing
  description text,
  benefits text[],                    -- bullet points
  ingredients text,
  images text[],                      -- Supabase Storage URLs
  stock int default 0,
  is_featured boolean default false,
  rating_avg numeric default 0,
  rating_count int default 0,
  created_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  customer_name text not null,
  rating int check (rating between 1 and 5),
  comment text,
  approved boolean default false,     -- owner approves before it goes live
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text default 'Panipat',
  pincode text,
  items jsonb not null,               -- [{product_id, name, qty, price}]
  total_amount numeric not null,
  status text default 'pending',      -- pending, contacted, confirmed, delivered
  whatsapp_sent boolean default true,
  created_at timestamptz default now()
);
```

Enable **Row Level Security**: public can `select` on `products`/`categories`/approved `reviews`; public can `insert` on `orders` and `reviews` (unapproved) only; all `update`/`delete` restricted to the authenticated admin role.

---

## 5. Cart → Checkout → WhatsApp flow (core requirement)

1. Customer browses `/products`, adds items to cart (Zustand store, persists in localStorage, shown as a slide-out drawer with live count/total).
2. `/checkout`: form collects **name, phone, address, city, pincode** (React Hook Form + Zod validation — Indian phone number format, required fields).
3. Order summary shown (items, qty, subtotal) — no payment step.
4. On **"Confirm Order"**:
   - Insert a row into `orders` via a Supabase server action/route handler.
   - Build a formatted WhatsApp message, e.g.:
     ```
     New Order — OM Nutrition
     Name: {name}
     Phone: {phone}
     Address: {address}, {city} - {pincode}
     Items:
     - {qty} x {product name} — ₹{price}
     Total: ₹{total}
     ```
   - URL-encode it and redirect to `https://wa.me/91<OWNER_NUMBER>?text=<encoded_message>` (use `window.location.href` or open in a new tab).
   - Show a success screen: "Order received! We've opened WhatsApp — please hit send to confirm with OM Nutrition."
5. Owner's WhatsApp number(s) should be an env variable (`NEXT_PUBLIC_WHATSAPP_NUMBER`) — from the Instagram bio: 9813026045 / 9138161615 (confirm the primary one with the client, since their posts show several different numbers — see audit below).

---

## 6. Reviews

- Star rating + comment, submitted from the product page (name + rating + comment, no login required).
- New reviews insert with `approved = false`; only `approved = true` reviews render publicly.
- Admin page to approve/reject.
- Show `rating_avg`/`rating_count` as a summary badge on product cards and the homepage testimonials section (seed with a few real testimonials from existing customers if the owner has any — WhatsApp screenshots, etc., re-typed as text, never fabricated).

---

## 7. Animations

- **Hero:** GSAP timeline — logo/mascot subtly floats, headline text splits and animates in, CTA button has a glowing pulse.
- **Scroll reveals:** GSAP ScrollTrigger fades/slides category cards and product cards into view as the user scrolls.
- **Page/route transitions:** Framer Motion `AnimatePresence` for smooth fades between pages.
- **Micro-interactions:** button hover glow, add-to-cart "flying icon" to the cart badge, skeleton loaders while product data streams in.
- Keep animations under ~400ms and respect `prefers-reduced-motion`.

---

## 8. SEO requirements

- Use Next.js Metadata API per route (`title`, `description`, `openGraph`, `twitter`) — unique per product page, written around real search intent ("whey protein Panipat", "weight gain supplements Panipat", etc.).
- **Structured data (JSON-LD):** `LocalBusiness` on the homepage/contact page (name, address, phone, geo, opening hours) and `Product` + `AggregateRating` schema on each product page.
- Auto-generate `sitemap.xml` and `robots.txt` via Next.js conventions.
- Use `next/image` everywhere with descriptive `alt` text (helps both SEO and accessibility).
- Server-render/ISR product pages (not client-only) so content is crawlable.
- Fast Core Web Vitals: optimize/compress images on upload, lazy-load below-the-fold sections, avoid layout shift.
- Register the site on Google Search Console + Google Business Profile (their store already has a physical location — huge local-SEO win that Instagram alone doesn't capture).

---

## 9. Free-tier tooling checklist

- Hosting: **Vercel** (free)
- DB/Storage/Auth: **Supabase** (free tier)
- Domain: cheapest available `.com`/`.in` (only real cost)
- Email: **Resend** free tier for order-notification backup
- Analytics: **GA4** + **Meta Pixel** (free)
- Image optimization: built into `next/image`
- Maps: Google Maps embed (free, no API key needed for a basic iframe embed)

---

## 10. Admin panel (MVP)

Simplest viable version: a `/admin` route gated by Supabase Auth (owner logs in with email/password) showing three tabs — **Orders** (list, mark status), **Products** (add/edit/delete, upload images to Supabase Storage), **Reviews** (approve/reject). Doesn't need to be fancy; a plain table UI with shadcn/ui `DataTable` is enough for v1.

---

## Instagram audit → what it means for the site

Based on the **@omnutrition_panipat** profile (328 followers, 2 following):

- **Bio has a typo** ("suppliments") and lists two phone numbers — but the video posts show at least three *different* numbers across different reels (9053615001, 9813026045, 9671155331, 9138161615). **Fix on the website:** pick ONE canonical phone/WhatsApp number and use it everywhere (header, footer, checkout redirect, LocalBusiness schema). Inconsistent numbers are actively hurting local SEO and customer trust — this is the single highest-priority fix.
- **Highlights are already a de-facto category system** — Healthy Gain, Weight Gain, Weight Loss Tip, Pre-Workout. Reuse these exact categories as the site's product taxonomy so returning Instagram followers feel at home.
- **No link in bio / no website / no catalog** — right now the only path to purchase is calling or DMing. The site (with a direct WhatsApp-checkout flow) removes that friction while keeping WhatsApp as the trusted final step, matching how the audience already prefers to transact.
- **Founder appears on camera in every reel** — strong trust signal. Give him a proper "About/Founder" section with a real photo instead of only stock imagery.
- **Physical storefront exists** ("OM NUTRITION" signage shown) — lean hard into local SEO (Google Business Profile + LocalBusiness schema + embedded map + store hours), since a supplement shop in Panipat is very winnable on local search with almost no competition online.
- **No reviews/testimonials anywhere on Instagram** — the website's review system will be the first place OM Nutrition has social proof anyone can see before buying, so it's worth seeding with a handful of real early reviews once the site is live.
- **328 followers / small but consistent posting** — content style (price-forward, phone-number-overlay reels) suggests a price- and offer-driven audience; consider a "This week's deal" or "Bestsellers" strip on the homepage to mirror that.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a7b3a25-cd55-4283-a0f2-cc2e7314868e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
