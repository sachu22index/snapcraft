import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles } from "lucide-react";
import heroImg from "@/assets/bloom-bliss-hamper.jpg";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { usePublicProducts } from "@/hooks/use-products";
import { PageHero, CTASection } from "@/components/Site";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { handleImageError } from "@/lib/image-fallback";

export const Route = createFileRoute("/hampers")({
  head: () => ({
    meta: [
      { title: "Gift Hampers — SnapCraft | Craft Hampers & Bouquets" },
      {
        name: "description",
        content:
          "Browse our curated collection of handcrafted gift hampers, flower bouquets, chocolate boxes, and keepsakes for birthdays, anniversaries, and special moments.",
      },
      { property: "og:title", content: "Handcrafted Gift Hampers — SnapCraft" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HampersPage,
});

function HampersPage() {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const { products: liveProducts, isLoading } = usePublicProducts();
  const sourceProducts = liveProducts.length > 0 || !isLoading ? liveProducts : PRODUCTS;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "rating" | "alphabetical">("featured");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "hampers", label: "Gift Hampers" },
    { id: "bouquets", label: "Flower Bouquets" },
    { id: "boxes", label: "Chocolate & Gift Boxes" },
    { id: "keepsakes", label: "Photo Keepsakes" },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...sourceProducts];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.occasion.some((o) => o.toLowerCase().includes(q)),
      );
    }

    if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, sourceProducts]);

  return (
    <div className="hampers-catalogue-page">
      <PageHero
        eyebrow="The Hamper Collection"
        title="Gifts That Say More"
        text="Thoughtfully composed details, personal touches and breathtaking presentation—created around the occasion and the person receiving it."
        image={heroImg}
      />

      <section className="section-container" style={{ padding: "40px 24px 80px" }}>
        {/* Controls Bar */}
        <div className="catalogue-controls-bar">
          {/* Category Tabs */}
          <div className="catalogue-category-tabs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`catalogue-tab-btn ${selectedCategory === c.id ? "is-active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Filters */}
          <div className="catalogue-filter-tools">
            <div className="catalogue-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="catalogue-sort-wrap">
              <ArrowUpDown size={15} />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "featured" | "rating" | "alphabetical")
                }
              >
                <option value="featured">Featured First</option>
                <option value="rating">Top Rated</option>
                <option value="alphabetical">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="catalogue-count-label">
          <span>Showing {filteredProducts.length} handcrafted creations</span>
        </div>

        {/* Product Grid */}
        <div className="product-cards-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = isInWishlist(product.id);
            return (
              <article
                key={product.id}
                className="snapcraft-product-card"
                onClick={() => setQuickViewProduct(product)}
              >
                <div className="product-card-media">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  {product.badge && (
                    <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="product-overlay-actions">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`overlay-icon-btn ${isWishlisted ? "is-wishlisted" : ""}`}
                      aria-label="Wishlist"
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
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div className="product-card-info">
                  <div className="product-meta-row">
                    <span className="product-cat-tag">{product.categoryLabel}</span>
                    <div className="product-rating-box">
                      <Star size={13} className="star-filled" />
                      <span>{product.rating}</span>
                      <small>({product.reviewsCount})</small>
                    </div>
                  </div>

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
                  <p className="product-card-desc">{product.description}</p>

                  <div className="product-pricing-row">
                    <span className="product-lead-badge">
                      {product.leadTime || "Handcrafted to Order"}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="btn-add-cart"
                    >
                      <ShoppingBag size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
