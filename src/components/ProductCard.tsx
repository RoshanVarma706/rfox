import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { addToCart, toggleWishlist, useStore } from "@/lib/store";
import { notify, openCart } from "@/lib/ui-store";
import { DenimArt } from "@/components/DenimArt";
import { Chip, Stars } from "@/components/ui";
import { cn, inr } from "@/lib/utils";

const badgeTone = {
  New: "ink",
  Bestseller: "red",
  Limited: "ink",
  Restock: "sand",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const state = useStore();
  const saved = state.wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const [cover, second] = product.images ?? [];

  return (
    <article className="group relative">
      <div
        className={cn(
          "art-stage relative aspect-[4/5] overflow-hidden border border-line",
          outOfStock && "opacity-80",
        )}
      >
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          {cover ? (
            <>
              <img
                src={cover}
                alt={`${product.name} — ${product.wash}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              {second && (
                <img
                  src={second}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
            </>
          ) : (
            <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]">
              <DenimArt palette={product.palette} silhouette={product.silhouette} />
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <div className="flex flex-col gap-1.5">
            {product.badge && <Chip tone={badgeTone[product.badge]}>{product.badge}</Chip>}
            {outOfStock && <Chip tone="light">Sold out</Chip>}
          </div>
          <button
            type="button"
            onClick={() => {
              toggleWishlist(product.id);
              notify(saved ? "Removed from wishlist" : "Saved to wishlist");
            }}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-paper/80 backdrop-blur transition-all hover:bg-paper"
          >
            <Heart className={cn("h-4 w-4", saved ? "fill-red text-red" : "text-ink")} strokeWidth={1.6} />
          </button>
        </div>

        {off > 0 && (
          <span className="absolute bottom-3 left-3 bg-paper/90 px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur">
            {off}% off
          </span>
        )}

        {!outOfStock && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-paper/95 p-3 backdrop-blur transition-transform duration-500 ease-out group-hover:translate-y-0">
            <div className="flex items-center gap-1.5">
              <span className="mr-1 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                Quick add
              </span>
              {product.sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    addToCart(product.id, size, 1);
                    openCart();
                    notify(`${product.name} · size ${size} added`);
                  }}
                  className="grid h-8 min-w-8 place-items-center border border-line px-1 text-[11px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                >
                  {size}
                </button>
              ))}
              <Link
                to={`/product/${product.slug}`}
                aria-label={`View ${product.name}`}
                className="ml-auto grid h-8 w-8 place-items-center border border-ink bg-ink text-cream"
              >
                <Plus className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <p className="text-[9.5px] font-semibold uppercase tracking-label text-muted">
            {product.fit} · {product.wash}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="mt-1.5 block truncate font-display text-lg font-semibold leading-tight text-ink transition-colors hover:text-red sm:text-[21px]"
          >
            {product.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-[10px] text-muted">
              {product.rating > 0 ? product.rating.toFixed(1) : "New"} · {product.reviewCount}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[15px] font-medium">{inr(product.price)}</p>
          <p className="text-[11px] text-muted line-through">{inr(product.mrp)}</p>
        </div>
      </div>
    </article>
  );
}
