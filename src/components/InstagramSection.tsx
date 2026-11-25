import React from "react";
import { Instagram, Heart, ArrowUpRight } from "lucide-react";
import { INSTAGRAM_POSTS } from "@/data/products";
import { INSTAGRAM_LINK } from "@/components/Navbar";

export function InstagramSection() {
  return (
    <section className="instagram-showcase-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-split">
          <div>
            <div className="section-eyebrow">
              <Instagram size={14} />
              <span>@snap__craft__ on Instagram</span>
            </div>
            <h2 className="section-main-heading">
              Gifting Moments, <span className="heading-serif-italic">Made Beautiful</span>
            </h2>
            <p className="section-subheading">
              A peek inside our studio: fresh morning blooms, ribbon tying, wax seals, and heartfelt
              unboxings shared by our community.
            </p>
          </div>

          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-terracotta"
          >
            <Instagram size={18} />
            <span>Follow Our Journey</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* 6-Photo Instagram Visual Grid */}
        <div className="instagram-photos-grid">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="insta-post-card group"
            >
              <img
                src={post.image}
                alt="SnapCraft Instagram highlight"
                className="insta-post-img"
                loading="lazy"
              />
              <div className="insta-hover-overlay">
                <div className="insta-overlay-meta">
                  <div className="insta-likes-count">
                    <Heart size={16} className="fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <p className="insta-caption-text">{post.caption}</p>
                  <span className="insta-view-tag">
                    <Instagram size={14} /> View on Instagram
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
