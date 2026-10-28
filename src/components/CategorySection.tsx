import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/products";

interface CategorySectionProps {
  onSelectCategory?: (categorySlug: string) => void;
}

export function CategorySection({ onSelectCategory }: CategorySectionProps) {
  return (
    <section className="category-section" id="categories">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Curated Collections</span>
          </div>
          <h2 className="section-main-heading">
            Shop by <span className="heading-serif-italic">Category</span>
          </h2>
          <p className="section-subheading">
            From fragrant flower bouquets and lavish hampers to personalized keepsakes, explore
            thoughtful gifts handcrafted for every joyous milestone.
          </p>
        </div>

        {/* 8 Categories Grid */}
        <div className="category-cards-grid">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              to="/hampers"
              onClick={() => onSelectCategory?.(cat.slug)}
              className="category-card-item group"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="category-image-wrap">
                <img src={cat.image} alt={cat.name} className="category-cover-img" loading="lazy" />
                <div className="category-gradient-overlay" />
                <span className="category-count-badge">{cat.count}+ Designs</span>
                <div className="category-arrow-circle">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="category-content-wrap">
                <small className="category-tagline-text">{cat.tagline}</small>
                <h3 className="category-card-title">{cat.name}</h3>
                <p className="category-card-desc">{cat.description}</p>
                <span className="category-explore-link">
                  <span>Explore Collection</span>
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
