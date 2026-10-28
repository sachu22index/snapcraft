import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Check,
  Heart,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { BUILDER_DATA, logoImg } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_LINK } from "@/components/Navbar";
import customHamperPreview from "@/assets/bloom-bliss-hamper.jpg";

type PackagingItem = (typeof BUILDER_DATA.packagingStyles)[number];
type FlowerItem = (typeof BUILDER_DATA.flowers)[number];
type ChocolateItem = (typeof BUILDER_DATA.chocolates)[number];
type SnackItem = (typeof BUILDER_DATA.snacksGourmet)[number];
type PersonalizedItem = (typeof BUILDER_DATA.personalizedItems)[number];
type WaxSealItem = (typeof BUILDER_DATA.waxSeals)[number];

const defaultOccasion = BUILDER_DATA.occasions[0]?.label ?? "";
const defaultRecipient = BUILDER_DATA.recipients[0]?.label ?? "";
const defaultPackaging = BUILDER_DATA.packagingStyles[0]!;
const defaultFlower = BUILDER_DATA.flowers[0]!;
const defaultChocolate = BUILDER_DATA.chocolates[0]!;
const defaultSnack = BUILDER_DATA.snacksGourmet[0]!;
const defaultPersonalized = BUILDER_DATA.personalizedItems[0]!;
const defaultWaxSeal = BUILDER_DATA.waxSeals[0]!;

export function CustomGiftBuilder() {
  const { addCustomItemToCart } = useCart();

  // Selected state
  const [occasion, setOccasion] = useState<string>(defaultOccasion);
  const [recipient, setRecipient] = useState<string>(defaultRecipient);
  const [packaging, setPackaging] = useState<PackagingItem>(defaultPackaging);
  const [flower, setFlower] = useState<FlowerItem>(defaultFlower);
  const [chocolate, setChocolate] = useState<ChocolateItem>(defaultChocolate);
  const [snack, setSnack] = useState<SnackItem>(defaultSnack);
  const [personalized, setPersonalized] = useState<PersonalizedItem>(defaultPersonalized);
  const [waxSeal, setWaxSeal] = useState<WaxSealItem>(defaultWaxSeal);
  const [cardMessage, setCardMessage] = useState(
    "Wishing you a celebration as bright and wonderful as your smile! Handcrafted with lots of love.",
  );
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  // Base curation base fee
  const baseCraftFee = 799;

  // Compute total price dynamically
  const totalPrice = useMemo(() => {
    return (
      baseCraftFee +
      packaging.price +
      flower.price +
      chocolate.price +
      snack.price +
      personalized.price
    );
  }, [packaging, flower, chocolate, snack, personalized]);

  const handleBuildGift = () => {
    const summaryList = [
      `Occasion: ${occasion}`,
      `For: ${recipientName ? `${recipientName} (${recipient})` : recipient}`,
      `Packaging: ${packaging.label}`,
      `Flowers: ${flower.label}`,
      `Sweets: ${chocolate.label}`,
      `Gourmet: ${snack.label}`,
      `Keepsake: ${personalized.label}`,
      `Wax Seal: ${waxSeal.label}`,
    ];

    addCustomItemToCart({
      name: `Custom Curated Gift Hamper (${occasion})`,
      price: totalPrice,
      image: customHamperPreview,
      quantity: 1,
      packagingStyle: packaging.label,
      giftMessage: cardMessage,
      customDetails: summaryList.join(" · "),
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const getWhatsAppMessage = () => {
    const text = `Hello SnapCraft! I customized a gift on your website:
✨ *Custom Gift Hamper*
• *Occasion:* ${occasion}
• *Recipient:* ${recipientName || recipient}
• *Packaging:* ${packaging.label}
• *Flowers:* ${flower.label}
• *Sweets:* ${chocolate.label}
• *Gourmet:* ${snack.label}
• *Personalized Keepsake:* ${personalized.label}
• *Wax Seal:* ${waxSeal.label}
• *Card Note:* "${cardMessage}"
${senderName ? `• *From:* ${senderName}` : ""}

Please confirm if this can be crafted for me!`;
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  };

  const resetCustomizer = () => {
    setOccasion(defaultOccasion);
    setRecipient(defaultRecipient);
    setPackaging(defaultPackaging);
    setFlower(defaultFlower);
    setChocolate(defaultChocolate);
    setSnack(defaultSnack);
    setPersonalized(defaultPersonalized);
    setWaxSeal(defaultWaxSeal);
    setCardMessage("Wishing you a celebration as bright and wonderful as your smile!");
  };

  return (
    <section className="custom-builder-section" id="custom-builder">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Interactive Bespoke Studio</span>
          </div>
          <h2 className="section-main-heading">
            Create a Gift That’s <span className="heading-serif-italic">Uniquely Yours</span>
          </h2>
          <p className="section-subheading">
            Handpick every bloom, delicacy, keepsake, and handwritten note. Watch your custom hamper
            come alive with instant pricing and artisan packing.
          </p>
        </div>

        {/* Builder Studio Layout */}
        <div className="builder-layout-grid">
          {/* Left Column: Interactive Options Selection */}
          <div className="builder-controls-panel">
            {/* Step 1: Occasion */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">1</span>
                <div>
                  <h3 className="step-title">Choose the Occasion</h3>
                  <small className="step-hint">Select the reason you are celebrating</small>
                </div>
              </div>
              <div className="choice-chip-grid">
                {BUILDER_DATA.occasions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOccasion(item.label)}
                    className={`builder-chip ${occasion === item.label ? "is-selected" : ""}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Recipient */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">2</span>
                <div>
                  <h3 className="step-title">Who is this gift for?</h3>
                  <small className="step-hint">Tailors our personal presentation style</small>
                </div>
              </div>
              <div className="choice-chip-grid">
                {BUILDER_DATA.recipients.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRecipient(item.label)}
                    className={`builder-chip ${recipient === item.label ? "is-selected" : ""}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="builder-input-row">
                <input
                  type="text"
                  placeholder="Recipient Name (optional)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="builder-text-input"
                />
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="builder-text-input"
                />
              </div>
            </div>

            {/* Step 3: Packaging Style */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">3</span>
                <div>
                  <h3 className="step-title">Select Packaging Style</h3>
                  <small className="step-hint">The foundation of your presentation</small>
                </div>
              </div>
              <div className="builder-cards-list">
                {BUILDER_DATA.packagingStyles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPackaging(item)}
                    className={`builder-card-option ${packaging.id === item.id ? "is-selected" : ""}`}
                  >
                    <div className="option-icon-box">{item.icon}</div>
                    <div className="option-meta-box">
                      <strong>{item.label}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Flowers & Botanical */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">4</span>
                <div>
                  <h3 className="step-title">Flowers & Botanicals</h3>
                  <small className="step-hint">Fresh blooms or everlasting dried flora</small>
                </div>
              </div>
              <div className="builder-cards-list">
                {BUILDER_DATA.flowers.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setFlower(item)}
                    className={`builder-card-option ${flower.id === item.id ? "is-selected" : ""}`}
                  >
                    <div className="option-icon-box">{item.icon}</div>
                    <div className="option-meta-box">
                      <strong>{item.label}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 5: Chocolates & Confections */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">5</span>
                <div>
                  <h3 className="step-title">Chocolates & Sweet Delights</h3>
                  <small className="step-hint">Artisanal confections made with pure cocoa</small>
                </div>
              </div>
              <div className="builder-cards-list">
                {BUILDER_DATA.chocolates.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setChocolate(item)}
                    className={`builder-card-option ${chocolate.id === item.id ? "is-selected" : ""}`}
                  >
                    <div className="option-icon-box">{item.icon}</div>
                    <div className="option-meta-box">
                      <strong>{item.label}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 6: Gourmet Snacks & Keepsakes */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">6</span>
                <div>
                  <h3 className="step-title">Gourmet Treats & Keepsakes</h3>
                  <small className="step-hint">Honey, cider, photo frames & scented candles</small>
                </div>
              </div>
              <div className="builder-dual-subgrid">
                <div>
                  <small className="subgrid-heading">Gourmet Addition:</small>
                  {BUILDER_DATA.snacksGourmet.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSnack(item)}
                      className={`builder-card-compact ${snack.id === item.id ? "is-selected" : ""}`}
                    >
                      <span>
                        {item.icon} {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <small className="subgrid-heading">Personalized Keepsake:</small>
                  {BUILDER_DATA.personalizedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setPersonalized(item)}
                      className={`builder-card-compact ${personalized.id === item.id ? "is-selected" : ""}`}
                    >
                      <span>
                        {item.icon} {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 7: Message Card & Wax Seal */}
            <div className="builder-step-block">
              <div className="step-label-row">
                <span className="step-badge">7</span>
                <div>
                  <h3 className="step-title">Message Card & Wax Seal</h3>
                  <small className="step-hint">
                    Printed on deckle-edge paper and sealed by hand
                  </small>
                </div>
              </div>

              <div className="wax-seal-picker">
                <small>Select Wax Seal Color:</small>
                <div className="seal-color-options">
                  {BUILDER_DATA.waxSeals.map((seal) => (
                    <button
                      key={seal.id}
                      type="button"
                      onClick={() => setWaxSeal(seal)}
                      className={`seal-dot-btn ${waxSeal.id === seal.id ? "is-active" : ""}`}
                      style={{ backgroundColor: seal.color }}
                      title={seal.label}
                    >
                      {waxSeal.id === seal.id && <Check size={14} className="seal-check-icon" />}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder="Write your personal gift message here..."
                className="builder-textarea"
              />
            </div>
          </div>

          {/* Right Column: Live Summary & Price Breakdown Card */}
          <div className="builder-summary-col">
            <div className="builder-summary-card">
              <div className="summary-card-header">
                <div className="summary-brand-tag">
                  <img src={logoImg} alt="SnapCraft" className="summary-mini-logo" />
                  <span>Bespoke Hamper Recipe</span>
                </div>
                <button
                  type="button"
                  onClick={resetCustomizer}
                  className="summary-reset-btn"
                  title="Reset to defaults"
                >
                  <RefreshCw size={14} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Visual Hamper Thumbnail Preview */}
              <div className="summary-preview-frame">
                <img
                  src={customHamperPreview}
                  alt="Custom gift hamper preview"
                  className="summary-preview-img"
                />
                <div className="summary-wax-seal-badge" style={{ backgroundColor: waxSeal.color }}>
                  <span>✦ {waxSeal.label} ✦</span>
                </div>
              </div>

              {/* Inclusions Itemized Breakdown */}
              <div className="summary-items-list">
                <div className="summary-row">
                  <span>Occasion & Recipient</span>
                  <strong>
                    {occasion} · {recipient}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Packaging</span>
                  <strong>{packaging.label}</strong>
                </div>

                {flower.id !== "no-flower" && (
                  <div className="summary-row">
                    <span>Florals</span>
                    <strong>{flower.label}</strong>
                  </div>
                )}

                {chocolate.id !== "no-chocolate" && (
                  <div className="summary-row">
                    <span>Chocolates</span>
                    <strong>{chocolate.label}</strong>
                  </div>
                )}

                {snack.id !== "none-snack" && (
                  <div className="summary-row">
                    <span>Gourmet</span>
                    <strong>{snack.label}</strong>
                  </div>
                )}

                {personalized.id !== "none-personalized" && (
                  <div className="summary-row">
                    <span>Keepsake</span>
                    <strong>{personalized.label}</strong>
                  </div>
                )}

                <div className="summary-row">
                  <span>Styling & Wax Seal</span>
                  <strong>{waxSeal.label}</strong>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="summary-total-box">
                <div>
                  <small>Custom Design:</small>
                  <span className="summary-total-amount">Bespoke Selection</span>
                </div>
                <span className="summary-free-ship-tag">Handcrafted to Order</span>
              </div>

              {/* Main Action Buttons */}
              <div className="summary-actions-stack">
                <button
                  type="button"
                  onClick={handleBuildGift}
                  className={`btn btn-terracotta btn-full ${isAdded ? "btn-success" : ""}`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>Custom Hamper Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Build My Gift & Add to Cart</span>
                    </>
                  )}
                </button>

                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp-outline btn-full"
                >
                  <MessageCircle size={18} />
                  <span>Discuss & Book on WhatsApp</span>
                </a>
              </div>

              <div className="summary-footer-guarantee">
                <Heart size={14} className="heart-icon-mini" />
                <span>Hand-assembled & photographed before dispatch for your approval.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
