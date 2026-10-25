import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { whatsappLink } from "@/lib/brand";
import { openCart } from "@/lib/ui-store";
import { BrandLogo } from "@/components/BrandLogo";
import { DenimArt } from "@/components/DenimArt";
import { Marquee } from "@/components/ui";
import { cn, inr } from "@/lib/utils";

const NAV = [
  { label: "Shop all", to: "/shop" },
  { label: "Jeans", to: "/shop?category=Jeans" },
  { label: "Jackets", to: "/shop?category=Jackets" },
  { label: "Our craft", to: "/#craft" },
  { label: "Wholesale", to: "/#wholesale" },
];

const TICKER = [
  "Free shipping across India over ₹2,499",
  "Cut & sewn in Ahmedabad",
  "14-day easy returns",
  "Wholesale rates for retailers",
  "New drop — Selvage No. 7",
];

export function SiteHeader() {
  const state = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const cartQty = state.cart.reduce((sum, line) => sum + line.qty, 0);
  const wishCount = state.wishlist.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return state.products
      .filter((product) =>
        [product.name, product.category, product.wash, product.fit, product.story]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 4);
  }, [query, state.products]);

  const isActive = (to: string) => {
    if (to.includes("#")) {
      const [base, hash] = to.split("#");
      return location.pathname === base && location.hash === `#${hash}`;
    }
    const [path, search] = to.split("?");
    if (location.pathname !== path) return false;
    if (!search) return !location.search;
    return location.search.includes(search);
  };

  return (
    <>
      <header
        className={cn(
        "sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_18px_40px_-34px_rgba(18,17,20,0.9)]",
      )}
    >
      <div className="border-b border-line bg-cream text-ink">
        <div className="container-x flex h-8 items-center justify-between">
          <Marquee items={TICKER} className="w-full text-ink/70 sm:w-auto sm:flex-1" />
          <div className="hidden shrink-0 items-center gap-5 pl-6 text-[10px] font-semibold uppercase tracking-label text-muted sm:flex">
            <span>Since 2009</span>
            <span className="h-3 w-px bg-line" />
            <a
              href={whatsappLink("Hi Rfox, I have a question about an order.")}
              target="_blank"
              rel="noreferrer"
              className="link-line text-ink"
            >
              Chat with us
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-[74px] sm:gap-4">
        <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="Rfox home">
          <BrandLogo className="h-[26px]" />
          <span className="hidden h-6 w-px bg-line sm:block" aria-hidden />
          <span className="hidden text-[9px] font-semibold uppercase leading-[1.5] tracking-[0.2em] text-muted sm:block">
            Kumar
            <br />
            Clothing
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "link-line text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors",
                isActive(item.to) ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Search products"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 sm:grid"
          >
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.6} />
            {wishCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red px-1 text-[9px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            {cartQty > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red px-1 text-[9px] font-bold text-white">
                {cartQty}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* search panel */}
      <div
        className={cn(
          "overflow-hidden border-t border-line/70 bg-cream transition-[max-height,opacity] duration-500",
          searchOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container-x py-7">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
              setSearchOpen(false);
            }}
            className="flex items-center gap-4 border-b border-line pb-3"
          >
            <Search className="h-4 w-4 text-muted" strokeWidth={1.6} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search denim, washes, fits…"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted/70"
            />
            <button type="submit" className="text-[10px] font-semibold uppercase tracking-label text-ink">
              Search
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X className="h-4 w-4 text-muted" />
            </button>
          </form>

          {query.trim() ? (
            <div className="mt-4 grid gap-1">
              {results.length === 0 && (
                <p className="py-4 text-sm text-muted">No matches for “{query}”. Try “indigo”, “slim” or “cargo”.</p>
              )}
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="flex items-center gap-4 rounded-sm px-2 py-2 transition-colors hover:bg-sand/50"
                >
                  <span className="h-14 w-12 shrink-0 bg-sand/60">
                    <DenimArt palette={product.palette} silhouette={product.silhouette} showTag={false} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">{product.name}</span>
                    <span className="block text-[10px] uppercase tracking-label text-muted">
                      {product.category} · {product.wash}
                    </span>
                  </span>
                  <span className="text-sm text-muted">{inr(product.price)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-label text-muted">
              <span className="text-muted/70">Trending</span>
              {["Selvage", "Rinse indigo", "Cargo", "Trucker jacket"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-line px-3 py-1.5 transition-colors hover:border-ink hover:text-ink"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      </header>

      {/* mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-paper shadow-lift transition-transform duration-500",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <BrandLogo className="h-6" />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-6">
            {NAV.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className="border-b border-line/70 py-4 font-display text-2xl text-ink"
              >
                <span className="mr-3 text-[10px] tracking-label text-muted">0{index + 1}</span>
                {item.label}
              </Link>
            ))}
            <Link to="/wishlist" className="border-b border-line/70 py-4 font-display text-2xl text-ink">
              <span className="mr-3 text-[10px] tracking-label text-muted">06</span>
              Wishlist
            </Link>
            <Link to="/admin" className="border-b border-line/70 py-4 font-display text-2xl text-ink">
              <span className="mr-3 text-[10px] tracking-label text-muted">07</span>
              Inventory desk
            </Link>
          </nav>
          <div className="safe-bottom mt-auto space-y-3 px-6 pt-6 text-[11px] uppercase tracking-label text-muted">
            <p>Ahmedabad · Gujarat</p>
            <a href="https://www.instagram.com/rfox_jeans" target="_blank" rel="noreferrer" className="block text-ink">
              Instagram @rfox_jeans
            </a>
            <a href="https://www.facebook.com/rfoxjeans" target="_blank" rel="noreferrer" className="block text-ink">
              Facebook /rfoxjeans
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
