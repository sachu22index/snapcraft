import React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { handleImageError } from "@/lib/image-fallback";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, setIsCheckoutOpen } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header-row">
          <div className="drawer-title-group">
            <ShoppingBag size={20} className="text-terracotta" />
            <h3>Your Gift Basket</h3>
            <span className="drawer-item-count">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="drawer-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Assurance Meter */}
        <div className="free-shipping-tracker">
          <p className="tracker-text text-olive font-semibold flex items-center gap-1.5">
            <Sparkles size={15} /> Handcrafted with Care · Pre-booking Available
          </p>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div className="drawer-empty-state">
            <div className="empty-cart-icon-wrap">
              <ShoppingBag size={48} />
            </div>
            <h4>Your gift basket is empty</h4>
            <p>
              Fill it with handcrafted hampers, fresh blooming bouquets, or create your bespoke
              gift!
            </p>
            <button onClick={() => setIsCartOpen(false)} className="btn btn-terracotta">
              <span>Explore Hampers</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="drawer-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-thumb"
                    onError={handleImageError}
                  />

                  <div className="cart-item-details">
                    <div className="cart-item-title-row">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-delete"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.packagingStyle && (
                      <span className="cart-item-option">📦 {item.packagingStyle}</span>
                    )}

                    {item.customDetails && <p className="cart-item-recipe">{item.customDetails}</p>}

                    {item.giftMessage && (
                      <p className="cart-item-note">
                        <em>Card:</em> “{item.giftMessage}”
                      </p>
                    )}

                    <div className="cart-item-bottom-row">
                      <div className="qty-stepper">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="cart-item-option font-medium text-olive">
                        Artisan Crafted
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="drawer-footer-summary">
              <div className="calc-row">
                <span>Total Items</span>
                <span className="font-semibold">
                  {cart.reduce((s, i) => s + i.quantity, 0)} gifts
                </span>
              </div>

              <div className="calc-row">
                <span>Presentation & Packaging</span>
                <span className="text-olive font-medium">Included</span>
              </div>

              <div className="calc-row">
                <span>Delivery Coordination</span>
                <span className="text-olive font-medium">Via WhatsApp</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="btn btn-terracotta btn-full checkout-proceed-btn"
              >
                <span>Proceed to Order</span>
                <ArrowRight size={17} />
              </button>

              <p className="checkout-trust-note">
                ✨ Direct coordination & personalized styling with SnapCraft florists
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
