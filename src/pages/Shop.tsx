import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Category } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<Category | "All"> = ["All", "Jeans", "Jackets", "Cargo", "Shirts"];
const FITS = ["All", "Slim", "Straight", "Relaxed", "Wide", "Cargo", "Trucker", "Overshirt"];
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function Shop() {
  const state = useStore();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get("category") ?? "All";
  const fit = params.get("fit") ?? "All";
  const query = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";
  const inStockOnly = params.get("stock") === "1";

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const products = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = state.products.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (fit !== "All" && product.fit !== fit) return false;
      if (inStockOnly && product.stock <= 0) return false;
      if (!term) return true;
      return [product.name, product.wash, product.fit, product.category, product.story]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [state.products, category, fit, query, sort, inStockOnly]);

  const activeCount =
    Number(category !== "All") + Number(fit !== "All") + Number(Boolean(query)) + Number(inStockOnly);

  return (
    <main className="min-h-[70vh]">
      <section className="border-b border-line bg-cream">
        <div className="container-x py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-label text-muted">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink">Shop</span>
          </nav>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>The range</Eyebrow>
              <h1 className="mt-4 text-[clamp(38px,6vw,68px)] leading-[0.98]">
                Every pair,
                <br />
                <span className="text-muted">one place.</span>
              </h1>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-muted">
              {state.products.length} styles, five washes, four fits. Sizes 28–38 in denim, S–XXL in jackets and
              shirting. All prices include GST.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-24 z-30 border-b border-line bg-paper/95 backdrop-blur sm:top-[106px]">
        <div className="container-x flex flex-wrap items-center gap-3 py-3.5">
          <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setParam("category", item)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  category === item ? "bg-ink text-cream" : "text-muted hover:bg-ink/5 hover:text-ink",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden items-center md:flex">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted" />
              <input
                value={query}
                onChange={(event) => setParam("q", event.target.value || null)}
                placeholder="Search"
                className="h-9 w-[168px] border border-line bg-transparent pl-8 pr-3 text-[12px] outline-none transition-colors focus:border-ink"
              />
            </div>

            <select
              value={sort}
              onChange={(event) => setParam("sort", event.target.value)}
              aria-label="Sort products"
              className="h-9 border border-line bg-transparent px-2 text-[10px] font-semibold uppercase tracking-[0.12em] outline-none transition-colors focus:border-ink"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className={cn(
                "flex h-9 items-center gap-2 border px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
                activeCount ? "border-ink bg-ink text-cream" : "border-line hover:border-ink",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeCount > 0 && <span>({activeCount})</span>}
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div className="border-t border-line bg-cream">
            <div className="container-x grid gap-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="label">Search</p>
                <input
                  value={query}
                  onChange={(event) => setParam("q", event.target.value || null)}
                  placeholder="Wash, fit, style…"
                  className="mt-2 w-full border-b border-line bg-transparent py-2 text-[13px] outline-none focus:border-ink"
                />
              </div>
              <div>
                <p className="label">Fit</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {FITS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setParam("fit", option)}
                      className={cn(
                        "border px-3 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors",
                        fit === option ? "border-ink bg-ink text-cream" : "border-line hover:border-ink",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Availability</p>
                <button
                  type="button"
                  onClick={() => setParam("stock", inStockOnly ? null : "1")}
                  className={cn(
                    "mt-2 flex items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors",
                    inStockOnly ? "border-ink bg-ink text-cream" : "border-line hover:border-ink",
                  )}
                >
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      inStockOnly ? "bg-red" : "border border-muted",
                    )}
                  />
                  In stock only
                </button>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-muted hover:text-ink"
                >
                  <X className="h-3 w-3" /> Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="container-x py-10">
        <div className="mb-7 flex items-center justify-between text-[10px] uppercase tracking-label text-muted">
          <p>
            {products.length} {products.length === 1 ? "style" : "styles"}
            {query && <span className="text-ink"> · “{query}”</span>}
          </p>
          <p className="hidden sm:block">Prices include GST</p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-line py-24 text-center">
            <p className="font-display text-3xl">Nothing matches that yet</p>
            <p className="max-w-sm text-sm text-muted">
              Try a different wash or clear the filters — the full range is only ten styles deep.
            </p>
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="mt-2 border-b border-ink pb-1 text-[10px] font-semibold uppercase tracking-label"
            >
              Reset the filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index, 6) * 0.04}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
