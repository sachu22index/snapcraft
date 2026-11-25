import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Gift, Sparkles, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Bottom Navigation">
      <Link to="/" className={`mobile-bar-tab ${pathname === "/" ? "is-active" : ""}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link
        to="/hampers"
        className={`mobile-bar-tab ${pathname === "/hampers" ? "is-active" : ""}`}
      >
        <Gift size={20} />
        <span>Hampers</span>
      </Link>

      <a href="#custom-builder" className="mobile-bar-tab highlight-tab">
        <div className="tab-sparkle-bubble">
          <Sparkles size={18} />
        </div>
        <span>Build</span>
      </a>

      <button
        type="button"
        onClick={() => setIsWishlistOpen(true)}
        className="mobile-bar-tab"
        aria-label="Wishlist"
      >
        <div className="relative">
          <Heart size={20} />
          {wishlistCount > 0 && <span className="tab-badge">{wishlistCount}</span>}
        </div>
        <span>Wishlist</span>
      </button>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="mobile-bar-tab"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="tab-badge pulse">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
}
