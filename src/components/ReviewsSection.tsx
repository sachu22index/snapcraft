import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { CUSTOMER_REVIEWS } from "@/data/products";

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevReview = () => {
    setActiveIndex((prev) => (prev === 0 ? CUSTOMER_REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setActiveIndex((prev) => (prev === CUSTOMER_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const activeReview = CUSTOMER_REVIEWS[activeIndex] ?? CUSTOMER_REVIEWS[0];
  if (!activeReview) return null;

  return (
    <section className="reviews-section" id="reviews">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Stories of Joy</span>
          </div>
          <h2 className="section-main-heading">
            Loved by <span className="heading-serif-italic">Gift Givers</span> Across India
          </h2>
          <p className="section-subheading">
            Discover real experiences from patrons who trusted SnapCraft to make their cherished
            milestones unforgettable.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="reviews-carousel-wrapper">
          <div className="review-active-card">
            <div className="review-quote-watermark">
              <Quote size={80} />
            </div>

            <div className="review-content-inner">
              {/* Rating & Verified Tag */}
              <div className="review-stars-meta">
                <div className="stars-row">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} size={18} className="star-filled" />
                  ))}
                </div>
                {activeReview.verified && (
                  <span className="verified-badge">
                    <ShieldCheck size={14} /> Verified Recipient
                  </span>
                )}
              </div>

              {/* Title & Review Text */}
              <h3 className="review-quote-title">“{activeReview.title}”</h3>
              <p className="review-quote-body">{activeReview.review}</p>

              {/* Hamper tag */}
              <div className="review-hamper-tag">
                <span>
                  Gifted: <strong>{activeReview.hamper}</strong>
                </span>
              </div>

              {/* Author Row */}
              <div className="review-author-row">
                <img
                  src={activeReview.avatar}
                  alt={activeReview.name}
                  className="author-avatar-img"
                />
                <div>
                  <h4 className="author-name">{activeReview.name}</h4>
                  <p className="author-location">
                    {activeReview.location} · {activeReview.date}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="carousel-controls-bar">
            <button
              onClick={prevReview}
              className="carousel-btn prev-btn"
              aria-label="Previous customer review"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-dots-list">
              {CUSTOMER_REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`carousel-dot ${activeIndex === idx ? "is-active" : ""}`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="carousel-btn next-btn"
              aria-label="Next customer review"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
