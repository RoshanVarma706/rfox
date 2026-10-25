export type Category = "Jeans" | "Jackets" | "Cargo" | "Shirts";
export type Silhouette = "jeans" | "jacket" | "cargo" | "shirt";
export type Badge = "New" | "Bestseller" | "Limited" | "Restock";

export type Palette = {
  base: string;
  light: string;
  deep: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  fit: string;
  wash: string;
  silhouette: Silhouette;
  palette: Palette;
  /** Product photography. Falls back to the illustrated denim artwork when empty. */
  images: string[];
  price: number;
  mrp: number;
  stock: number;
  sizes: string[];
  badge?: Badge;
  rating: number;
  reviewCount: number;
  featured: boolean;
  story: string;
  details: string[];
};

const JEAN_SIZES = ["28", "30", "32", "34", "36", "38"];
const TOPS_SIZES = ["S", "M", "L", "XL", "XXL"];

export const seedProducts: Product[] = [
  {
    id: "p-ashford",
    slug: "the-ashford-slim",
    images: ["/catalog/ashford-1.jpg", "/catalog/ashford-2.jpg"],
    name: "The Ashford Slim",
    category: "Jeans",
    fit: "Slim",
    wash: "Rinse Indigo",
    silhouette: "jeans",
    palette: { base: "#2B4463", light: "#4F7093", deep: "#16283A" },
    price: 2499,
    mrp: 3299,
    stock: 26,
    sizes: JEAN_SIZES,
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 148,
    featured: true,
    story:
      "Our house slim, cut from 12 oz Indian denim and rinsed exactly once. Sharp through the thigh, clean at the ankle, built to hold its shape from first wear to fiftieth.",
    details: [
      "12 oz ring-spun cotton denim",
      "Slim fit, mid-rise, tapered leg",
      "YKK zip fly, copper rivets",
      "Single rinse — minimal water finish",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-ridge",
    slug: "ridge-straight",
    images: ["/catalog/ridge-1.jpg", "/catalog/ridge-2.jpg"],
    name: "Ridge Straight",
    category: "Jeans",
    fit: "Straight",
    wash: "Stone Wash",
    silhouette: "jeans",
    palette: { base: "#6E8AA5", light: "#A2B8CB", deep: "#40576E" },
    price: 2699,
    mrp: 3499,
    stock: 18,
    sizes: JEAN_SIZES,
    rating: 4.7,
    reviewCount: 96,
    featured: true,
    story:
      "A true straight leg with a soft stone wash that already feels like an old favourite. The pair our wholesale buyers reorder most.",
    details: [
      "13 oz cotton denim, stone washed",
      "Straight fit, regular rise",
      "Reinforced back pockets",
      "Garment washed for a broken-in hand",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-foundry",
    slug: "foundry-relaxed",
    images: ["/catalog/foundry-1.jpg", "/catalog/foundry-2.jpg"],
    name: "Foundry Relaxed",
    category: "Jeans",
    fit: "Relaxed",
    wash: "Raw Indigo",
    silhouette: "jeans",
    palette: { base: "#22364F", light: "#3F5E7E", deep: "#0F1D2A" },
    price: 2899,
    mrp: 3599,
    stock: 14,
    sizes: JEAN_SIZES,
    badge: "New",
    rating: 4.6,
    reviewCount: 41,
    featured: true,
    story:
      "Raw, unwashed and honest. The Foundry is stiff on day one and moulds to you over a season — the way denim used to behave.",
    details: [
      "14 oz rigid raw denim",
      "Relaxed fit, high rise, straight leg",
      "Hidden coin pocket, chain-stitched hem",
      "Expect 1–2 cm of stretch with wear",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-nightshift",
    slug: "night-shift",
    images: ["/catalog/night-1.jpg", "/catalog/night-2.jpg"],
    name: "Night Shift",
    category: "Jeans",
    fit: "Slim",
    wash: "Jet Black",
    silhouette: "jeans",
    palette: { base: "#26262B", light: "#41414A", deep: "#111114" },
    price: 2799,
    mrp: 3499,
    stock: 5,
    sizes: JEAN_SIZES,
    rating: 4.7,
    reviewCount: 73,
    featured: false,
    story:
      "Black denim that stays black. Sulphur-dyed, double-rinsed and finished with tonal stitching for evenings that run long.",
    details: [
      "12.5 oz sulphur-dyed black denim",
      "Slim fit, mid-rise",
      "Tonal stitching, gunmetal hardware",
      "Colour-locked wash",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-atlas",
    slug: "atlas-wide-leg",
    images: ["/catalog/atlas-1.jpg", "/catalog/atlas-2.jpg"],
    name: "Atlas Wide Leg",
    category: "Jeans",
    fit: "Wide",
    wash: "Light Wash",
    silhouette: "jeans",
    palette: { base: "#7E9BB5", light: "#AFC5D6", deep: "#4E6B85" },
    price: 3199,
    mrp: 3999,
    stock: 10,
    sizes: JEAN_SIZES,
    badge: "New",
    rating: 4.5,
    reviewCount: 28,
    featured: true,
    story:
      "A generous drape in light-wash cotton. Wide but never sloppy — the pair that makes a plain white tee look considered.",
    details: [
      "11 oz light-wash cotton denim",
      "Wide leg, high rise, full break",
      "Corozo buttons",
      "Low-impact enzyme finish",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-sandstorm",
    slug: "sandstorm-cargo",
    images: ["/catalog/sandstorm-1.jpg", "/catalog/sandstorm-2.jpg"],
    name: "Sandstorm Cargo",
    category: "Cargo",
    fit: "Cargo",
    wash: "Sand",
    silhouette: "cargo",
    palette: { base: "#B7A184", light: "#D6C4A8", deep: "#8A7457" },
    price: 2999,
    mrp: 3799,
    stock: 22,
    sizes: JEAN_SIZES,
    rating: 4.4,
    reviewCount: 57,
    featured: false,
    story:
      "Utility pockets, softened edges. Sandstorm is cut from a brushed cotton twill that gets better with every wash.",
    details: [
      "10 oz brushed cotton twill",
      "Relaxed cargo fit with bellow pockets",
      "Reinforced knee panels",
      "Machine wash cold, line dry",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-selvage",
    slug: "selvage-no-7",
    images: ["/catalog/selvage-1.jpg", "/catalog/selvage-2.jpg"],
    name: "Selvage No. 7",
    category: "Jeans",
    fit: "Straight",
    wash: "Deep Indigo",
    silhouette: "jeans",
    palette: { base: "#1B3350", light: "#33557A", deep: "#0A1723" },
    price: 4899,
    mrp: 5999,
    stock: 4,
    sizes: JEAN_SIZES,
    badge: "Limited",
    rating: 4.9,
    reviewCount: 34,
    featured: true,
    story:
      "Our small-batch flagship. Woven on shuttle looms, sewn with a chain-stitched hem and numbered by hand — forty pairs per drop.",
    details: [
      "15 oz shuttle-loom selvage denim",
      "Straight fit, mid rise",
      "Chain-stitched hem & waistband",
      "Individually numbered, 40 pairs per drop",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-trucker",
    slug: "the-fox-trucker",
    images: ["/catalog/trucker-1.jpg", "/catalog/trucker-2.jpg"],
    name: "The Fox Trucker",
    category: "Jackets",
    fit: "Trucker",
    wash: "Mid Indigo",
    silhouette: "jacket",
    palette: { base: "#365372", light: "#5F82A3", deep: "#1E3145" },
    price: 4599,
    mrp: 5499,
    stock: 8,
    sizes: TOPS_SIZES,
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 62,
    featured: true,
    story:
      "The jacket that anchors the whole wardrobe. Mid-indigo denim, chest flap pockets and a collar that sits exactly right.",
    details: [
      "13 oz indigo denim",
      "Classic trucker fit, true to size",
      "Copper shank buttons",
      "Adjustable waist tabs",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-overshirt",
    slug: "heritage-overshirt",
    images: ["/catalog/overshirt-1.jpg", "/catalog/overshirt-2.jpg"],
    name: "Heritage Overshirt",
    category: "Shirts",
    fit: "Overshirt",
    wash: "Washed Indigo",
    silhouette: "shirt",
    palette: { base: "#4B6885", light: "#7B97B0", deep: "#2B4056" },
    price: 2399,
    mrp: 2999,
    stock: 16,
    sizes: TOPS_SIZES,
    rating: 4.5,
    reviewCount: 39,
    featured: false,
    story:
      "A shirt-jacket in lightweight washed denim. Layer it over a tee in winter, wear it alone through the shoulder months.",
    details: [
      "8 oz washed denim",
      "Relaxed overshirt fit",
      "Double chest pockets",
      "Corozo buttons",
      "Cut & sewn in Ahmedabad",
    ],
  },
  {
    id: "p-courtyard",
    slug: "courtyard-straight",
    images: ["/catalog/courtyard-1.jpg"],
    name: "Courtyard Straight",
    category: "Jeans",
    fit: "Straight",
    wash: "Mid Blue",
    silhouette: "jeans",
    palette: { base: "#5A7794", light: "#89A3BA", deep: "#35506A" },
    price: 2599,
    mrp: 3199,
    stock: 0,
    sizes: JEAN_SIZES,
    rating: 4.3,
    reviewCount: 21,
    featured: false,
    story:
      "A clean straight leg in a soft mid-blue wash. Restocking next week — join the waitlist from the product page.",
    details: [
      "12 oz cotton denim, garment washed",
      "Straight fit, mid rise",
      "Slant pockets, hidden coin pocket",
      "Soft hand, minimal shrinkage",
      "Cut & sewn in Ahmedabad",
    ],
  },
];

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export const seedReviews: Review[] = [
  {
    id: "r-1",
    productId: "p-ashford",
    name: "Nikhil Shah",
    rating: 5,
    title: "Fits like it was tailored",
    body: "Ordered a 32 after measuring my old pair. The rinse is deep and clean, no fading gimmicks. Third Rfox pair for me.",
    createdAt: "2026-09-18T10:20:00.000Z",
  },
  {
    id: "r-2",
    productId: "p-ashford",
    name: "Aditi Rao",
    rating: 5,
    title: "Quality beats the price",
    body: "Honestly expected less at this price. Stitching is tight, the denim has weight, and delivery to Pune took three days.",
    createdAt: "2026-09-02T06:05:00.000Z",
  },
  {
    id: "r-3",
    productId: "p-selvage",
    name: "Rohan Kapadia",
    rating: 5,
    title: "Worth the wait",
    body: "The chain-stitched hem is the real thing. Two months in and the fades are starting at the thigh just like they should.",
    createdAt: "2026-08-21T14:40:00.000Z",
  },
  {
    id: "r-4",
    productId: "p-trucker",
    name: "Farhan Qureshi",
    rating: 4,
    title: "Sleeves run long",
    body: "Great denim, great buttons. I'm 5'7\" and the sleeves need a roll — otherwise perfect over a hoodie.",
    createdAt: "2026-09-11T09:15:00.000Z",
  },
  {
    id: "r-5",
    productId: "p-ridge",
    name: "Meera Patel",
    rating: 5,
    title: "The everyday pair",
    body: "Soft from the first wear. I've washed it five times and the stone wash still looks even.",
    createdAt: "2026-07-30T11:00:00.000Z",
  },
  {
    id: "r-6",
    productId: "p-atlas",
    name: "Devansh Jain",
    rating: 4,
    title: "Big silhouette, light fabric",
    body: "Light enough for Ahmedabad summers. Size down if you want it closer to the body.",
    createdAt: "2026-09-25T16:30:00.000Z",
  },
];

export type OrderItem = {
  productId: string;
  name: string;
  size: string;
  qty: number;
  price: number;
};

export type OrderStatus = "New" | "Packing" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  code: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: "COD" | "UPI";
  status: OrderStatus;
  note?: string;
};

export const seedOrders: Order[] = [
  {
    code: "RF-884120",
    createdAt: "2026-10-23T09:42:00.000Z",
    customer: {
      name: "Harsh Vora",
      phone: "+91 98250 11234",
      email: "harsh.vora@example.com",
      address: "12, Sunrise Flats, Navrangpura",
      city: "Ahmedabad",
      pincode: "380009",
    },
    items: [
      { productId: "p-ashford", name: "The Ashford Slim", size: "32", qty: 2, price: 2499 },
      { productId: "p-nightshift", name: "Night Shift", size: "32", qty: 1, price: 2799 },
    ],
    subtotal: 7797,
    shipping: 0,
    total: 7797,
    payment: "UPI",
    status: "New",
  },
  {
    code: "RF-884097",
    createdAt: "2026-10-22T15:10:00.000Z",
    customer: {
      name: "Ritesh Parmar",
      phone: "+91 90999 44512",
      email: "ritesh.p@example.com",
      address: "Shop 4, Mansi Complex, Maninagar",
      city: "Ahmedabad",
      pincode: "380008",
    },
    items: [{ productId: "p-trucker", name: "The Fox Trucker", size: "L", qty: 1, price: 4599 }],
    subtotal: 4599,
    shipping: 0,
    total: 4599,
    payment: "COD",
    status: "Packing",
  },
  {
    code: "RF-884061",
    createdAt: "2026-10-20T07:05:00.000Z",
    customer: {
      name: "Sneha Kulkarni",
      phone: "+91 97654 33221",
      email: "sneha.k@example.com",
      address: "B-402, Silver Oak, Kothrud",
      city: "Pune",
      pincode: "411038",
    },
    items: [{ productId: "p-atlas", name: "Atlas Wide Leg", size: "28", qty: 1, price: 3199 }],
    subtotal: 3199,
    shipping: 0,
    total: 3199,
    payment: "UPI",
    status: "Shipped",
  },
  {
    code: "RF-883988",
    createdAt: "2026-10-17T12:48:00.000Z",
    customer: {
      name: "Imran Sheikh",
      phone: "+91 88776 55443",
      email: "imran.s@example.com",
      address: "9, Gandhi Road, Ellisbridge",
      city: "Ahmedabad",
      pincode: "380006",
    },
    items: [
      { productId: "p-ridge", name: "Ridge Straight", size: "34", qty: 1, price: 2699 },
      { productId: "p-overshirt", name: "Heritage Overshirt", size: "M", qty: 1, price: 2399 },
    ],
    subtotal: 5098,
    shipping: 0,
    total: 5098,
    payment: "COD",
    status: "Delivered",
  },
];
