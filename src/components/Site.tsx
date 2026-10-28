import React, { type ReactNode, type FormEvent, useState, useEffect, useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Gift,
  Heart,
  Instagram,
  MessageCircle,
  Phone,
  Sparkles,
  X,
  ZoomIn,
  Check,
  ShoppingBag,
  Star,
} from "lucide-react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Navbar, PHONE_NUMBER, WHATSAPP_LINK, INSTAGRAM_LINK } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { SearchModal } from "@/components/SearchModal";
import { QuickViewModal } from "@/components/QuickViewModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderConfirmationModal } from "@/components/OrderConfirmationModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PRODUCTS, logoImg } from "@/data/products";
import { occasions } from "@/data/occasions";
import { creations, portfolioCategories, portfolioItems } from "@/data/portfolio";

import { usePublicProducts } from "@/hooks/use-products";
import { handleImageError } from "@/lib/image-fallback";

export const PHONE = PHONE_NUMBER;
export const WHATSAPP = WHATSAPP_LINK;
export const INSTAGRAM = INSTAGRAM_LINK;

export function WhatsAppLink({
  children,
  message,
  className = "btn btn-whatsapp",
}: {
  children: ReactNode;
  message?: string;
  className?: string;
}) {
  const href = message ? `${WHATSAPP}?text=${encodeURIComponent(message)}` : WHATSAPP;
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <div className="snapcraft-admin-root">{children}</div>;
  }

  return (
    <CartProvider>
      <div className="snapcraft-app-root">
        <Navbar />
        <main className="snapcraft-page-main">{children}</main>
        <Footer />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <WishlistDrawer />
        <SearchModal />
        <QuickViewModal />
        <CheckoutModal />
        <OrderConfirmationModal />

        {/* Floating WhatsApp Quick Action Button */}
        <WhatsAppLink
          className="whatsapp-floating-bubble"
          message="Hello SnapCraft, I would like to create a custom hamper or bouquet."
        >
          <MessageCircle size={24} />
          <span className="bubble-text">Chat on WhatsApp</span>
        </WhatsAppLink>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>
    </CartProvider>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={`section-header-${align}`}>
      {eyebrow && (
        <div className="section-eyebrow">
          <Sparkles size={14} />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="section-main-heading">{title}</h2>
      {text && <p className="section-subheading">{text}</p>}
    </header>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="subpage-hero-banner">
      <div className="section-container">
        <div className="subpage-hero-grid">
          <div className="subpage-hero-copy">
            <div className="hero-eyebrow-pill">
              <Sparkles size={14} />
              <span>{eyebrow}</span>
            </div>
            <h1 className="subpage-hero-title">{title}</h1>
            <p className="subpage-hero-lede">{text}</p>
            {children}
          </div>
          <div className="subpage-hero-visual">
            <img src={image} alt={title} className="subpage-hero-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="cta-band-section">
      <div className="section-container">
        <div className="cta-band-card">
          <div className="cta-sparkle-icon">
            <Heart size={28} className="fill-terracotta text-terracotta" />
          </div>
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Made personally, remembered always</span>
          </div>
          <h2 className="cta-band-heading">Have Someone Special In Mind?</h2>
          <p className="cta-band-subtext">
            Let SnapCraft help you craft a bespoke hamper or bouquet that speaks from the heart.
          </p>
          <div className="cta-buttons-row">
            <a href="#custom-builder" className="btn btn-terracotta">
              <span>Create Your Gift</span>
              <ArrowRight size={17} />
            </a>
            <WhatsAppLink
              className="btn btn-whatsapp"
              message="Hello SnapCraft, I have someone special in mind and would love to plan a surprise gift!"
            >
              <MessageCircle size={17} />
              <span>Chat on WhatsApp</span>
            </WhatsAppLink>
            11
          </div>
        </div>
      </div>
    </section>
  );
}

export function HamperGrid({ limit }: { limit?: number }) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const { products: liveProducts, isLoading } = usePublicProducts();
  const source = liveProducts.length > 0 || !isLoading ? liveProducts : PRODUCTS;
  const items = limit ? source.slice(0, limit) : source;

  return (
    <div className="product-cards-grid">
      {items.map((item) => {
        const isWishlisted = isInWishlist(item.id);
        return (
          <article
            className="snapcraft-product-card"
            key={item.id}
            onClick={() => setQuickViewProduct(item)}
          >
            <div className="product-card-media">
              <img
                src={item.image}
                alt={item.name}
                className="product-card-img"
                loading="lazy"
                onError={handleImageError}
              />
              {item.badge && (
                <span className={`product-badge badge-${item.badge.toLowerCase()}`}>
                  {item.badge}
                </span>
              )}
              <div className="product-overlay-actions">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className={`overlay-icon-btn ${isWishlisted ? "is-wishlisted" : ""}`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} className={isWishlisted ? "fill-terracotta" : ""} />
                </button>
              </div>
            </div>

            <div className="product-card-info">
              <div className="product-meta-row">
                <span className="product-cat-tag">{item.categoryLabel}</span>
                <div className="product-rating-box">
                  <Star size={13} className="star-filled" />
                  <span>{item.rating}</span>
                </div>
              </div>
              <h3 className="product-card-title">
                <Link
                  to="/products/$slug"
                  params={{ slug: item.slug }}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-[#C45934] transition-colors"
                >
                  {item.name}
                </Link>
              </h3>
              <p className="product-card-desc">{item.description}</p>
              <div className="product-pricing-row">
                <span className="product-lead-badge">
                  {item.leadTime || "Handcrafted to Order"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item, 1);
                  }}
                  className="btn-add-cart"
                >
                  <ShoppingBag size={15} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function OccasionGrid({ limit }: { limit?: number }) {
  const items = limit ? occasions.slice(0, limit) : occasions;
  return (
    <div className="occasion-grid">
      {items.map((item, index) => (
        <article className="occasion-card reveal" key={item.title}>
          <img
            src={item.image}
            alt={`${item.title} creations`}
            width={1600}
            height={1200}
            loading="lazy"
            style={{ objectPosition: `${25 + (index % 4) * 18}% center` }}
          />
          <div className="occasion-card__overlay">
            <span>0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link
              to="/creations"
              search={{ occasion: item.short }}
              className="text-link text-link--light"
            >
              Explore <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CreationGrid() {
  const { addToCart } = useCart();
  return (
    <div className="catalogue-grid">
      {creations.slice(0, 11).map((item, index) => (
        <article className="creation-card" key={item.title}>
          <div className="creation-card__image">
            <img
              src={item.image}
              alt={item.title}
              width={1600}
              height={1200}
              loading="lazy"
              style={{ objectPosition: `${30 + (index % 4) * 18}% center` }}
            />
          </div>
          <div className="creation-card__body">
            <span>{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="creation-card__footer">
              <strong>Price on Request</strong>
              <WhatsAppLink
                className="btn btn-outline-terracotta btn-sm"
                message={`Hello SnapCraft, I would like to enquire about ${item.title}.`}
              >
                <span>Enquire</span>
                <ArrowRight size={14} />
              </WhatsAppLink>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PortfolioGallery() {
  const [filter, setFilter] = useState<(typeof portfolioCategories)[number]>("All");
  const [selected, setSelected] = useState<(typeof portfolioItems)[number] | null>(null);
  const filtered = useMemo(
    () => (filter === "All" ? portfolioItems : portfolioItems.filter((i) => i.category === filter)),
    [filter],
  );

  useEffect(() => {
    if (!selected) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter portfolio">
        {portfolioCategories.map((category) => (
          <button
            key={category}
            className={filter === category ? "active" : ""}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="masonry">
        {filtered.map((item, index) => (
          <button
            className={`portfolio-card portfolio-card--${(index % 3) + 1}`}
            key={item.id}
            onClick={() => setSelected(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              width={1600}
              height={1200}
              loading="lazy"
              style={{ objectPosition: `${25 + (item.id % 4) * 20}% center` }}
            />
            <span className="portfolio-card__overlay">
              <small>{item.category}</small>
              <strong>{item.title}</strong>
              <ZoomIn />
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-title"
          onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal__panel">
            <button className="modal__close" onClick={() => setSelected(null)} aria-label="Close">
              <X />
            </button>
            <img src={selected.image} alt={selected.title} />
            <div>
              <p className="eyebrow">{selected.category}</p>
              <h2 id="portfolio-title">{selected.title}</h2>
              <p>{selected.description}</p>
              <WhatsAppLink
                message={`Hello SnapCraft, I like the ${selected.title} and would like to enquire.`}
              >
                Enquire about this <ArrowRight size={17} />
              </WhatsAppLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function FAQList() {
  const faqs = [
    [
      "How do I customize a hamper or bouquet with SnapCraft?",
      "You can use our interactive 'Custom Gift Builder' right on the website to choose your packaging, flowers, chocolates, dry fruits, and personalized keepsakes! Alternatively, you can message our florists directly on WhatsApp (+91 7510925645) with your ideas and budget.",
    ],
    [
      "Do you provide delivery across India?",
      "Yes! We deliver across India with protective insulated packaging. For local deliveries in our hub cities (Kochi, Bengaluru), same-day and midnight surprise slots are available upon advance confirmation.",
    ],
    [
      "Can I include custom photos or names?",
      "Absolutely. We offer photo merging frames, engraved wooden keepsakes, personalized mugs, custom ribbon tags, and handwritten greeting cards sealed with authentic wax stamps.",
    ],
    [
      "How early should I pre-book my hampers?",
      "We recommend pre-booking at least 24 to 48 hours in advance for bespoke hampers so our florists have adequate time to source the freshest blooms and craft your custom details.",
    ],
    [
      "What payment methods do you accept?",
      "We accept instant UPI (Google Pay, PhonePe, Paytm), Netbanking, Credit & Debit Cards, and Pay on Delivery options.",
    ],
    [
      "Do you handle wedding decorations and bridal garlands?",
      "Yes! SnapCraft designs exquisite fresh rose petal garlands (Varmala) for brides and grooms, ceremonial baptism candles, and floral venue decorations.",
    ],
  ] as const;

  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {faqs.map(([question, answer], index) => (
        <article className={`faq-item ${open === index ? "is-open" : ""}`} key={question}>
          <button
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            <span>{question}</span>
            <ChevronDown />
          </button>
          <div className="faq-answer">
            <p>{answer}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

interface ContactFormErrors {
  name?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  occasion?: string | undefined;
  service?: string | undefined;
  message?: string | undefined;
}

export function ContactForm() {
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: ContactFormErrors = {};

    const nameVal = String(data.get("name") ?? "").trim();
    const phoneVal = String(data.get("phone") ?? "").trim();
    const occasionVal = String(data.get("occasion") ?? "").trim();
    const serviceVal = String(data.get("service") ?? "").trim();
    const messageVal = String(data.get("message") ?? "").trim();

    if (!nameVal) next.name = "Please complete this field.";
    if (!phoneVal) next.phone = "Please complete this field.";
    if (!occasionVal) next.occasion = "Please complete this field.";
    if (!serviceVal) next.service = "Please complete this field.";
    if (!messageVal) next.message = "Please complete this field.";

    if (phoneVal.replace(/\D/g, "").length < 10) {
      next.phone = "Enter a valid 10-digit phone number.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitted(true);
    const message = `Hello SnapCraft! I am ${nameVal}. I am enquiring about a ${serviceVal} for ${occasionVal}.
Message: "${messageVal}"
Phone: ${phoneVal}${data.get("email") ? ` · Email: ${data.get("email")}` : ""}`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const field = (name: keyof ContactFormErrors, label: string, type = "text") => (
    <label>
      <span>
        {label}
        {name !== "email" && " *"}
      </span>
      <input
        name={name}
        type={type}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && <small id={`${name}-error`}>{errors[name]}</small>}
    </label>
  );

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      {submitted && (
        <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          Enquiry prepared! Opening WhatsApp conversation with SnapCraft florists...
        </div>
      )}
      <div className="form-grid">
        {field("name", "Your Name")}
        {field("phone", "Phone Number", "tel")}
        {field("email", "Email Address (optional)", "email")}
        <label>
          <span>Occasion *</span>
          <select name="occasion" defaultValue="">
            <option value="" disabled>
              Select an occasion
            </option>
            {[
              "Birthday",
              "Engagement",
              "Wedding",
              "Pregnancy",
              "Holy Communion",
              "Baptism",
              "Anniversary",
              "Corporate",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          {errors.occasion && <small>{errors.occasion}</small>}
        </label>
        <label>
          <span>Service / Gift Type *</span>
          <select name="service" defaultValue="">
            <option value="" disabled>
              Select a creation
            </option>
            {[
              "Gift Hamper",
              "Flower Bouquet",
              "Chocolate Box",
              "Photo Keepsake Frame",
              "Wedding Garland",
              "Custom Bespoke Hamper",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          {errors.service && <small>{errors.service}</small>}
        </label>
      </div>
      <label>
        <span>Message & Customization Details *</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us what you would love to create, your budget, and delivery date…"
          aria-invalid={!!errors.message}
        />
        {errors.message && <small>{errors.message}</small>}
      </label>
      <button
        className="btn btn-terracotta btn-full flex items-center justify-center gap-2"
        type="submit"
      >
        <span>Send Enquiry to SnapCraft</span>
        <MessageCircle size={18} />
      </button>
      <p className="form-note">
        Your enquiry will directly open in WhatsApp, ready for our artisan team to review!
      </p>
    </form>
  );
}
