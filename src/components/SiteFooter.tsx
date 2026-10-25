import { Link } from "react-router-dom";
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { brand, whatsappLink } from "@/lib/brand";
import { BrandLogo } from "@/components/BrandLogo";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All denim", to: "/shop" },
      { label: "Jeans", to: "/shop?category=Jeans" },
      { label: "Jackets & shirting", to: "/shop?category=Jackets" },
      { label: "Cargo & chinos", to: "/shop?category=Cargo" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size & fit guide", to: "/shop" },
      { label: "Shipping & delivery", to: "/shop" },
      { label: "Returns & exchanges", to: "/shop" },
      { label: "Inventory desk", to: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo className="h-8" />
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted">
            Premium denim from the house of {brand.parent}. Cut, sewn and washed in {brand.city} since {brand.since} —
            sold retail across India and wholesale to retailers, boutiques and resellers.
          </p>

          <div className="mt-6 space-y-3 text-[13px] text-ink">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red" strokeWidth={1.6} />
              <span className="text-muted">{brand.address}</span>
            </p>
            <a href={`mailto:${brand.email}`} className="flex items-center gap-3 text-muted transition-colors hover:text-ink">
              <Mail className="h-4 w-4 shrink-0 text-red" strokeWidth={1.6} />
              {brand.email}
            </a>
            <a
              href={whatsappLink("Hi Rfox, I'd like to know more about your denim.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-[#1FA855]"
            >
              WhatsApp the studio
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          <div className="mt-7 flex gap-2">
            <a
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-line px-3.5 py-2 text-[10px] font-semibold uppercase tracking-label transition-colors hover:border-ink hover:bg-ink hover:text-cream"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.7} />
              Instagram
            </a>
            <a
              href={brand.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-line px-3.5 py-2 text-[10px] font-semibold uppercase tracking-label transition-colors hover:border-ink hover:bg-ink hover:text-cream"
            >
              <Facebook className="h-3.5 w-3.5" strokeWidth={1.7} />
              Facebook
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="md:col-span-2">
            <p className="label">{column.title}</p>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[13px] text-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-3">
          <p className="label">Wholesale</p>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            Size-set orders, retailer rate cards and repeat dispatch from our Ahmedabad unit.
          </p>
          <Link
            to="/#wholesale"
            className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px] font-semibold uppercase tracking-label"
          >
            Request rates
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-[10px] uppercase tracking-label text-muted sm:flex-row">
          <p>
            © 2026 Rfox · {brand.parent}. Rfox® is a registered mark of its owner.
          </p>
          <p className="text-center sm:text-right">Cash on delivery · UPI · Cards · Net banking</p>
        </div>
      </div>
    </footer>
  );
}
