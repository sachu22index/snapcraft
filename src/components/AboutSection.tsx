import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Sparkles, Award } from "lucide-react";
import { logoImg } from "@/data/products";
import founderStoryImg from "@/assets/bloom-bliss-hamper.jpg";

export function AboutSection() {
  return (
    <section className="about-brand-section" id="about-us">
      <div className="section-container">
        <div className="about-brand-grid">
          {/* Left Column: Official Logo Artwork Presentation */}
          <div className="about-media-col">
            <div className="about-logo-stage">
              <div className="about-logo-card">
                <img
                  src={logoImg}
                  alt="SnapCraft Official Brand Illustration & Logo"
                  className="about-official-logo"
                />
                <div className="logo-caption-seal">
                  <span>Official Brand Identity · Craft Hampers & Bouquets</span>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="about-floating-stat">
                <div className="stat-number">10k+</div>
                <div className="stat-desc">
                  <strong>Moments Celebrated</strong>
                  <small>Across homes throughout India</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Emotional Brand Story */}
          <div className="about-content-col">
            <div className="section-eyebrow">
              <Sparkles size={14} />
              <span>Our Brand Story</span>
            </div>

            <h2 className="section-main-heading">
              Gifts That Speak What <span className="heading-serif-italic">Words Cannot</span>
            </h2>

            <blockquote className="about-quote-block">
              “At SnapCraft, we believe the best gifts are the ones that feel personal. Every hamper
              and bouquet is thoughtfully designed, beautifully arranged, and crafted to make
              someone feel truly special.”
            </blockquote>

            <p className="about-body-text">
              What started as a labor of love arranging handmade wicker baskets at home has
              blossomed into SnapCraft—a sanctuary for heartfelt gifting. We obsess over the subtle
              nuances: the crisp fold of natural kraft paper, the warm fragrance of freshly cut
              garden roses, the velvety richness of single-origin cocoa, and the tender emotion
              captured in a handwritten note.
            </p>

            <p className="about-body-text">
              Every celebration is unique, which is why our artisans work closely with you. Whether
              you need a bespoke anniversary tribute, ceremonial wedding decor, or a gentle
              self-care package, we treat every single order as if we were delivering it to our very
              own family.
            </p>

            {/* Artisan Highlights */}
            <div className="about-values-list">
              <div className="about-val-item">
                <div className="val-icon-box">
                  <Heart size={18} />
                </div>
                <div>
                  <strong>Personal Connection</strong>
                  <p>Direct consultation on WhatsApp to customize every item to perfection.</p>
                </div>
              </div>

              <div className="about-val-item">
                <div className="val-icon-box">
                  <Award size={18} />
                </div>
                <div>
                  <strong>Artisanal Pride</strong>
                  <p>Hand-tied ribbons, authentic wax seals, and curated gourmet pairings.</p>
                </div>
              </div>
            </div>

            <div className="about-actions-row">
              <Link to="/about" className="btn btn-terracotta">
                <span>Read Full Story</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn btn-olive">
                <span>Talk to Our Florist</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
