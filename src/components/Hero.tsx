import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck, Truck, Star } from "lucide-react";
import { logoImg } from "@/data/products";
import heroHamperImg from "@/assets/snapcraft-logo.jpg";

export function Hero() {
  return (
    <section className="snapcraft-hero-section">
      <div className="hero-grid-container">
        {/* Left Column: Hero Text & CTAs */}
        <div className="hero-content-col">
          {/* Eyebrow Pill */}
          <div className="hero-eyebrow-pill">
            <span className="eyebrow-dot"></span>
            <Sparkles size={14} className="eyebrow-sparkle" />
            <span>Handmade Luxury Gifting in India</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-main-title">
            Thoughtfully <span className="title-serif-italic">Crafted.</span>
            <br />
            Beautifully <span className="title-highlight">Gifted.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="hero-subtext">
            Handcrafted hampers and bouquets made to turn every special moment into a beautiful
            memory. From romantic anniversaries to festive celebrations, personalize every single
            detail.
          </p>

          {/* Action Buttons */}
          <div className="hero-cta-group">
            <Link to="/hampers" className="btn btn-terracotta hero-btn-main">
              <span>Explore Hampers</span>
              <ArrowRight size={17} />
            </Link>

            <a href="#custom-builder" className="btn btn-olive hero-btn-secondary">
              <Sparkles size={16} />
              <span>Create Your Gift</span>
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <div className="trust-icon-box">
                <HeartHandshake size={18} />
              </div>
              <div>
                <strong>100% Handcrafted</strong>
                <small>Made with artisan care</small>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Truck size={18} />
              </div>
              <div>
                <strong>Doorstep Delivery</strong>
                <small>Carefully hand-delivered</small>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>Freshness Assured</strong>
                <small>Handpicked daily</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="hero-visual-col">
          <div className="hero-image-stage">
            {/* Main Rich Hamper Image */}
            <div className="hero-main-image-card">
              <img
                src={heroHamperImg}
                alt="Handcrafted SnapCraft gift hamper with English garden roses, sparkling cider, raw honey, and chocolates"
                className="hero-featured-photo"
              />

              {/* Top Floating Badge: Customer Rating */}
              <div className="hero-floating-card floating-rating">
                <div className="rating-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="star-filled" />
                  ))}
                </div>
                <div className="rating-text-meta">
                  <strong>4.9 / 5.0 Rating</strong>
                  <small>Over 1,200+ Happy Moments</small>
                </div>
              </div>

              {/* Bottom Floating Card with Official SnapCraft Logo Seal */}
              <div className="hero-floating-card floating-logo-seal">
                <div className="seal-logo-wrap">
                  <img src={logoImg} alt="SnapCraft Official Seal" className="seal-logo-img" />
                </div>
                <div className="seal-text-wrap">
                  <span className="seal-brand-title">SnapCraft</span>
                  <span className="seal-brand-tagline">Craft Hampers & Bouquets</span>
                  <div className="seal-accent-line">
                    <span>✦ Artisan Certified ✦</span>
                  </div>
                </div>
              </div>

              {/* Botanical Accent Pill */}
              <div className="hero-caption-pill">
                <span>🧺 Signature Wicker Hamper · Fresh Roses & Artisanal Chocolates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
