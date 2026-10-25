import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lock, Package, ShieldCheck, Truck } from "lucide-react";
import { cartLines, cartSubtotal, placeOrder, shippingFor, useStore } from "@/lib/store";
import type { Order } from "@/lib/catalog";
import { notify } from "@/lib/ui-store";
import { brand, whatsappLink } from "@/lib/brand";
import { DenimArt } from "@/components/DenimArt";
import { btn, Chip } from "@/components/ui";
import { cn, inr } from "@/lib/utils";

const EMPTY = { name: "", phone: "", email: "", address: "", city: "", pincode: "" };

export default function Checkout() {
  const state = useStore();
  const lines = cartLines(state);
  const subtotal = cartSubtotal(state);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const [form, setForm] = useState(EMPTY);
  const [payment, setPayment] = useState<"COD" | "UPI">("COD");
  const [note, setNote] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);

  const set = (key: keyof typeof EMPTY) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || form.pincode.trim().length < 6) {
      notify("Add your name, phone, address and a 6-digit pincode");
      return;
    }
    const order = placeOrder(form, payment, note.trim() || undefined);
    if (order) setPlaced(order);
  };

  if (placed) {
    return (
      <main className="container-x py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-label text-[#1FA855]">
            <Check className="h-4 w-4" /> Order confirmed
          </div>
          <h1 className="mt-4 text-[clamp(34px,5vw,58px)] leading-[1.02]">
            Thank you, {placed.customer.name.split(" ")[0]}.
            <br />
            <span className="text-muted">Your denim is being packed.</span>
          </h1>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Package, label: "Order", value: placed.code },
              { icon: Truck, label: "Dispatch", value: "Within 24 hours" },
              { icon: ShieldCheck, label: "Payment", value: placed.payment === "COD" ? "Cash on delivery" : "UPI" },
            ].map((item) => (
              <div key={item.label} className="border border-line bg-cream p-4">
                <item.icon className="h-4 w-4 text-red" strokeWidth={1.6} />
                <p className="mt-3 text-[9.5px] font-semibold uppercase tracking-label text-muted">{item.label}</p>
                <p className="mt-1 text-[13px] font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border border-line bg-paper">
            <div className="divide-y divide-line/70">
              {placed.items.map((item) => {
                const product = state.products.find((entry) => entry.id === item.productId);
                return (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 p-4">
                    <div className="h-[76px] w-[62px] shrink-0 border border-line bg-cream">
                      {product &&
                        (product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <DenimArt palette={product.palette} silhouette={product.silhouette} showTag={false} />
                        ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium">{item.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-label text-muted">
                        Size {item.size} · Qty {item.qty}
                      </p>
                    </div>
                    <p className="text-[13px]">{inr(item.price * item.qty)}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-line px-4 py-4">
              <span className="text-[10px] font-semibold uppercase tracking-label text-muted">Total paid</span>
              <span className="font-display text-2xl font-semibold">{inr(placed.total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                `Hi Rfox, I just placed order ${placed.code} (${inr(placed.total)}). Please confirm dispatch.`,
              )}
              target="_blank"
              rel="noreferrer"
              className={btn("primary")}
            >
              Confirm on WhatsApp
            </a>
            <Link to="/shop" className={btn("outline")}>
              Keep shopping
            </Link>
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-muted">
            A copy of this order is in your browser and in the Rfox inventory desk. Delivery to{" "}
            {placed.customer.address}, {placed.customer.city} — {placed.customer.pincode}. Questions? Message{" "}
            {brand.instagramHandle} or email {brand.email}.
          </p>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="container-x flex min-h-[62vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-line">
          <Package className="h-6 w-6 text-muted" strokeWidth={1.3} />
        </span>
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="max-w-sm text-sm text-muted">Add a pair and come back — checkout takes under a minute.</p>
        <Link to="/shop" className={btn("ink")}>
          Browse the range
        </Link>
      </main>
    );
  }

  return (
    <main className="container-x py-10 sm:py-14">
      <div className="flex flex-col gap-2 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-label text-muted">Secure checkout</p>
          <h1 className="mt-2 text-[clamp(30px,4.4vw,48px)] leading-none">Almost yours.</h1>
        </div>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-label text-muted">
          <Lock className="h-3.5 w-3.5" /> Encrypted · GST included
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <form onSubmit={submit} className="lg:col-span-7">
          <section>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-xl text-red">01</span>
              <h2 className="font-display text-2xl">Contact</h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="label">Full name *</span>
                <input value={form.name} onChange={set("name")} className="field" placeholder="Nikhil Shah" />
              </label>
              <label className="block">
                <span className="label">Phone *</span>
                <input value={form.phone} onChange={set("phone")} className="field" placeholder="+91 98250 00000" />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Email</span>
                <input value={form.email} onChange={set("email")} type="email" className="field" placeholder="you@example.com" />
              </label>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-xl text-red">02</span>
              <h2 className="font-display text-2xl">Delivery</h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label">Address *</span>
                <input value={form.address} onChange={set("address")} className="field" placeholder="Flat, street, landmark" />
              </label>
              <label className="block">
                <span className="label">City *</span>
                <input value={form.city} onChange={set("city")} className="field" placeholder="Ahmedabad" />
              </label>
              <label className="block">
                <span className="label">Pincode *</span>
                <input
                  value={form.pincode}
                  onChange={set("pincode")}
                  inputMode="numeric"
                  maxLength={6}
                  className="field"
                  placeholder="380021"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Order note (optional)</span>
                <input value={note} onChange={(event) => setNote(event.target.value)} className="field" placeholder="Delivery instructions, gift note…" />
              </label>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-xl text-red">03</span>
              <h2 className="font-display text-2xl">Payment</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                { id: "COD" as const, title: "Cash on delivery", copy: "Pay the courier when your pair arrives." },
                { id: "UPI" as const, title: "UPI / bank transfer", copy: "We share a payment link on WhatsApp after you order." },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPayment(option.id)}
                  className={cn(
                    "flex items-start gap-4 border p-4 text-left transition-colors",
                    payment === option.id ? "border-ink bg-cream" : "border-line hover:border-muted",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      payment === option.id ? "border-red" : "border-line",
                    )}
                  >
                    {payment === option.id && <span className="h-1.5 w-1.5 rounded-full bg-red" />}
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium">{option.title}</span>
                    <span className="mt-0.5 block text-[11.5px] text-muted">{option.copy}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <button type="submit" className={btn("primary", "md", "mt-8 w-full")}>
            Place order · {inr(total)}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <p className="mt-3 text-center text-[10px] uppercase tracking-label text-muted">
            No card details stored · {brand.returnDays}-day exchange
          </p>
        </form>

        <aside className="lg:col-span-5">
          <div className="border border-line bg-cream">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-display text-xl">Your bag</p>
              <Chip tone="sand">{lines.reduce((sum, line) => sum + line.qty, 0)} items</Chip>
            </div>
            <ul className="divide-y divide-line/70">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.size}`} className="flex gap-4 px-5 py-4">
                  <div className="h-[88px] w-[70px] shrink-0 border border-line bg-paper">
                    {line.product.images?.[0] ? (
                      <img
                        src={line.product.images[0]}
                        alt={line.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <DenimArt palette={line.product.palette} silhouette={line.product.silhouette} showTag={false} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-[14px] font-medium">{line.product.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-label text-muted">
                      Size {line.size} · {line.product.wash}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-[11px] text-muted">Qty {line.qty}</span>
                      <span className="text-[13px]">{inr(line.product.price * line.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-line px-5 py-4 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? "Free" : inr(shipping)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="text-[10px] font-semibold uppercase tracking-label text-muted">Total</span>
                <span className="font-display text-2xl font-semibold">{inr(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 border border-line bg-paper p-5 text-[11px] text-muted">
            <p className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-red" /> Dispatch in 24 hrs from Ahmedabad
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-red" /> Stitch warranty on every pair
            </p>
            <p className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-red" /> Easy exchange for size issues
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
