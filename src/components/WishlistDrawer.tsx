import React from "react";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { usePublicProducts } from "@/hooks/use-products";
import { handleImageError } from "@/lib/image-fallback";

export function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useCart();
  const { products: liveProducts, isLoading } = usePublicProducts();
  const sourceProducts = liveProducts.length > 0 || !isLoading ? liveProducts : PRODUCTS;

  if (!isWishlistOpen) return null;

  const wishlistedProducts = sourceProducts.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: (typeof PRODUCTS)[0]) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header-row">
          <div className="drawer-title-group">
            <Heart size={20} className="fill-terracotta text-terracotta" />
            <h3>Your Wishlist</h3>
            <span className="drawer-item-count">({wishlist.length})</span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="drawer-close-btn"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {wishlistedProducts.length === 0 ? (
          <div className="drawer-empty-state">
            <div className="empty-cart-icon-wrap">
              <Heart size={48} className="text-terracotta" />
            </div>
            <h4>Your wishlist is waiting for favorites</h4>
            <p>Tap the heart on any hamper or bouquet you adore to save it here for later.</p>
            <button onClick={() => setIsWishlistOpen(false)} className="btn btn-terracotta">
              <span>Discover Collections</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="drawer-items-list">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="cart-item-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-thumb"
                  onError={handleImageError}
                />

                <div className="cart-item-details">
                  <div className="cart-item-title-row">
                    <h4 className="cart-item-name">{product.name}</h4>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="cart-item-delete"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="cart-item-option">{product.categoryLabel}</span>
                  <p className="cart-item-desc-short">{product.description}</p>

                  <div className="cart-item-bottom-row">
                    <span className="cart-item-option">
                      {product.leadTime || "Handcrafted to Order"}
                    </span>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="btn btn-terracotta btn-sm flex items-center gap-1.5"
                    >
                      <ShoppingBag size={14} />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
