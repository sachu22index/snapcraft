import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  MessageCircle,
  Check,
  ShieldCheck,
  Clock,
  Gift,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_LINK } from "@/components/Navbar";
import { handleImageError } from "@/lib/image-fallback";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } =
    useCart();
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState("");
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const currentImg = selectedImg || quickViewProduct.image;
  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, { giftMessage: giftNote });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1500);
  };

  const getWhatsAppProductLink = () => {
    const text = `Hello SnapCraft! I am interested in ordering:
*${quickViewProduct.name}*
${giftNote ? `Gift note: "${giftNote}"` : ""}
Please let me know availability and delivery details!`;
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="quickview-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div className="quickview-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="quickview-close-x"
          aria-label="Close details"
        >
          <X size={22} />
        </button>

        <div className="quickview-grid">
          {/* Left Column: Visual Gallery */}
          <div className="quickview-media-col">
            <div className="quickview-main-image-wrap">
              <img
                src={currentImg}
                alt={quickViewProduct.name}
                className="quickview-featured-img"
                onError={handleImageError}
              />
              {quickViewProduct.badge && (
                <span className={`product-badge badge-${quickViewProduct.badge.toLowerCase()}`}>
                  {quickViewProduct.badge}
                </span>
              )}
            </div>

            {quickViewProduct.additionalImages && quickViewProduct.additionalImages.length > 1 && (
              <div className="quickview-thumb-row">
                {quickViewProduct.additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`quickview-thumb-btn ${currentImg === img ? "is-selected" : ""}`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Inclusions & Actions */}
          <div className="quickview-info-col">
            {/* Category & Rating */}
            <div className="quickview-meta-bar">
              <span className="product-cat-tag">{quickViewProduct.categoryLabel}</span>
              <div className="product-rating-box">
                <Star size={14} className="star-filled" />
                <span>{quickViewProduct.rating}</span>
                <small>({quickViewProduct.reviewsCount} reviews)</small>
              </div>
            </div>

            {/* Title & Tagline */}
            <h2 className="quickview-product-title">{quickViewProduct.name}</h2>
            <p className="quickview-tagline">{quickViewProduct.tagline}</p>

            {/* Craft & Delivery Info */}
            <div className="quickview-price-bar">
              <span className="tax-inclusive-tag">
                Handcrafted to Order · Pan-India Delivery Eligible
              </span>
            </div>

            {/* Long Description */}
            <p className="quickview-long-desc">{quickViewProduct.longDescription}</p>

            {/* Inclusions Checklist */}
            <div className="quickview-inclusions-card">
              <h4 className="inclusions-heading">
                <Gift size={16} /> What’s Inside This Hamper:
              </h4>
              <ul className="inclusions-list">
                {quickViewProduct.inclusions.map((item, idx) => (
                  <li key={idx}>
                    <Check size={14} className="check-bullet" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lead Time & Guarantee */}
            <div className="quickview-timing-banner">
              <Clock size={15} />
              <span>{quickViewProduct.leadTime}</span>
            </div>

            {/* Custom Gift Note Input */}
            <div className="quickview-custom-card-input">
              <label>Personal Greeting Note (Free Handwritten Card):</label>
              <textarea
                rows={2}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="E.g., Dear Maya, wishing you a happy birthday! Love, Rahul"
              />
            </div>

            {/* Quantity & Add to Cart Controls */}
            <div className="quickview-action-footer">
              <div className="qty-stepper large">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`btn btn-terracotta flex-1 ${isAdded ? "btn-success" : ""}`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`quickview-wishlist-btn ${isWishlisted ? "is-active" : ""}`}
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-terracotta text-terracotta" : ""}
                />
              </button>
            </div>

            {/* Direct WhatsApp Ordering */}
            <div className="flex flex-col gap-2 mt-3">
              <Link
                to="/products/$slug"
                params={{ slug: quickViewProduct.slug }}
                onClick={() => setQuickViewProduct(null)}
                className="flex items-center justify-center gap-2 text-sm font-medium text-[#C45934] hover:underline py-1.5"
              >
                <span>View Full Product Page & Specifications</span>
                <ExternalLink size={14} />
              </Link>
              <a
                href={getWhatsAppProductLink()}
                target="_blank"
                rel="noreferrer"
                className="quickview-wa-link"
              >
                <MessageCircle size={16} />
                <span>Ask a question or customize on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
