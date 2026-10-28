import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import anniversaryImg from "@/assets/anniversary-memories.jpg";
import bloomBlissImg from "@/assets/bloom-bliss-hamper.jpg";
import roseBouquetImg from "@/assets/rose-bouquet.jpg";
import weddingImg from "@/assets/snapcraft-wedding.jpg";
import selfCareImg from "@/assets/self-care-box.jpg";
import gourmetImg from "@/assets/snapcraft-hamper.jpg";
import bouquetsImg from "@/assets/snapcraft-bouquets.jpg";
import chocolateLoveImg from "@/assets/chocolate-love-box.jpg";

export const OCCASIONS_DATA = [
  {
    title: "Birthday",
    subtitle: "Celebrate their special milestone",
    desc: "Joyful hampers bursting with chocolates, cheerful blooms, and personalised keepsakes.",
    image: chocolateLoveImg,
    tag: "Celebration",
  },
  {
    title: "Anniversary",
    subtitle: "Cherish your love story",
    desc: "Everlasting preserved roses, custom couple photo frames, and candlelight sets.",
    image: anniversaryImg,
    tag: "Romantic",
  },
  {
    title: "Love & Romance",
    subtitle: "Heartfelt gestures for your person",
    desc: "Velvety peach roses, gold-leaf truffles, and handwritten wax-sealed letters.",
    image: roseBouquetImg,
    tag: "Everlasting",
  },
  {
    title: "Wedding",
    subtitle: "New beginnings blessed in elegance",
    desc: "Grand hampers for newlyweds, custom bridal garlands, and ceremonial candles.",
    image: weddingImg,
    tag: "Grand Milestones",
  },
  {
    title: "Baby Shower",
    subtitle: "Pampering for mother and little one",
    desc: "Gentle organic skincare, soothing herbal teas, soft cotton wraps, and sweet nursery touches.",
    image: selfCareImg,
    tag: "New Beginnings",
  },
  {
    title: "Thank You",
    subtitle: "Gratitude expressed with grace",
    desc: "Curated gourmet delicacies, roasted nuts, wildflower honey, and thank you notes.",
    image: gourmetImg,
    tag: "Appreciation",
  },
  {
    title: "Congratulations",
    subtitle: "Applaud their triumphs and feats",
    desc: "Festive celebration towers, sparkling apple cider, and luxurious confections.",
    image: bouquetsImg,
    tag: "Milestones",
  },
  {
    title: "Corporate",
    subtitle: "Distinguished executive gifting",
    desc: "Polished wooden boxes, brass desk keepsakes, fine coffees, and bespoke company notes.",
    image: bloomBlissImg,
    tag: "Bespoke",
  },
];

export function OccasionsSection() {
  return (
    <section className="occasions-showcase-section" id="occasions">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Honoring Every Moment</span>
          </div>
          <h2 className="section-main-heading">
            Gifts for Every <span className="heading-serif-italic">Occasion</span>
          </h2>
          <p className="section-subheading">
            Whether welcoming a child, celebrating golden years together, or sending warm gratitude,
            our creations speak the language of genuine thoughtfulness.
          </p>
        </div>

        {/* 8 Occasion Cards Grid */}
        <div className="occasions-cards-grid">
          {OCCASIONS_DATA.map((occ, i) => (
            <div key={occ.title} className="occasion-item-card group">
              <div className="occasion-item-media">
                <img src={occ.image} alt={occ.title} className="occasion-bg-photo" loading="lazy" />
                <div className="occasion-gradient-scrim" />
                <span className="occasion-tag-pill">{occ.tag}</span>
              </div>

              <div className="occasion-item-info">
                <h3 className="occasion-item-title">{occ.title}</h3>
                <p className="occasion-item-subtitle">{occ.subtitle}</p>
                <p className="occasion-item-desc">{occ.desc}</p>
                <Link to="/hampers" className="occasion-action-link">
                  <span>Explore Gifts</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
