import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import {
  addReview,
  addToCart,
  productBySlug,
  reviewsFor,
  toggleWishlist,
  useStore,
} from "@/lib/store";
import { notify, openCart } from "@/lib/ui-store";
import { brand, whatsappLink } from "@/lib/brand";
import { DenimArt } from "@/components/DenimArt";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { btn, Chip, Eyebrow, Stars } from "@/components/ui";
import { cn, inr, shortDate } from "@/lib/utils";

const VIEWS = ["Front", "Waistband", "Hem", "Fabric"] as const;

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const state = useStore();
  const product = slug ? productBySlug(state, slug) : undefined;

  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [viewIndex, setViewIndex] = useState(0);
  const [openPanel, setOpenPanel] = useState<string | null>("fit");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const reviews = product ? reviewsFor(state, product.id) : [];

  const related = useMemo(() => {
    if (!product) return [];
    return state.products
      .filter((item) => item.id !== product.id)
      .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
      .slice(0, 4);
  }, [product, state.products]);

  useEffect(() => {
    setSize("");
    setQty(1);
    setViewIndex(0);
  }, [slug]);

  if (!product) {
    return (
      <main className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
        <p className="font-display text-4xl">That style has moved on</p>
        <p className="max-w-sm text-sm text-muted">
          The pair you were looking for isn&rsquo;t in this drop. Browse the full range instead.
        </p>
        <Link to="/shop" className={btn("ink")}>
          Back to the range
        </Link>
      </main>
    );
  }

  const saved = state.wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 6;
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const rating = product.rating;

  const add = () => {
    if (!size) {
      notify("Pick a size first");
      return;
    }
    addToCart(product.id, size, qty);
    openCart();
    notify(`${product.name} · size ${size} added`);
  };

  const galleryStyle: Record<(typeof VIEWS)[number], string> = {
    Front: "scale(1) translateY(0)",
    Waistband: "scale(2.2) translate(0%, 22%)",
    Hem: "scale(2.2) translate(0%, -38%)",
    Fabric: "scale(3.2) translate(-8%, -20%)",
  };

  const photos = product.images ?? [];
  const media: Array<{ label: string; src?: string; zoom?: number }> = photos.length
    ? [
        ...photos.map((src, index) => ({ label: index === 0 ? "Front" : `View ${index + 1}`, src })),
        ...(photos.length < 3
          ? [
              { label: "Detail", src: photos[0], zoom: 1.9 },
              { label: "Fabric", src: photos[0], zoom: 2.8 },
            ]
          : []),
      ]
    : VIEWS.map((label) => ({ label }));
  const active = media[Math.min(viewIndex, media.length - 1)];
  const activeArtStyle =
    galleryStyle[active.label as (typeof VIEWS)[number]] ?? "scale(1) translateY(0)";

  return (
    <main>
      <div className="container-x flex items-center gap-2 border-b border-line py-4 text-[10px] uppercase tracking-label text-muted">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span className="hidden sm:inline">/</span>
        <span className="hidden truncate text-ink sm:inline">{product.name}</span>
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
        {/* gallery */}
        <div className="lg:col-span-7">
          <div className="grid gap-3 sm:grid-cols-[84px_1fr]">
            <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
              {media.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  type="button"
                  onClick={() => setViewIndex(index)}
                  className={cn(
                    "relative h-[76px] w-[60px] shrink-0 overflow-hidden border bg-cream transition-colors sm:h-[86px] sm:w-[70px]",
                    viewIndex === index ? "border-ink" : "border-line hover:border-muted",
                  )}
                  aria-label={`View ${item.label.toLowerCase()}`}
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ transform: item.zoom ? `scale(${item.zoom})` : undefined }}
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        transform:
                          item.label === "Front"
                            ? "scale(1)"
                            : galleryStyle[item.label as (typeof VIEWS)[number]],
                      }}
                    >
                      <DenimArt palette={product.palette} silhouette={product.silhouette} showTag={false} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div
              className={cn(
                "order-1 relative overflow-hidden border border-line sm:order-2",
                active.src ? "bg-cream" : "art-stage",
              )}
            >
              {!active.src && (
                <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_50%_20%,#ffffff,transparent_60%)]" />
              )}
              <div className="relative aspect-[4/5] overflow-hidden">
                {active.src ? (
                  <img
                    src={active.src}
                    alt={`${product.name} — ${active.label.toLowerCase()}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: active.zoom ? `scale(${active.zoom})` : undefined }}
                  />
                ) : (
                  <div
                    className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: activeArtStyle }}
                  >
                    <DenimArt palette={product.palette} silhouette={product.silhouette} />
                  </div>
                )}
              </div>
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.badge && <Chip tone="ink">{product.badge}</Chip>}
                {off > 0 && <Chip tone="red">{off}% off</Chip>}
              </div>
              <div className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
                {active.label} · {product.wash}
              </div>
            </div>
          </div>
        </div>

        {/* buy box */}
        <div className="lg:col-span-5">
          <p className="text-[10px] font-semibold uppercase tracking-label text-red">
            {product.category} · {product.fit}
          </p>
          <h1 className="mt-3 text-[clamp(32px,4.6vw,50px)] leading-[0.98]">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Stars value={rating} />
            <span className="text-[11px] text-muted">
              {rating > 0 ? rating.toFixed(1) : "New"} · {product.reviewCount} reviews
            </span>
            <a href="#reviews" className="text-[10px] uppercase tracking-label text-muted underline decoration-line underline-offset-4 hover:text-ink">
              Read reviews
            </a>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-3xl font-semibold">{inr(product.price)}</span>
            <span className="pb-1 text-[13px] text-muted line-through">{inr(product.mrp)}</span>
            <span className="pb-1.5 text-[10px] uppercase tracking-label text-red">Save {inr(product.mrp - product.price)}</span>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-label text-muted">Inclusive of all taxes</p>

          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted">{product.story}</p>

          <div className="mt-7 flex items-center gap-4 border-y border-line py-4">
            <span className="label">Wash</span>
            <span className="flex items-center gap-2">
              <span
                className="h-7 w-7 rounded-full ring-1 ring-inset ring-black/15"
                style={{ background: `linear-gradient(140deg, ${product.palette.light}, ${product.palette.base} 55%, ${product.palette.deep})` }}
              />
              <span className="text-[13px]">{product.wash}</span>
            </span>
            <span className="ml-auto text-[10px] uppercase tracking-label text-muted">
              {product.silhouette === "jeans" || product.silhouette === "cargo" ? "Sizes 28–38" : "Sizes S–XXL"}
            </span>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="label">Select size</p>
              <button
                type="button"
                onClick={() => setShowSizeGuide((open) => !open)}
                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-label text-muted transition-colors hover:text-ink"
              >
                <Ruler className="h-3.5 w-3.5" /> Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSize(option)}
                  className={cn(
                    "h-11 min-w-[52px] border px-3 text-[12px] font-medium transition-all",
                    size === option
                      ? "border-ink bg-ink text-cream"
                      : "border-line text-ink hover:border-ink",
                    outOfStock && "cursor-not-allowed opacity-40",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {showSizeGuide && (
              <div className="mt-4 border border-line bg-cream p-4 text-[12px]">
                <p className="label">Denim measurements (inches)</p>
                <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[300px] text-left">
                  <thead className="text-[9.5px] uppercase tracking-label text-muted">
                    <tr>
                      <th className="pb-2 font-semibold">Size</th>
                      <th className="pb-2 font-semibold">Waist</th>
                      <th className="pb-2 font-semibold">Inseam</th>
                      <th className="pb-2 font-semibold">Leg opening</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    {[
                      ["28", "28", "30", "13.5"],
                      ["30", "30", "30.5", "14"],
                      ["32", "32", "31", "14.5"],
                      ["34", "34", "31.5", "15"],
                      ["36", "36", "32", "15.5"],
                      ["38", "38", "32.5", "16"],
                    ].map((row) => (
                      <tr key={row[0]} className="border-t border-line/70">
                        {row.map((cell, index) => (
                          <td key={index} className="py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center gap-3 text-[11px]">
              {outOfStock ? (
                <span className="text-muted">Out of stock — restocking soon</span>
              ) : lowStock ? (
                <span className="flex items-center gap-1.5 font-medium text-red">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
                  Only {product.stock} left in this wash
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FA855]" />
                  In stock · ships in 24 hrs
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 sm:flex-nowrap">
            <div className="order-1 flex h-[52px] flex-1 items-center justify-between border border-line px-1 sm:order-none sm:w-[124px] sm:flex-none">
              <button
                type="button"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
                className="grid h-9 w-9 place-items-center text-muted hover:text-ink"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((value) => Math.min(product.stock || 1, value + 1))}
                aria-label="Increase quantity"
                className="grid h-9 w-9 place-items-center text-muted hover:text-ink"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={add}
              disabled={outOfStock}
              className={btn("primary", "md", "order-3 h-[52px] w-full sm:order-none sm:w-auto sm:flex-1")}
            >
              {outOfStock ? "Sold out" : "Add to bag"}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
                notify(saved ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label="Save to wishlist"              className={cn(
                "order-2 grid h-[52px] w-[52px] shrink-0 place-items-center border transition-colors sm:order-none",
                saved ? "border-red bg-red/15 text-red" : "border-line text-ink hover:border-ink",
              )}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-red")} strokeWidth={1.6} />
            </button>
          </div>

          <a
            href={whatsappLink(`Hi Rfox, I'm interested in ${product.name} (${product.wash}). Is my size available?`)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 border border-[#1FA855]/40 bg-[#1FA855]/5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#127a3c] transition-colors hover:bg-[#1FA855]/10"
          >
            Ask about this pair on WhatsApp
          </a>

          <div className="mt-6 grid gap-2.5 border-t border-line pt-5 text-[11px] text-muted sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-red" strokeWidth={1.6} /> Free shipping over {inr(brand.freeShippingAbove)}
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-red" strokeWidth={1.6} /> {brand.returnDays}-day easy returns
            </span>
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4 text-red" strokeWidth={1.6} /> Cash on delivery available
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red" strokeWidth={1.6} /> 2-year stitch warranty
            </span>
          </div>

          <div className="mt-7 border-t border-line">
            {[
              { id: "fit", title: "Fabric & fit", content: product.details },
              {
                id: "care",
                title: "Wash & care",
                content: [
                  "Machine wash cold, inside out",
                  "Line dry in shade — skip the dryer",
                  "Warm iron on reverse if needed",
                  "Wash with similar shades for the first three cycles",
                ],
              },
              {
                id: "shipping",
                title: "Shipping & returns",
                content: [
                  "Dispatched from Ahmedabad within 24 hours",
                  "Pan-India delivery in 3–7 working days",
                  `Free shipping over ${inr(brand.freeShippingAbove)} · ${inr(brand.shippingFee)} below`,
                  `${brand.returnDays}-day exchange on unworn pairs with tags intact`,
                ],
              },
            ].map((panel) => (
              <div key={panel.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenPanel(openPanel === panel.id ? null : panel.id)}
                  className="flex w-full items-center justify-between py-4 text-left text-[12px] font-semibold uppercase tracking-[0.12em]"
                >
                  {panel.title}
                  <ChevronDown
                    className={cn("h-4 w-4 text-muted transition-transform", openPanel === panel.id && "rotate-180")}
                  />
                </button>
                {openPanel === panel.id && (
                  <ul className="space-y-1.5 pb-4 text-[13px] text-muted">
                    {panel.content.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-line" />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
      <section id="reviews" className="scroll-mt-28 border-t border-line bg-cream py-16">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Reviews</Eyebrow>
            <h2 className="mt-4 text-[clamp(26px,3.4vw,40px)] leading-[1.05]">
              What owners
              <br />
              <span className="text-muted">say.</span>
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <span className="font-display text-5xl font-bold">{rating > 0 ? rating.toFixed(1) : "—"}</span>
              <div>
                <Stars value={rating} />
                <p className="mt-1 text-[10px] uppercase tracking-label text-muted">{product.reviewCount} reviews</p>
              </div>
            </div>
            <ReviewForm productId={product.id} />
          </div>

          <div className="lg:col-span-8">
            {reviews.length === 0 ? (
              <p className="border border-dashed border-line p-8 text-sm text-muted">
                No reviews on this style yet. Be the first to write one.
              </p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <Stars value={review.rating} />
                      <p className="text-[13px] font-medium">{review.title}</p>
                      <span className="ml-auto text-[10px] uppercase tracking-label text-muted">
                        {shortDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">{review.body}</p>
                    <p className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-label text-muted">
                      {review.name}
                      <span className="inline-flex items-center gap-1 text-[#1FA855]">
                        <ShieldCheck className="h-3 w-3" /> Verified buyer
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* related */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-[clamp(26px,3.4vw,40px)] leading-none">
            Pairs well <span className="text-muted">with.</span>
          </h2>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px] font-semibold uppercase tracking-label"
          >
            Shop all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {related.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <ProductCard product={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-[10px] font-semibold uppercase tracking-label transition-colors hover:bg-ink hover:text-cream"
      >
        <Star className="h-3.5 w-3.5" /> Write a review
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim() || !title.trim() || !body.trim()) {
          notify("Add a name, headline and a few words");
          return;
        }
        addReview({ productId, name: name.trim(), rating, title: title.trim(), body: body.trim() });
        notify("Thanks — your review is live");
        setOpen(false);
        setName("");
        setTitle("");
        setBody("");
      }}
      className="mt-6 border border-line bg-paper p-5"
    >
      <p className="label">Your rating</p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
            <Star className={cn("h-5 w-5", value <= rating ? "fill-red text-red" : "text-line")} strokeWidth={1.4} />
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="field" />
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Headline" className="field" />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="How does it fit? How does it wear?"
          rows={3}
          className="field resize-none"
        />
      </div>
      <button type="submit" className={btn("ink", "sm", "mt-4 w-full")}>
        Publish review
      </button>
    </form>
  );
}
