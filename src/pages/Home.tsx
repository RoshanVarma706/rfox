import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Droplets,
  Facebook,
  Instagram,
  Package,
  RotateCcw,
  Ruler,
  Scissors,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { brand, whatsappLink } from "@/lib/brand";
import { BrandLogo } from "@/components/BrandLogo";
import { useStore, subscribeEmail } from "@/lib/store";
import { notify } from "@/lib/ui-store";
import { DenimSwatch } from "@/components/DenimArt";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { btn, Chip, Eyebrow, SectionHeading, Stars } from "@/components/ui";
import { inr } from "@/lib/utils";

const FITS = [
  { name: "Slim", note: "Sharp, modern taper", slug: "Slim", image: "/catalog/ridge-1.jpg" },
  { name: "Straight", note: "The everyday cut", slug: "Straight", image: "/catalog/ashford-1.jpg" },
  { name: "Relaxed", note: "Room to move", slug: "Relaxed", image: "/catalog/foundry-1.jpg" },
  { name: "Cargo", note: "Utility, softened", slug: "Cargo", image: "/catalog/sandstorm-2.jpg" },
];

const LOOKBOOK = [
  { src: "/catalog/ashford-2.jpg", alt: "Model in light denim against a red studio wall", caption: "The rinse room" },
  { src: "/catalog/trucker-2.jpg", alt: "Denim jacket and jeans styled together", caption: "Double denim" },
  { src: "/catalog/ridge-2.jpg", alt: "Black jacket with mid-wash jeans", caption: "After hours" },
];

const CRAFT = [
  {
    step: "01",
    title: "Fabric first",
    copy: "We buy ring-spun and shuttle-loom denim by the roll, then reject anything with uneven slub or a weak selvedge.",
  },
  {
    step: "02",
    title: "Pattern & cut",
    copy: "Six base blocks, graded from 28 to 38. Every fit is trialled on real bodies before it reaches a cutting table.",
  },
  {
    step: "03",
    title: "Sewn in-house",
    copy: "Chain-stitched hems, bar-tacked stress points and YKK hardware — checked pair by pair at the Ahmedabad unit.",
  },
  {
    step: "04",
    title: "The wash house",
    copy: "Rinse, stone and raw finishes using low-water enzyme processes, so the hand is soft without the chemical weight.",
  },
];

const PROMISES = [
  { icon: Truck, title: "Free shipping", copy: "On orders over ₹2,499" },
  { icon: RotateCcw, title: "14-day returns", copy: "Exchange any size" },
  { icon: Banknote, title: "Cash on delivery", copy: "Pay when it arrives" },
  { icon: Store, title: "Wholesale desk", copy: "Retailer rate cards" },
];

const HERO_STATS = [
  { value: "2,400+", label: "Verified buyers" },
  { value: "60+", label: "Retailers stocked" },
  { value: "14-day", label: "Easy exchanges" },
];

export default function Home() {
  const state = useStore();
  const featured = state.products.filter((product) => product.featured).slice(0, 4);
  const spotlight = state.products.find((product) => product.slug === "selvage-no-7");
  const reviews = state.reviews.slice(0, 3);

  const [form, setForm] = useState({ name: "", shop: "", city: "", message: "" });
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const submitWholesale = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.city.trim()) {
      notify("Add your name and city so we can send rates");
      return;
    }
    const message = `Wholesale enquiry — Rfox\nName: ${form.name}\nShop: ${form.shop || "—"}\nCity: ${form.city}\nLooking for: ${
      form.message || "Denim range + rate card"
    }`;
    window.open(whatsappLink(message), "_blank", "noopener");
    notify("Opening WhatsApp with your enquiry");
  };

  const submitNewsletter = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      notify("That email doesn't look right");
      return;
    }
    subscribeEmail(email);
    setJoined(true);
    setEmail("");
    notify("You're on the Rfox list");
  };

  return (
    <main className="overflow-hidden">
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 hex-grid" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 -top-56 h-[640px] bg-[radial-gradient(52%_52%_at_50%_48%,rgba(229,24,42,0.24),transparent_72%)]" />

        <div className="container-x relative py-14 text-center sm:py-20 lg:py-24">
          <BrandLogo className="mx-auto h-14 drop-shadow-[0_10px_30px_rgba(229,24,42,0.35)] sm:h-20 lg:h-[92px]" />

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-label text-red sm:mt-8 sm:text-[11px]">
            {brand.parent} · premium denim
          </p>

          <h1 className="mx-auto mt-3 max-w-[20ch] text-[clamp(38px,8.2vw,88px)] leading-[0.96]">
            Denim with a <span className="text-red">fox&rsquo;s</span> edge.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-muted sm:mt-6 sm:text-[15.5px]">
            Serious denim, quietly made. Rinsed indigo, raw selvage and black that stays black — cut, sewn and washed
            in Ahmedabad, then shipped to your door.
          </p>

          <div className="mx-auto mt-7 flex w-full max-w-xs flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:justify-center">
            <Link to="/shop" className={btn("primary")}>
              Shop the collection
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/#wholesale" className={btn("outline")}>
              Wholesale rates
            </Link>
          </div>

          <div className="mx-auto mt-10 grid w-full max-w-2xl grid-cols-3 divide-x divide-line border-y border-line sm:mt-12">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="px-1.5 py-4 sm:px-3 sm:py-5">
                <p className="font-display text-base font-bold sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[8.5px] uppercase leading-tight tracking-[0.14em] text-muted sm:text-[10px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- promises */}
      <section className="border-b border-line bg-cream">
        <div className="container-x grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {PROMISES.map((promise) => (
            <div key={promise.title} className="flex items-start gap-3 py-5 lg:justify-center lg:px-6 lg:py-6">
              <promise.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em]">{promise.title}</p>
                <p className="mt-0.5 text-[10.5px] text-muted">{promise.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- featured */}
      <section className="container-x py-14 sm:py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="The current drop"
            title={
              <>
                Four pairs worth <span className="text-muted">clearing a shelf for.</span>
              </>
            }
            copy="Cut in small batches, washed slowly, priced without the showroom markup."
            action={
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px] font-semibold uppercase tracking-label"
              >
                View all {state.products.length} styles
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- lookbook */}
      <section className="border-t border-line bg-paper">
        <div className="container-x py-14 sm:py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Lookbook · SS26"
              title={
                <>
                  Worn the way <span className="text-muted">we cut it.</span>
                </>
              }
              copy="Shot in and around the Ahmedabad studio on the same pairs that ship to you."
              action={
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px] font-semibold uppercase tracking-label"
                >
                  Shop the looks
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
          </Reveal>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {LOOKBOOK.map((shot, index) => (
              <Reveal key={shot.caption} delay={index * 0.06}>
                <figure className="group relative aspect-[3/4] overflow-hidden border border-line">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-label text-white/55">
                        Look {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
                        {shot.caption}
                      </p>
                    </div>
                    <Link
                      to="/shop"
                      aria-label={`Shop ${shot.caption}`}
                      className="grid h-9 w-9 shrink-0 place-items-center border border-white/30 text-white transition-colors hover:bg-white hover:text-ink"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- fits */}
      <section className="border-y border-line bg-cream py-14 sm:py-20 lg:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Find your cut"
              title={
                <>
                  Four fits. <span className="text-muted">One standard.</span>
                </>
              }
              copy="Start with the silhouette, then choose the wash. Every pair is graded and measured, so a 32 is a 32."
            />
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
            {FITS.map((fit, index) => (
              <Reveal key={fit.name} delay={index * 0.05}>
                <Link
                  to={`/shop?fit=${encodeURIComponent(fit.slug)}`}
                  className="group relative block overflow-hidden border border-line bg-paper transition-colors hover:border-ink/30"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={fit.image}
                      alt={`${fit.name} fit denim`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-end justify-between border-t border-line px-3 py-3 sm:px-4 sm:py-3.5">
                    <div>
                      <p className="font-display text-lg font-semibold leading-none sm:text-xl">{fit.name}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-label text-muted sm:text-[10px]">{fit.note}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:text-red" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- craft */}
      <section id="craft" className="container-x scroll-mt-28 py-14 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden border border-line bg-cream">
                  <img
                    src="/catalog/craft-sewing.jpg"
                    alt="Sewing a denim waistband at the Rfox unit in Ahmedabad"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute right-4 top-4 h-20 w-20 overflow-hidden border border-line sm:h-24 sm:w-24">
                    <img
                      src="/catalog/selvage-2.jpg"
                      alt="Close-up of denim weave and stitching"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 border border-line bg-paper/95 px-3 py-2 backdrop-blur">
                    <Scissors className="h-4 w-4 shrink-0 text-red" strokeWidth={1.5} />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">
                      14 oz · Selvage
                      <span className="mt-0.5 block font-normal text-muted">Woven on shuttle looms</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5 border border-line bg-cream px-4 py-3">
                  <span className="label">Wash house</span>
                  {[
                    { name: "Rinse", palette: { base: "#2B4463", light: "#4F7093", deep: "#16283A" } },
                    { name: "Stone", palette: { base: "#6E8AA5", light: "#A2B8CB", deep: "#40576E" } },
                    { name: "Raw", palette: { base: "#22364F", light: "#3F5E7E", deep: "#0F1D2A" } },
                    { name: "Black", palette: { base: "#26262B", light: "#41414A", deep: "#111114" } },
                    { name: "Ecru", palette: { base: "#CDBFA6", light: "#E7DCC8", deep: "#A08F73" } },
                  ].map((wash) => (
                    <span key={wash.name} className="flex items-center gap-1.5 text-[10px] text-muted">
                      <DenimSwatch palette={wash.palette} className="h-3 w-3" />
                      {wash.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Inside the unit</Eyebrow>
              <h2 className="mt-4 text-[clamp(29px,4.4vw,52px)] leading-[1.05]">
                Built slowly, in a city that knows <span className="text-red">denim.</span>
              </h2>
              <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-muted">
                Rfox began as the denim label of Kumar Clothing, supplying retailers across Gujarat. We still run the
                same way: fabric chosen by hand, patterns trialled on real people, and every pair inspected before it
                is packed.
              </p>
            </Reveal>

            <div className="mt-8 divide-y divide-line border-y border-line">
              {CRAFT.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.05}>
                  <div className="grid grid-cols-[38px_1fr] gap-3 py-5 sm:grid-cols-[58px_1fr_auto] sm:items-baseline sm:gap-4">
                    <span className="font-display text-lg font-bold text-red sm:text-[22px]">{item.step}</span>
                    <div>
                      <p className="text-[14px] font-medium sm:text-[15px]">{item.title}</p>
                      <p className="mt-1 max-w-lg text-[12.5px] leading-relaxed text-muted sm:text-[13px]">
                        {item.copy}
                      </p>
                    </div>
                    <span className="hidden text-[9px] uppercase tracking-label text-muted/70 sm:block">
                      Ahmedabad
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[9.5px] uppercase tracking-label text-muted">
                <span className="flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-red" /> True to size
                </span>
                <span className="flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-red" /> Low-water washes
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-red" /> 2-year stitch warranty
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ spotlight */}
      {spotlight && (
        <section className="relative overflow-hidden border-y border-line bg-indigo-deep">
          <div className="absolute inset-0 hex-grid opacity-80" aria-hidden />
          <div className="container-x relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
            <div className="lg:col-span-5">                <div className="relative mx-auto max-w-[300px] sm:max-w-[360px]">
                  <div className="absolute -inset-3 border border-ink/10" />
                  <img
                    src={spotlight.images?.[0] ?? "/catalog/selvage-1.jpg"}
                    alt={spotlight.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full border border-line object-cover"
                  />
                </div>
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <span className="inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-label text-ink/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-red" />
                  Limited · 40 pairs per drop
                </span>
                <h2 className="mt-4 text-[clamp(29px,4.6vw,56px)] leading-[1.02]">
                  Selvage No. 7
                  <span className="mt-2 block font-sans text-[9.5px] font-semibold uppercase tracking-[0.26em] text-muted sm:text-[11px]">
                    Shuttle-loom · Chain-stitched · Numbered
                  </span>
                </h2>
                <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-muted sm:text-[15px]">
                  {spotlight.story}
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-5 sm:gap-6">
                  <div>
                    <p className="text-[9.5px] uppercase tracking-label text-muted">Drop price</p>
                    <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">{inr(spotlight.price)}</p>
                  </div>
                  <div className="min-w-[150px] flex-1">
                    <div className="flex items-center justify-between text-[9.5px] uppercase tracking-label text-muted">
                      <span>{spotlight.stock} of 40 left</span>
                      <span>Numbered</span>
                    </div>
                    <div className="mt-2 h-[3px] w-full bg-ink/15">
                      <div
                        className="h-full bg-red"
                        style={{ width: `${Math.min(100, (spotlight.stock / 40) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link to={`/product/${spotlight.slug}`} className={btn("primary")}>
                    Claim a pair
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={whatsappLink("Hi Rfox, is Selvage No. 7 available in my size?")}
                    target="_blank"
                    rel="noreferrer"
                    className={btn("outline")}
                  >
                    Ask about sizing
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- reviews */}
      <section className="container-x py-14 sm:py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Worn & reviewed"
            title={
              <>
                The people who <span className="text-muted">actually wear it.</span>
              </>
            }
            action={
              <div className="flex items-center gap-4 border border-line bg-cream px-5 py-3">
                <span className="font-display text-2xl font-bold sm:text-3xl">4.8</span>
                <div>
                  <Stars value={4.8} />
                  <p className="mt-1 text-[9.5px] uppercase tracking-label text-muted">2,400+ reviews</p>
                </div>
              </div>
            }
          />
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">
          {reviews.map((review, index) => {
            const product = state.products.find((item) => item.id === review.productId);
            return (
              <Reveal key={review.id} delay={index * 0.06}>
                <figure className="flex h-full flex-col border border-line bg-cream p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <Stars value={review.rating} />
                    <span className="text-[8.5px] uppercase tracking-label text-muted">Verified buyer</span>
                  </div>
                  <blockquote className="mt-4 flex-1">
                    <p className="font-display text-lg font-semibold leading-snug sm:text-xl">“{review.title}”</p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted sm:text-[13px]">{review.body}</p>
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                    <span className="text-[11px] font-medium">{review.name}</span>
                    {product && (
                      <Link
                        to={`/product/${product.slug}`}
                        className="text-[8.5px] uppercase tracking-label text-muted transition-colors hover:text-red"
                      >
                        {product.name}
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ wholesale */}
      <section id="wholesale" className="scroll-mt-28 border-y border-line bg-cream py-14 sm:py-20 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Wholesale · since 2009</Eyebrow>
              <h2 className="mt-4 text-[clamp(29px,4.4vw,50px)] leading-[1.05]">
                Stock the denim that <span className="text-red">reorders itself.</span>
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted sm:mt-5 sm:text-[15px]">
                Rfox supplies shops, boutiques and resellers across Gujarat and beyond. Size-set orders, consistent
                grading and fast repeat dispatch from our Amraiwadi unit.
              </p>
              <ul className="mt-6 space-y-2.5 text-[13px]">
                {[
                  "MOQ 24 pieces, mixed sizes",
                  "Retailer rate card on request",
                  "Pan-India dispatch in 3–7 days",
                  "Private label options on repeat orders",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-red" />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-3 text-[11px] text-muted">
                <Package className="h-4 w-4 text-red" strokeWidth={1.6} />
                Ask for the full catalogue with wash swatches.
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <form onSubmit={submitWholesale} className="border border-line bg-paper p-5 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-xl font-bold sm:text-2xl">Request wholesale rates</p>
                  <span className="text-[9px] uppercase tracking-label text-muted">Replies within a day</span>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">Your name *</span>
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Rakesh Patel"
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label">Shop / business</span>
                    <input
                      value={form.shop}
                      onChange={(event) => setForm({ ...form, shop: event.target.value })}
                      placeholder="Patel garments"
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label">City *</span>
                    <input
                      value={form.city}
                      onChange={(event) => setForm({ ...form, city: event.target.value })}
                      placeholder="Surat"
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label">Looking for</span>
                    <input
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                      placeholder="Men's jeans, 200 pcs"
                      className="field"
                    />
                  </label>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button type="submit" className={btn("primary")}>
                    Send on WhatsApp
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={`mailto:${brand.email}?subject=Wholesale%20enquiry%20—%20Rfox`}
                    className="text-[10px] font-semibold uppercase tracking-label text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                  >
                    or email {brand.email}
                  </a>
                </div>
                <p className="mt-4 text-[9.5px] uppercase tracking-label text-muted/80">
                  Opens WhatsApp with the details filled in — nothing is stored.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- social */}
      <section className="container-x py-14 sm:py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Follow the studio"
            title={
              <>
                New drops, first <span className="text-muted">on your feed.</span>
              </>
            }
            copy="Fits on real customers, wash-house sneak peeks and restock alerts. We reply to every DM."
          />
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">
          {[
            {
              icon: Instagram,
              title: "Instagram",
              handle: brand.instagramHandle,
              copy: "Daily fits, behind the seams, styling notes.",
              href: brand.instagram,
              accent: "group-hover:bg-[#C13584]",
            },
            {
              icon: Facebook,
              title: "Facebook",
              handle: brand.facebookHandle,
              copy: "Retailer updates, offers and shop locations.",
              href: brand.facebook,
              accent: "group-hover:bg-[#1877F2]",
            },
            {
              icon: Truck,
              title: "WhatsApp",
              handle: "Chat with the studio",
              copy: "Sizing help, stock checks and order tracking.",
              href: whatsappLink("Hi Rfox, I'd like some help with my order."),
              accent: "group-hover:bg-[#1FA855]",
            },
          ].map((social) => (
            <a
              key={social.title}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden border border-line bg-cream p-5 transition-colors hover:border-ink/20 sm:p-7"
            >
              <div
                className={`absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-y-100 ${social.accent}`}
              />
              <div className="relative flex items-start justify-between">
                <social.icon className="h-6 w-6 text-ink transition-colors group-hover:text-white" strokeWidth={1.4} />
                <ArrowUpRight className="h-4 w-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:text-white" />
              </div>
              <p className="relative mt-7 text-[9.5px] font-semibold uppercase tracking-label text-muted transition-colors group-hover:text-white/60">
                {social.title}
              </p>
              <p className="relative mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-white sm:text-2xl">
                {social.handle}
              </p>
              <p className="relative mt-2 text-[12.5px] leading-relaxed text-muted transition-colors group-hover:text-white/70 sm:text-[13px]">
                {social.copy}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ newsletter */}
      <section className="relative overflow-hidden border-t border-line bg-cream">
        <div className="pointer-events-none absolute inset-0 hex-grid opacity-70" aria-hidden />
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red/20 blur-[90px]" />
        <div className="container-x relative grid gap-7 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-6">
            <Chip tone="red">The list</Chip>
            <h2 className="mt-4 text-[clamp(27px,4vw,44px)] leading-[1.06]">
              First access to drops,{" "}
              <span className="text-muted">restocks and rate cards.</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            {joined ? (
              <div className="border border-line bg-paper p-5 sm:p-6">
                <p className="font-display text-xl font-bold sm:text-2xl">You&rsquo;re on the list.</p>
                <p className="mt-2 text-[12.5px] text-muted">
                  Watch your inbox — and follow {brand.instagramHandle} for the next drop.
                </p>
              </div>
            ) : (
              <form onSubmit={submitNewsletter} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <label className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-label text-muted">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full border-b border-line bg-transparent py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
                  />
                </label>
                <button type="submit" className={btn("primary")}>
                  Join the list
                </button>
              </form>
            )}
            <p className="mt-3 text-[9.5px] uppercase tracking-label text-muted/70">
              One email per drop. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
