import React from "react";
import { HeartHandshake, Gem, Sparkles, Gift, Leaf, Truck } from "lucide-react";

export const PILLARS = [
  {
    icon: HeartHandshake,
    title: "Handcrafted With Love",
    desc: "Every ribbon bow, floral stem, and tissue tuck is arranged by artisan hands with patience, reverence, and meticulous detail.",
    highlight: "100% Artisan Made",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    desc: "Only the highest calibre ingredients: Belgian chocolates, cold-pressed soaps, organic honey, and solid hardwood frames.",
    highlight: "Finest Materials",
  },
  {
    icon: Sparkles,
    title: "Personalised Gifts",
    desc: "Tailor everything from names engraved on wood, customized photo merges, hand-written calligraphy cards to colored wax stamps.",
    highlight: "Customized Just for You",
  },
  {
    icon: Gift,
    title: "Beautiful Packaging",
    desc: "Signature handwoven wicker baskets, vintage kraft keepsake boxes, soft satin ribbons, and botanical embellishments.",
    highlight: "Unboxing Experience",
  },
  {
    icon: Leaf,
    title: "Fresh & Carefully Selected",
    desc: "Fresh garden blooms cut fresh daily, natural botanical skincare, and fresh confectioneries prepared just before dispatch.",
    highlight: "Guaranteed Fresh",
  },
  {
    icon: Truck,
    title: "Delivered With Care",
    desc: "Shock-proof insulated protective packaging and reliable express transit so your hamper arrives in pristine condition.",
    highlight: "Safe Doorstep Transit",
  },
];

export function WhyChooseUs() {
  return (
    <section className="why-snapcraft-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>The SnapCraft Standard</span>
          </div>
          <h2 className="section-main-heading">
            Why Choose <span className="heading-serif-italic">SnapCraft</span>
          </h2>
          <p className="section-subheading">
            We don’t just assemble gift boxes—we choreograph unforgettable emotional unboxing
            memories for you and your loved ones.
          </p>
        </div>

        {/* 6 Feature Pillars Grid */}
        <div className="why-pillars-grid">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="why-pillar-card">
                <div className="pillar-icon-wrapper">
                  <Icon size={24} className="pillar-icon" />
                  <span className="pillar-sparkle">✦</span>
                </div>
                <span className="pillar-highlight-tag">{pillar.highlight}</span>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
