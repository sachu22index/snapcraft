import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check, ArrowRight } from "lucide-react";
import { Product, PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { usePublicProducts } from "@/hooks/use-products";
import { handleImageError } from "@/lib/image-fallback";

export function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const { products: liveProducts, isLoading } = usePublicProducts();

  const sourceProducts = liveProducts.length > 0 || !isLoading ? liveProducts : PRODUCTS;

  const filterTabs = [
    { id: "all", label: "All Curations" },
    { id: "hampers", label: "Gift Hampers" },
    { id: "bouquets", label: "Bouquets" },
    { id: "boxes", label: "Curated Boxes" },
    { id: "keepsakes", label: "Photo & Keepsakes" },
  ];

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return sourceProducts;
    return sourceProducts.filter((p) => p.category === activeFilter);
  }, [activeFilter, sourceProducts]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice((prev) => (prev === product.id ? null : prev));
    }, 2000);
  };

  const handleWishlistToggle = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <section className="featured-section" id="featured-collection">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-split">
          <div>
            <div className="section-eyebrow">
              <Sparkles size={14} />
              <span>Handcrafted Treasures</span>
            </div>
            <h2 className="section-main-heading">
              Made to Make Them <span className="heading-serif-italic">Smile</span>
            </h2>
            <p className="section-subheading">
              Explore our most beloved handcrafted hampers and floral bouquets, thoughtfully
              designed to spark pure delight.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="filter-pill-group" role="tablist">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeFilter === tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`filter-pill-btn ${activeFilter === tab.id ? "is-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="product-cards-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = isInWishlist(product.id);
            const isJustAdded = addedItemNotice === product.id;

            return (
              <article
                key={product.id}
                className="snapcraft-product-card"
                onClick={() => setQuickViewProduct(product)}
              >
                {/* Image Container with Badges & Action Buttons */}
                <div className="product-card-media">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                    onError={handleImageError}
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Quick Action Overlay Buttons */}
                  <div className="product-overlay-actions">
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(product.id, e)}
                      className={`overlay-icon-btn ${isWishlisted ? "is-wishlisted" : ""}`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      title="Wishlist"
                    >
                      <Heart size={18} className={isWishlisted ? "fill-terracotta" : ""} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="overlay-icon-btn"
                      aria-label="Quick View"
                      title="Quick View"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="product-card-info">
                  {/* Category & Rating */}
                  <div className="product-meta-row">
                    <span className="product-cat-tag">{product.categoryLabel}</span>
                    <div className="product-rating-box">
                      <Star size={13} className="star-filled" />
                      <span>{product.rating}</span>
                      <small>({product.reviewsCount})</small>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="product-card-title">
                    <Link
                      to="/products/$slug"
                      params={{ slug: product.slug }}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#C45934] transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  {/* Short Description */}
                  <p className="product-card-desc">{product.description}</p>

                  {/* Action Row */}
                  <div className="product-pricing-row">
                    <span className="product-lead-badge">
                      {product.leadTime || "Handcrafted to Order"}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`btn-add-cart ${isJustAdded ? "is-added" : ""}`}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={16} />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
