import { useSyncExternalStore } from "react";
import {
  seedOrders,
  seedProducts,
  seedReviews,
  type Badge,
  type Category,
  type Order,
  type OrderItem,
  type OrderStatus,
  type Palette,
  type Product,
  type Review,
  type Silhouette,
} from "./catalog";
import { brand } from "./brand";
import { orderCode, slugify } from "./utils";

export type CartLine = { productId: string; size: string; qty: number };

export type State = {
  products: Product[];
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  subscribers: string[];
};

const STORAGE_KEY = "rfox.store.v4";

const initialState: State = {
  products: seedProducts,
  cart: [],
  wishlist: [],
  orders: seedOrders,
  reviews: seedReviews,
  subscribers: [],
};

function loadState(): State {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : seedProducts,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : seedOrders,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : seedReviews,
      subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
    };
  } catch {
    return initialState;
  }
}

let state: State = loadState();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: State) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — in-memory state still works */
    try {
      window.dispatchEvent(new Event("rfox:storage-error"));
    } catch {
      /* non-browser environment */
    }
  }
  listeners.forEach((listener) => listener());
}

function update(recipe: (current: State) => State) {
  commit(recipe(state));
}

export function getState() {
  return state;
}

export function useStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

/* ------------------------------------------------------------------ cart */

export function addToCart(productId: string, size: string, qty = 1) {
  update((current) => {
    const product = current.products.find((item) => item.id === productId);
    if (!product || product.stock <= 0) return current;

    const existing = current.cart.find((line) => line.productId === productId && line.size === size);
    const inCart = existing?.qty ?? 0;
    const nextQty = Math.min(inCart + qty, product.stock);

    return {
      ...current,
      cart: existing
        ? current.cart.map((line) => (line === existing ? { ...line, qty: nextQty } : line))
        : [...current.cart, { productId, size, qty: Math.min(qty, product.stock) }],
    };
  });
}

export function setLineQty(productId: string, size: string, qty: number) {
  update((current) => {
    const product = current.products.find((item) => item.id === productId);
    const capped = Math.max(0, Math.min(qty, product?.stock ?? qty));
    const cart =
      capped === 0
        ? current.cart.filter((line) => !(line.productId === productId && line.size === size))
        : current.cart.map((line) =>
            line.productId === productId && line.size === size ? { ...line, qty: capped } : line,
          );
    return { ...current, cart };
  });
}

export function removeLine(productId: string, size: string) {
  update((current) => ({
    ...current,
    cart: current.cart.filter((line) => !(line.productId === productId && line.size === size)),
  }));
}

export function clearCart() {
  update((current) => ({ ...current, cart: [] }));
}

/* -------------------------------------------------------------- wishlist */

export function toggleWishlist(productId: string) {
  update((current) => ({
    ...current,
    wishlist: current.wishlist.includes(productId)
      ? current.wishlist.filter((id) => id !== productId)
      : [...current.wishlist, productId],
  }));
}

/* ---------------------------------------------------------------- orders */

export function placeOrder(
  customer: Order["customer"],
  payment: Order["payment"],
  note?: string,
): Order | null {
  const current = state;
  const items: OrderItem[] = [];
  for (const line of current.cart) {
    const product = current.products.find((item) => item.id === line.productId);
    if (!product) continue;
    items.push({ productId: product.id, name: product.name, size: line.size, qty: line.qty, price: product.price });
  }
  if (!items.length) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= brand.freeShippingAbove ? 0 : brand.shippingFee;
  const order: Order = {
    code: orderCode(),
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    payment,
    status: "New",
    note,
  };

  update((prev) => ({
    ...prev,
    cart: [],
    orders: [order, ...prev.orders],
    products: prev.products.map((product) => {
      const bought = items
        .filter((item) => item.productId === product.id)
        .reduce((sum, item) => sum + item.qty, 0);
      return bought ? { ...product, stock: Math.max(0, product.stock - bought) } : product;
    }),
  }));

  return order;
}

export function setOrderStatus(code: string, status: OrderStatus) {
  update((current) => ({
    ...current,
    orders: current.orders.map((order) => (order.code === code ? { ...order, status } : order)),
  }));
}

/* --------------------------------------------------------------- reviews */

export function addReview(input: {
  productId: string;
  name: string;
  rating: number;
  title: string;
  body: string;
}) {
  const review: Review = {
    id: `r-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  update((current) => ({
    ...current,
    reviews: [review, ...current.reviews],
    products: current.products.map((product) =>
      product.id === input.productId
        ? {
            ...product,
            reviewCount: product.reviewCount + 1,
            rating: Number(((product.rating * product.reviewCount + input.rating) / (product.reviewCount + 1)).toFixed(1)),
          }
        : product,
    ),
  }));
}

/* ------------------------------------------------------------ newsletter */

export function subscribeEmail(email: string) {
  const clean = email.trim().toLowerCase();
  if (!clean) return false;
  update((current) => ({
    ...current,
    subscribers: current.subscribers.includes(clean) ? current.subscribers : [...current.subscribers, clean],
  }));
  return true;
}

/* ----------------------------------------------------------------- admin */

export type ProductInput = {
  name: string;
  category: Category;
  fit: string;
  wash: string;
  silhouette: Silhouette;
  palette: Palette;
  price: number;
  mrp: number;
  stock: number;
  sizes: string[];
  badge?: Badge;
  story: string;
  details: string[];
  featured: boolean;
  images: string[];
};

export function saveProduct(input: ProductInput, id?: string) {
  update((current) => {
    if (id) {
      return {
        ...current,
        products: current.products.map((product) =>
          product.id === id ? { ...product, ...input, id: product.id, slug: product.slug } : product,
        ),
      };
    }
    const newId = `p-${Date.now().toString(36)}`;
    const product: Product = {
      ...input,
      id: newId,
      slug: slugify(input.name) || newId,
      rating: 0,
      reviewCount: 0,
    };
    return { ...current, products: [product, ...current.products] };
  });
}

export function removeProduct(id: string) {
  update((current) => ({
    ...current,
    products: current.products.filter((product) => product.id !== id),
    cart: current.cart.filter((line) => line.productId !== id),
    wishlist: current.wishlist.filter((wish) => wish !== id),
  }));
}

export function setStock(id: string, stock: number) {
  update((current) => ({
    ...current,
    products: current.products.map((product) =>
      product.id === id ? { ...product, stock: Math.max(0, Math.round(stock)) } : product,
    ),
  }));
}

/* ------------------------------------------------------------- selectors */

export type DetailedLine = CartLine & { product: Product };

export function cartLines(current: State): DetailedLine[] {
  return current.cart.reduce<DetailedLine[]>((acc, line) => {
    const product = current.products.find((item) => item.id === line.productId);
    if (product) acc.push({ ...line, product });
    return acc;
  }, []);
}

export function cartCount(current: State) {
  return current.cart.reduce((sum, line) => sum + line.qty, 0);
}

export function cartSubtotal(current: State) {
  return cartLines(current).reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

export function shippingFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= brand.freeShippingAbove ? 0 : brand.shippingFee;
}

export function productBySlug(current: State, slug: string) {
  return current.products.find((product) => product.slug === slug);
}

export function reviewsFor(current: State, productId: string) {
  return current.reviews.filter((review) => review.productId === productId);
}
