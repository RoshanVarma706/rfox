import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { toggleWishlist, useStore } from "@/lib/store";
import { notify } from "@/lib/ui-store";
import { ProductCard } from "@/components/ProductCard";
import { btn, Eyebrow } from "@/components/ui";

export default function Wishlist() {
  const state = useStore();
  const saved = state.products.filter((product) => state.wishlist.includes(product.id));

  return (
    <main className="container-x min-h-[65vh] py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <div>
          <Eyebrow>Saved for later</Eyebrow>
          <h1 className="mt-4 text-[clamp(30px,5vw,56px)] leading-none">
            Your wishlist
            <span className="ml-3 align-top font-sans text-[11px] font-semibold uppercase tracking-label text-muted">
              {saved.length} {saved.length === 1 ? "pair" : "pairs"}
            </span>
          </h1>
        </div>
        {saved.length > 0 && (
          <button
            type="button"
            onClick={() => {
              saved.forEach((product) => toggleWishlist(product.id));
              notify("Wishlist cleared");
            }}
            className="text-[10px] font-semibold uppercase tracking-label text-muted underline decoration-line underline-offset-4 hover:text-ink"
          >
            Clear wishlist
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-line">
            <Heart className="h-6 w-6 text-muted" strokeWidth={1.3} />
          </span>
          <p className="font-display text-3xl">Nothing saved yet</p>
          <p className="max-w-sm text-sm text-muted">
            Tap the heart on any style to keep it here while you decide on the wash.
          </p>
          <Link to="/shop" className={btn("ink")}>
            Browse the range
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
