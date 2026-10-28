import React, { useState } from "react";
import { Mail, Check, Sparkles, Gift, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const { applyCoupon } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true);
    applyCoupon("WELCOME10");
  };

  return (
    <section className="newsletter-card-section">
      <div className="section-container">
        <div className="newsletter-banner-box">
          <div className="newsletter-decor-circle circle-1" />
          <div className="newsletter-decor-circle circle-2" />

          <div className="newsletter-content-inner">
            <div className="newsletter-badge">
              <Gift size={16} />
              <span>Join the SnapCraft Inner Circle</span>
            </div>

            <h2 className="newsletter-title">
              Get Inspired to <span className="heading-serif-italic">Gift Better</span>
            </h2>

            <p className="newsletter-subtitle">
              Subscribe for seasonal hamper debuts, secret festival offers, and heartwarming gift
              inspiration delivered straight to your inbox. Plus, unlock 10% off your first
              creation!
            </p>

            {subscribed ? (
              <div className="newsletter-success-box">
                <div className="success-icon-bubble">
                  <Check size={20} />
                </div>
                <div>
                  <h4>Welcome to the SnapCraft Family!</h4>
                  <p>
                    Your 10% welcome discount has been automatically applied to your cart with code{" "}
                    <strong>WELCOME10</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form-row">
                <div className="newsletter-input-wrap">
                  <Mail size={18} className="newsletter-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email address..."
                    className="newsletter-email-input"
                    aria-label="Email address for newsletter"
                  />
                </div>
                <button type="submit" className="btn btn-terracotta newsletter-submit-btn">
                  <span>Subscribe</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {error && <p className="newsletter-error-text">{error}</p>}

            <div className="newsletter-privacy-note">
              <Sparkles size={13} />
              <span>No spam ever. Only thoughtful gifting ideas. Unsubscribe anytime.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
