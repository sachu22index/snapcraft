import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logoImg } from "@/data/products";

export const PHONE_NUMBER = "7510925645";
export const WHATSAPP_LINK = `https://wa.me/91${PHONE_NUMBER}`;
export const INSTAGRAM_LINK = "https://www.instagram.com/snap__craft__/";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, setIsSearchOpen } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/hampers", label: "Hampers" },
    { to: "/creations", label: "Bouquets & Gifts" },
    { to: "/occasions", label: "Occasions" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <Sparkles className="announcement-icon" size={14} />
          <span>
            Craft Hampers & Bouquets · Thoughtfully Crafted, Beautifully Gifted · Pre-book for your
            special days!
          </span>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="announcement-link">
            <MessageCircle size={13} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`snapcraft-navbar ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Brand Logo with Official Uploaded Image */}
          <Link to="/" className="navbar-brand" aria-label="SnapCraft - Craft Hampers & Bouquets">
            <div className="logo-badge">
              <img
                src={logoImg}
                alt="SnapCraft Official Brand Logo"
                className="official-logo-img"
              />
            </div>
            <div className="brand-text-lockup">
              <span className="brand-title">
                Snap<span className="brand-title-accent">Craft</span>
              </span>
              <span className="brand-tagline">Craft Hampers & Bouquets</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-menu" aria-label="Primary Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "nav-link is-active" }}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="navbar-actions">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="nav-action-btn"
              aria-label="Search hampers and gifts"
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="nav-action-btn"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="nav-action-btn nav-cart-btn"
              aria-label="View Shopping Cart"
              title="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="action-badge pulse">{cartCount}</span>}
            </button>

            {/* Shop Now CTA */}
            <Link to="/hampers" className="btn btn-terracotta nav-cta-btn">
              <span>Shop Now</span>
              <ArrowRight size={15} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? "is-open" : ""}`}>
          <div className="mobile-drawer-inner">
            <div className="mobile-brand-row">
              <img src={logoImg} alt="SnapCraft" className="mobile-logo-thumb" />
              <div>
                <p className="mobile-brand-name">SnapCraft</p>
                <small className="mobile-brand-sub">Craft Hampers & Bouquets</small>
              </div>
            </div>

            <nav className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "mobile-link is-active" }}
                  className="mobile-link"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} />
                </Link>
              ))}
              <a
                href="#custom-builder"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link highlight-link"
              >
                <span>✨ Custom Gift Builder</span>
                <ArrowRight size={16} />
              </a>
            </nav>

            <div className="mobile-drawer-footer">
              <div className="mobile-contact-card">
                <p className="mobile-contact-title">Direct Enquiries & Orders</p>
                <a href={`tel:+91${PHONE_NUMBER}`} className="mobile-contact-row">
                  <Phone size={16} /> +91 {PHONE_NUMBER}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp-mobile"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
