import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import {
  cartLines,
  cartSubtotal,
  removeLine,
  setLineQty,
  shippingFor,
  useStore,
} from "@/lib/store";
import { closeCart, useUI } from "@/lib/ui-store";
import { brand, whatsappLink } from "@/lib/brand";
import { DenimArt } from "@/components/DenimArt";
import { btn } from "@/components/ui";
import { inr } from "@/lib/utils";

export function CartDrawer() {
  const state = useStore();
  const { cartOpen } = useUI();
  const lines = cartLines(state);
  const subtotal = cartSubtotal(state);
  const shipping = shippingFor(subtotal);
  const remaining = Math.max(0, brand.freeShippingAbove - subtotal);
  const progress = Math.min(100, Math.round((subtotal / brand.freeShippingAbove) * 100));

  useEffect(() => {
    if (!cartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen]);

  const waMessage =
    lines.length > 0
      ? `Hi Rfox, I'd like to order:\n${lines
          .map((line) => `• ${line.product.name} (size ${line.size}) × ${line.qty}`)
          .join("\n")}\n\nSubtotal: ${inr(subtotal)}`
      : "Hi Rfox, I'd like to know more about your denim.";

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div className="fixed inset-0 z-[60]" initial={false}>
          <motion.button
            aria-label="Close cart"
            onClick={closeCart}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl">Your bag</h2>
                <span className="text-[10px] font-semibold uppercase tracking-label text-muted">
                  {lines.reduce((sum, line) => sum + line.qty, 0)} items
                </span>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close cart" className="p-1">
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="border-b border-line bg-cream px-6 py-4">
                <p className="flex items-center gap-2 text-[11px] text-ink">
                  <Truck className="h-3.5 w-3.5 text-red" strokeWidth={1.8} />
                  {remaining > 0 ? (
                    <span>
                      Add <strong className="font-semibold">{inr(remaining)}</strong> for free shipping
                    </span>
                  ) : (
                    <span>Free shipping unlocked across India</span>
                  )}
                </p>
                <div className="mt-2.5 h-[3px] w-full bg-sand">
                  <div
                    className="h-full bg-red transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-line">
                    <ShoppingBag className="h-6 w-6 text-muted" strokeWidth={1.3} />
                  </span>
                  <div>
                    <p className="font-display text-2xl">Nothing in the bag yet</p>
                    <p className="mt-1 text-sm text-muted">Start with the Ashford — our most reordered pair.</p>
                  </div>
                  <Link to="/shop" onClick={closeCart} className={btn("ink", "sm")}>
                    Explore the range
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line/70">
                  {lines.map((line) => (
                    <li key={`${line.productId}-${line.size}`} className="flex gap-4 px-6 py-5">
                      <Link
                        to={`/product/${line.product.slug}`}
                        onClick={closeCart}
                        className="h-[104px] w-[84px] shrink-0 overflow-hidden border border-line bg-cream"
                      >
                        {line.product.images?.[0] ? (
                          <img
                            src={line.product.images[0]}
                            alt={line.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <DenimArt
                            palette={line.product.palette}
                            silhouette={line.product.silhouette}
                            showTag={false}
                          />
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to={`/product/${line.product.slug}`}
                              onClick={closeCart}
                              className="text-[15px] font-medium leading-tight hover:text-red"
                            >
                              {line.product.name}
                            </Link>
                            <p className="mt-1 text-[10px] uppercase tracking-label text-muted">
                              Size {line.size} · {line.product.wash}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.productId, line.size)}
                            aria-label={`Remove ${line.product.name}`}
                            className="p-1 text-muted transition-colors hover:text-red"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() => setLineQty(line.productId, line.size, line.qty - 1)}
                              aria-label="Decrease quantity"
                              className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setLineQty(line.productId, line.size, line.qty + 1)}
                              aria-label="Increase quantity"
                              className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-medium">{inr(line.product.price * line.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="safe-bottom border-t border-line px-6 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium">{inr(subtotal)}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : inr(shipping)}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-label text-muted">Total</span>
                  <span className="font-display text-2xl font-semibold">{inr(subtotal + shipping)}</span>
                </div>
                <Link to="/checkout" onClick={closeCart} className={btn("primary", "md", "mt-4 w-full")}>
                  Checkout
                </Link>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 border border-ink/15 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink/40 hover:bg-cream"
                >
                  Order on WhatsApp
                </a>
                <p className="mt-3 text-center text-[10px] uppercase tracking-label text-muted">
                  {brand.returnDays}-day returns · Cash on delivery
                </p>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
