import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/lib/catalog-types";
import { currency } from "@/lib/site";
import { useCart } from "@/store/cart";

interface ProductCardProps {
  product: Product;
  badge?: "BEST SELLER" | "POPULAR" | string;
  brand?: string;
  weight?: string;
}

export function ProductCard({ product, badge, brand, weight }: ProductCardProps) {
  const add = useCart((s) => s.add);

  // Fallback metadata if not directly in product schema
  const displayBrand = brand || (product as any).brand || "Optimum Nutrition";
  const displayWeight = weight || (product as any).weight || "(2 lbs)";
  const displayBadge = badge || (product as any).badge;

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-xs transition-shadow hover:shadow-md">
      {/* Product Image Container with Tag Badge */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-gray-50 flex items-center justify-center p-3">
        {displayBadge && (
          <span
            className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${
              displayBadge === "BEST SELLER"
                ? "bg-black text-amber-400"
                : "bg-amber-400 text-black"
            }`}
          >
            {displayBadge}
          </span>
        )}
        <Link to="/products/$slug" params={{ slug: product.slug }} className="block size-full">
          <img
            src={product.images?.[0] || "/images/prod-on-whey.jpg"}
            alt={product.name}
            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Info Stack */}
      <div className="flex flex-1 flex-col pt-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
          {displayBrand}
        </span>
        <h3 className="text-xs font-black text-black leading-snug mt-0.5 line-clamp-2">
          <Link to="/products/$slug" params={{ slug: product.slug }}>
            {product.name} {displayWeight && <span className="font-normal text-gray-600">{displayWeight}</span>}
          </Link>
        </h3>

        {/* Price & Add to Cart Square Button */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-black text-black">
            {currency(product.price)}
          </span>
          <button
            onClick={() => {
              add({
                product_id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image: product.images?.[0] ?? null,
              });
              toast.success(`${product.name} added to cart`);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="grid size-8 place-items-center rounded bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="size-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </article>
  );
}

