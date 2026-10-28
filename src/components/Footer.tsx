import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  MapPin,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { logoImg } from "@/data/products";
import { PHONE_NUMBER, WHATSAPP_LINK, INSTAGRAM_LINK } from "@/components/Navbar";

export function Footer() {
  return (
    <footer className="snapcraft-main-footer">
      <div className="footer-top-container">
        <div className="footer-columns-grid">
          {/* Column 1: Brand Info & Official Logo */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-brand-lockup">
              <img
                src={logoImg}
                alt="SnapCraft - Craft Hampers & Bouquets"
                className="footer-logo-img"
              />
              <div className="footer-brand-text">
                <span className="footer-brand-title">
                  Snap<span className="brand-accent-green">Craft</span>
                </span>
                <span className="footer-brand-tagline">Craft Hampers & Bouquets</span>
              </div>
            </Link>

            <p className="footer-brand-bio">
              Handcrafted hampers, fresh bouquets, and personalized gifting creations crafted with
              love to turn every special occasion into a cherished memory.
            </p>

            <div className="footer-social-links-row">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="footer-social-circle"
                aria-label="Instagram @snap__craft__"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="footer-social-circle"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href={`tel:+91${PHONE_NUMBER}`}
                className="footer-social-circle"
                aria-label="Phone Call"
                title="Call"
              >
                <Phone size={18} />
              </a>

              <a
                href="mailto:hello@snapcraft.in"
                className="footer-social-circle"
                aria-label="Email"
                title="Email"
              >
                <Mail size={18} />
              </a>
            </div>

            <div className="footer-prebook-badge">
              <Sparkles size={14} />
              <span>Pre-book your hampers · Delivery Available across India</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/hampers">All Hampers</Link>
              </li>
              <li>
                <Link to="/creations">Creations & Bouquets</Link>
              </li>
              <li>
                <Link to="/occasions">Occasions</Link>
              </li>
              <li>
                <a href="#custom-builder">Custom Gift Builder</a>
              </li>
              <li>
                <Link to="/about">About SnapCraft</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Shop By Gifting</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/hampers">Birthday Gift Hampers</Link>
              </li>
              <li>
                <Link to="/hampers">Anniversary Keepsakes</Link>
              </li>
              <li>
                <Link to="/creations">Fresh Flower Bouquets</Link>
              </li>
              <li>
                <Link to="/hampers">Artisan Chocolate Boxes</Link>
              </li>
              <li>
                <Link to="/creations">Photo Merging Frames</Link>
              </li>
              <li>
                <Link to="/hampers">Traditional Heritage Sets</Link>
              </li>
              <li>
                <Link to="/occasions">Wedding & Celebration Decor</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support & Contact Details */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-heading">Customer Support</h4>
            <p className="footer-support-intro">
              Have a special custom hamper or decoration request? Reach out directly:
            </p>

            <div className="footer-contact-items">
              <a href={`tel:+91${PHONE_NUMBER}`} className="footer-contact-link">
                <Phone size={17} className="contact-icon" />
                <span>+91 {PHONE_NUMBER}</span>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="footer-contact-link"
              >
                <MessageCircle size={17} className="contact-icon" />
                <span>WhatsApp: +91 {PHONE_NUMBER}</span>
              </a>

              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="footer-contact-link"
              >
                <Instagram size={17} className="contact-icon" />
                <span>@snap__craft__</span>
              </a>

              <div className="footer-contact-link static-item">
                <MapPin size={17} className="contact-icon" />
                <span>Kochi & Bengaluru Studio Hubs · Pan-India Dispatch</span>
              </div>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp-footer"
            >
              <MessageCircle size={16} />
              <span>Direct WhatsApp Inquiry</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-container">
        <div className="footer-bottom-inner">
          <p className="footer-copyright-text">
            © {new Date().getFullYear()} <strong>SnapCraft</strong> — Craft Hampers & Bouquets.
            Handcrafted with{" "}
            <Heart size={13} className="fill-terracotta inline align-middle text-terracotta" /> for
            moments that matter.
          </p>

          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>
              Terms & Conditions
            </a>
            <span>·</span>
            <a href="#shipping" onClick={(e) => e.preventDefault()}>
              Shipping & Care Policy
            </a>
            <span>·</span>
            <Link to="/admin" className="opacity-80 hover:opacity-100 hover:text-terracotta">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
