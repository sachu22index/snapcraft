import React, { useState, useMemo } from "react";
import { Search, X, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { usePublicProducts } from "@/hooks/use-products";
import { handleImageError } from "@/lib/image-fallback";

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, addToCart } = useCart();
  const { products: liveProducts, isLoading } = usePublicProducts();
  const sourceProducts = liveProducts.length > 0 || !isLoading ? liveProducts : PRODUCTS;
  const [query, setQuery] = useState("");

  const quickTags = [
    "Roses",
    "Chocolates",
    "Hampers",
    "Anniversary",
    "Birthday",
    "Strawberries",
    "Honey",
    "Photo Frame",
  ];

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return sourceProducts.slice(0, 4); // show top 4 as recommendations
    return sourceProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.tagline.toLowerCase().includes(trimmed) ||
        p.description.toLowerCase().includes(trimmed) ||
        p.categoryLabel.toLowerCase().includes(trimmed) ||
        p.occasion.some((occ) => occ.toLowerCase().includes(trimmed)) ||
        p.inclusions.some((inc) => inc.toLowerCase().includes(trimmed)),
    );
  }, [query, sourceProducts]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setQuickViewProduct(product);
  };

  return (
    <div className="search-modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-input-header">
          <Search size={22} className="search-icon-lens" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hampers, bouquets, chocolates, occasions..."
            className="search-main-input"
          />
          {query && (
            <button onClick={() => setQuery("")} className="search-clear-btn">
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="search-close-x"
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="search-quick-chips">
          <small>Popular Searches:</small>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className={`search-chip ${query.toLowerCase() === tag.toLowerCase() ? "is-active" : ""}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="search-results-container">
          <div className="results-label-row">
            <span>
              {query ? `Found ${results.length} results for "${query}"` : "Trending Creations"}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="search-empty-box">
              <p>
                No gifts matching “{query}”. Try searching for “Roses”, “Hampers”, or “Birthday”.
              </p>
            </div>
          ) : (
            <div className="search-results-grid">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="search-result-item"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="search-item-thumb"
                    onError={handleImageError}
                  />
                  <div className="search-item-info">
                    <span className="search-item-cat">{product.categoryLabel}</span>
                    <h4 className="search-item-name">{product.name}</h4>
                    <p className="search-item-desc">{product.tagline}</p>
                    <div className="search-item-price-row">
                      <span className="search-item-badge text-xs text-muted font-medium">
                        {product.leadTime || "Handcrafted"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-olive font-medium">
                        <Star size={12} className="fill-olive" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                      setIsSearchOpen(false);
                    }}
                    className="search-add-btn"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
