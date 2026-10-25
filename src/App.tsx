import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { SocialDock } from "@/components/SocialDock";
import { notify } from "@/lib/ui-store";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductPage from "@/pages/Product";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/Wishlist";
import Admin from "@/pages/Admin";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const onStorageError = () => notify("Browser storage is full — remove a photo to keep saving");
    window.addEventListener("rfox:storage-error", onStorageError);
    return () => window.removeEventListener("rfox:storage-error", onStorageError);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <ScrollManager />
      {!isAdmin && <SiteHeader />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isAdmin && <SiteFooter />}
      <CartDrawer />
      {!isAdmin && <SocialDock />}
      <div className="grain pointer-events-none fixed inset-0 z-[90]" aria-hidden />
    </div>
  );
}
