import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { removeProduct, setOrderStatus, setStock, useStore } from "@/lib/store";
import type { Category, Order, OrderStatus } from "@/lib/catalog";
import { notify } from "@/lib/ui-store";
import { BrandLogo } from "@/components/BrandLogo";
import { DenimArt } from "@/components/DenimArt";
import { btn } from "@/components/ui";
import { ProductEditor, emptyProductInput, type Draft } from "@/components/ProductEditor";
import { cn, inr, shortDate } from "@/lib/utils";

const PASSCODE = "rfox2026";
const STATUSES: OrderStatus[] = ["New", "Packing", "Shipped", "Delivered", "Cancelled"];

const statusTone: Record<OrderStatus, string> = {
  New: "bg-red/15 text-red-tint",
  Packing: "bg-[#3A2E12] text-[#F0C24B]",
  Shipped: "bg-[#132A3D] text-[#7FB6E6]",
  Delivered: "bg-[#12301F] text-[#6FD79B]",
  Cancelled: "bg-sand text-muted",
};

export default function Admin() {
  const state = useStore();
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem("rfox.admin") === "1";
    } catch {
      return false;
    }
  });
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<"inventory" | "orders">("inventory");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "All">("All");

  const stats = useMemo(() => {
    const units = state.products.reduce((sum, product) => sum + product.stock, 0);
    const live = state.orders.filter((order) => order.status !== "Cancelled");
    return {
      products: state.products.length,
      units,
      orders: state.orders.length,
      revenue: live.reduce((sum, order) => sum + order.total, 0),
      open: state.orders.filter((order) => order.status === "New" || order.status === "Packing").length,
      subscribers: state.subscribers.length,
    };
  }, [state]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return state.products.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (!term) return true;
      return `${product.name} ${product.wash} ${product.fit}`.toLowerCase().includes(term);
    });
  }, [state.products, search, category]);

  const orders = useMemo(
    () => state.orders.filter((order) => (orderFilter === "All" ? true : order.status === orderFilter)),
    [state.orders, orderFilter],
  );

  if (!unlocked) {
    return (
      <main className="relative flex min-h-[78vh] items-center overflow-hidden bg-paper px-5 py-16 text-ink">
        <div className="pointer-events-none absolute inset-0 hex-grid" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(50%_50%_at_50%_40%,rgba(229,24,42,0.2),transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-md">
          <BrandLogo className="h-8" />
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-label text-muted">Staff access only</p>
          <h1 className="mt-3 font-display text-4xl">Inventory desk</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Manage stock, prices, product drops and customer orders for the Rfox store.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (pass.trim().toLowerCase() === PASSCODE) {
                try {
                  window.sessionStorage.setItem("rfox.admin", "1");
                } catch {
                  /* session storage unavailable */
                }
                setUnlocked(true);
                notify("Welcome back to the desk");
              } else {
                notify("That passcode doesn't match");
              }
            }}
            className="mt-7"
          >
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-label text-muted">Passcode</span>
              <div className="mt-2 flex items-center border border-line bg-cream px-4">
                <Lock className="h-4 w-4 text-muted" strokeWidth={1.6} />
                <input
                  type="password"
                  value={pass}
                  onChange={(event) => setPass(event.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3.5 text-[15px] text-ink outline-none placeholder:text-muted/40"
                />
              </div>
            </label>
            <button type="submit" className={btn("primary", "md", "mt-4 w-full")}>
              Unlock desk
            </button>
          </form>

          <p className="mt-4 text-[10px] uppercase tracking-label text-muted/70">Demo passcode: {PASSCODE}</p>

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-cream">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-4 sm:py-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <BrandLogo className="h-6" />
            <span className="hidden h-6 w-px bg-line sm:block" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-label text-muted">Rfox · Kumar Clothing</p>
              <p className="text-[13px] font-medium">Inventory desk</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className={btn("quiet", "sm", "border border-line")}>
              <ArrowLeft className="h-3 w-3" /> View store
            </Link>
            <button
              type="button"
              onClick={() => {
                try {
                  window.sessionStorage.removeItem("rfox.admin");
                } catch {
                  /* ignore */
                }
                setUnlocked(false);
                setPass("");
              }}
              className={btn("ink", "sm")}
            >
              <LogOut className="h-3 w-3" /> Lock
            </button>
          </div>
        </div>
      </div>

      <div className="container-x py-7 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-label text-muted">Dashboard</p>
            <h1 className="mt-2 text-[clamp(26px,4vw,42px)] leading-[1.05]">
              Good to see you, <span className="text-muted">Kumar Clothing.</span>
            </h1>
          </div>
          <button type="button" onClick={() => setDraft({ input: emptyProductInput })} className={btn("primary", "sm")}>
            <Plus className="h-3.5 w-3.5" /> Add product
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Boxes, label: "Units in stock", value: stats.units, note: `${stats.products} styles` },
            { icon: ClipboardList, label: "Orders", value: stats.orders, note: `${stats.open} to pack` },
            { icon: BarChart3, label: "Revenue", value: inr(stats.revenue), note: "excl. cancelled" },
            { icon: Mail, label: "Subscribers", value: stats.subscribers, note: "drop list" },
          ].map((card) => (
            <div key={card.label} className="border border-line bg-cream p-4">
              <card.icon className="h-4 w-4 text-red" strokeWidth={1.6} />
              <p className="mt-4 text-[9px] font-semibold uppercase tracking-label text-muted">{card.label}</p>
              <p className="mt-1 font-display text-xl font-semibold leading-none sm:text-2xl">{card.value}</p>
              <p className="mt-1 text-[10px] text-muted">{card.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-1 border-b border-line">
          {[
            { id: "inventory" as const, label: "Inventory", count: state.products.length },
            { id: "orders" as const, label: "Orders", count: state.orders.length },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-label transition-colors",
                tab === item.id ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {tab === "inventory" ? (
          <section className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="h-9 w-[190px] border border-line bg-cream pl-8 pr-3 text-[12px] outline-none focus:border-ink sm:w-[210px]"
                />
              </div>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as Category | "All")}
                className="h-9 border border-line bg-cream px-2 text-[10px] font-semibold uppercase tracking-[0.12em] outline-none focus:border-ink"
              >
                {["All", "Jeans", "Jackets", "Cargo", "Shirts"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="ml-auto text-[10px] uppercase tracking-label text-muted">{rows.length} shown</p>
            </div>

            <div className="mt-4 overflow-x-auto border border-line bg-cream">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-line text-[9px] uppercase tracking-label text-muted">
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="hidden px-4 py-3 font-semibold md:table-cell">Category</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((product) => (
                    <tr key={product.id} className="border-b border-line/70 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-14 w-11 shrink-0 overflow-hidden border border-line bg-paper">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <DenimArt palette={product.palette} silhouette={product.silhouette} showTag={false} />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium">{product.name}</p>
                            <p className="mt-0.5 text-[10px] uppercase tracking-label text-muted">
                              {product.wash} · {product.fit}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-[12px] text-muted md:table-cell">{product.category}</td>
                      <td className="px-4 py-3 text-[12px]">
                        {inr(product.price)}
                        <span className="mt-0.5 block text-[10px] text-muted line-through">{inr(product.mrp)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center border border-line">
                          <button
                            type="button"
                            onClick={() => setStock(product.id, product.stock - 1)}
                            className="grid h-8 w-7 place-items-center text-muted hover:text-ink"
                            aria-label="Decrease stock"
                          >
                            −
                          </button>
                          <input
                            value={product.stock}
                            onChange={(event) => setStock(product.id, Number(event.target.value) || 0)}
                            inputMode="numeric"
                            className="hide-spin h-8 w-12 border-x border-line bg-transparent text-center text-[12px] outline-none focus:bg-paper"
                            aria-label={`Stock for ${product.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => setStock(product.id, product.stock + 1)}
                            className="grid h-8 w-7 place-items-center text-muted hover:text-ink"
                            aria-label="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]",
                            product.stock <= 0
                              ? "bg-sand text-muted"
                              : product.stock <= 6
                                ? "bg-red/15 text-red-tint"
                                : "bg-[#12301F] text-[#6FD79B]",
                          )}
                        >
                          {product.stock <= 0 ? "Sold out" : product.stock <= 6 ? "Low stock" : "In stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/product/${product.slug}`}
                            className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
                            aria-label="View product"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({
                                id: product.id,
                                input: {
                                  name: product.name,
                                  category: product.category,
                                  fit: product.fit,
                                  wash: product.wash,
                                  silhouette: product.silhouette,
                                  palette: { ...product.palette },
                                  price: product.price,
                                  mrp: product.mrp,
                                  stock: product.stock,
                                  sizes: [...product.sizes],
                                  badge: product.badge,
                                  story: product.story,
                                  details: [...product.details],
                                  featured: product.featured,
                                  images: [...(product.images ?? [])],
                                },
                              })
                            }
                            className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Remove ${product.name} from the store?`)) {
                                removeProduct(product.id);
                                notify(`${product.name} removed`);
                              }
                            }}
                            className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-red"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-muted">
                        No styles match “{search}”. Try another search or clear the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-label text-muted">
              Stock changes save instantly and update the storefront.
            </p>
          </section>
        ) : (
          <section className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              {(["All", ...STATUSES] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setOrderFilter(status)}
                  className={cn(
                    "border px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] transition-colors",
                    orderFilter === status ? "border-ink bg-ink text-cream" : "border-line text-muted hover:border-ink",
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {orders.length === 0 && (
                <p className="border border-dashed border-line bg-cream p-8 text-center text-sm text-muted">
                  No orders in this state.
                </p>
              )}
              {orders.map((order) => (
                <OrderCard key={order.code} order={order} />
              ))}
            </div>
          </section>
        )}
      </div>

      {draft && <ProductEditor draft={draft} onClose={() => setDraft(null)} />}
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-line bg-cream">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full flex-wrap items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-[12px] font-semibold">{order.code}</span>
        <span className="text-[10px] uppercase tracking-label text-muted">{shortDate(order.createdAt)}</span>
        <span className="hidden text-[12px] text-muted sm:block">{order.customer.name}</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-label text-muted">{order.items.length} items</span>
          <span className="text-[13px] font-medium">{inr(order.total)}</span>
          <span className={cn("px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]", statusTone[order.status])}>
            {order.status}
          </span>
        </span>
      </button>

      {open && (
        <div className="grid gap-5 border-t border-line/70 px-4 py-4 sm:grid-cols-2">
          <div>
            <p className="label">Items</p>
            <ul className="mt-2 space-y-1.5">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="text-muted">
                    {item.name} · {item.size} × {item.qty}
                  </span>
                  <span>{inr(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-2 text-[12px]">
              <span className="text-muted">Shipping · {order.payment}</span>
              <span>{order.shipping === 0 ? "Free" : inr(order.shipping)}</span>
            </div>
          </div>

          <div>
            <p className="label">Ship to</p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {order.customer.name}
              <br />
              {order.customer.address}, {order.customer.city} — {order.customer.pincode}
              <br />
              {order.customer.phone}
              {order.customer.email && (
                <>
                  <br />
                  {order.customer.email}
                </>
              )}
            </p>
            {order.note && <p className="mt-2 text-[11px] text-muted">Note: {order.note}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="label">Update status</span>
              <select
                value={order.status}
                onChange={(event) => {
                  setOrderStatus(order.code, event.target.value as OrderStatus);
                  notify(`${order.code} → ${event.target.value}`);
                }}
                className="h-8 border border-line bg-paper px-2 text-[10px] font-semibold uppercase tracking-[0.1em] outline-none focus:border-ink"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
