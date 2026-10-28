import React, { useState } from "react";
import {
  X,
  Check,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Gift,
  Truck,
} from "lucide-react";
import { useCart, OrderDetails } from "@/context/CartContext";

export function CheckoutModal() {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartFinalTotal,
    clearCart,
    setOrderSuccess,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [pincode, setPincode] = useState("560001");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0] ?? "";
  });
  const [deliverySlot, setDeliverySlot] = useState("Morning (9 AM - 1 PM)");
  const [senderName, setSenderName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI (Google Pay / PhonePe / Paytm)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    recipientName?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    pincode?: string | undefined;
  }>({});

  if (!isCheckoutOpen) return null;

  const validateStep1 = () => {
    const errs: {
      recipientName?: string | undefined;
      phone?: string | undefined;
      address?: string | undefined;
      pincode?: string | undefined;
    } = {};
    if (!recipientName.trim()) errs.recipientName = "Recipient name is required";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10)
      errs.phone = "Valid 10-digit phone number is required";
    if (!address.trim()) errs.address = "Delivery address is required";
    if (!pincode.trim()) errs.pincode = "Pincode is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCompleteOrder = () => {
    setIsSubmitting(true);

    const generatedOrderId = `SC-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderData: OrderDetails = {
      orderId: generatedOrderId,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: cartFinalTotal,
      customerName: recipientName,
      phone,
      address,
      city,
      pincode,
      deliveryDate,
      deliverySlot,
      giftNote: specialInstructions,
      paymentMethod,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      setIsCheckoutOpen(false);
      setOrderSuccess(orderData);
    }, 1000);
  };

  return (
    <div className="checkout-modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
      <div className="checkout-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header-bar">
          <div className="checkout-header-title">
            <ShieldCheck size={20} className="text-olive" />
            <h3>Complete Your SnapCraft Order</h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="checkout-close-btn"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="checkout-step-tracker">
          <div className={`step-node ${step >= 1 ? "is-active" : ""}`}>
            <span className="step-circle">{step > 1 ? <Check size={14} /> : "1"}</span>
            <small>Delivery</small>
          </div>
          <div className={`step-connector ${step >= 2 ? "is-filled" : ""}`} />
          <div className={`step-node ${step >= 2 ? "is-active" : ""}`}>
            <span className="step-circle">{step > 2 ? <Check size={14} /> : "2"}</span>
            <small>Greeting Note</small>
          </div>
          <div className={`step-connector ${step === 3 ? "is-filled" : ""}`} />
          <div className={`step-node ${step === 3 ? "is-active" : ""}`}>
            <span className="step-circle">3</span>
            <small>Payment</small>
          </div>
        </div>

        {/* Body Content */}
        <div className="checkout-body-content">
          {/* STEP 1: Delivery Information */}
          {step === 1 && (
            <div className="checkout-step-form">
              <h4 className="step-form-heading">
                <MapPin size={17} /> Recipient & Delivery Address
              </h4>

              <div className="form-double-col">
                <div className="form-field-wrap">
                  <label>Recipient Full Name *</label>
                  <input
                    type="text"
                    placeholder="E.g., Anjali Sharma"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className={errors.recipientName ? "has-error" : ""}
                  />
                  {errors.recipientName && (
                    <small className="field-error">{errors.recipientName}</small>
                  )}
                </div>

                <div className="form-field-wrap">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={errors.phone ? "has-error" : ""}
                  />
                  {errors.phone && <small className="field-error">{errors.phone}</small>}
                </div>
              </div>

              <div className="form-field-wrap">
                <label>Street Address, Building / Flat No. *</label>
                <textarea
                  rows={2}
                  placeholder="Complete postal address for hand-delivery..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={errors.address ? "has-error" : ""}
                />
                {errors.address && <small className="field-error">{errors.address}</small>}
              </div>

              <div className="form-double-col">
                <div className="form-field-wrap">
                  <label>City / Town</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className="form-field-wrap">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={errors.pincode ? "has-error" : ""}
                  />
                  {errors.pincode && <small className="field-error">{errors.pincode}</small>}
                </div>
              </div>

              <div className="form-double-col">
                <div className="form-field-wrap">
                  <label>Preferred Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="form-field-wrap">
                  <label>Preferred Time Slot</label>
                  <select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)}>
                    <option>Morning (9 AM - 1 PM)</option>
                    <option>Afternoon (1 PM - 5 PM)</option>
                    <option>Evening (5 PM - 9 PM)</option>
                    <option>Midnight Surprise (11:30 PM - 12:15 AM)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Gift Note & Special Instructions */}
          {step === 2 && (
            <div className="checkout-step-form">
              <h4 className="step-form-heading">
                <Gift size={17} /> Personalised Greeting Card
              </h4>
              <p className="step-form-subtext">
                Every hamper includes a handwritten card with deckle-edge paper and genuine wax
                stamp.
              </p>

              <div className="form-field-wrap">
                <label>Your Name (Sender / From)</label>
                <input
                  type="text"
                  placeholder="How should we sign off the card? (E.g., Love, Karthik)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="form-field-wrap">
                <label>Delivery Instructions / Special Customizations</label>
                <textarea
                  rows={4}
                  placeholder="E.g., Surprise delivery, please do not disclose contents. Call before arriving. Ring door twice."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Payment Selection */}
          {step === 3 && (
            <div className="checkout-step-form">
              <h4 className="step-form-heading">
                <CreditCard size={17} /> Select Payment Method
              </h4>

              <div className="payment-options-list">
                {[
                  {
                    id: "upi",
                    title: "Instant UPI & QR Code (Fastest)",
                    desc: "Google Pay, PhonePe, Paytm, BHIM or any UPI app",
                    icon: Smartphone,
                    popular: true,
                  },
                  {
                    id: "cards",
                    title: "Credit / Debit Cards",
                    desc: "Visa, Mastercard, RuPay & American Express",
                    icon: CreditCard,
                  },
                  {
                    id: "pod",
                    title: "Pay on Handover / Delivery",
                    desc: "Pay via UPI or Cash upon receiving your creation",
                    icon: Banknote,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod.includes(opt.id) || paymentMethod === opt.title;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.title)}
                      className={`payment-option-card ${paymentMethod === opt.title ? "is-selected" : ""}`}
                    >
                      <div className="payment-radio-bubble">
                        {paymentMethod === opt.title && <div className="payment-radio-dot" />}
                      </div>
                      <Icon size={22} className="payment-icon" />
                      <div className="payment-meta">
                        <div className="flex items-center gap-2">
                          <strong>{opt.title}</strong>
                          {opt.popular && <span className="popular-tag">Recommended</span>}
                        </div>
                        <p>{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Recap in Step 3 */}
              <div className="checkout-recap-box">
                <div className="recap-row">
                  <span>Selected Gifts:</span>
                  <strong>{cart.reduce((s, i) => s + i.quantity, 0)} item(s)</strong>
                </div>
                <div className="recap-row">
                  <span>Packaging:</span>
                  <strong>Artisan Gift Box & Ribbon</strong>
                </div>
                <div className="recap-row">
                  <span>Order Coordination:</span>
                  <span className="text-olive font-medium">Direct WhatsApp Sync</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="checkout-footer-controls">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="btn btn-outline-olive flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button onClick={handleNext} className="btn btn-terracotta flex items-center gap-1.5">
              <span>Continue to {step === 1 ? "Greeting Card" : "Payment"}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleCompleteOrder}
              disabled={isSubmitting}
              className="btn btn-terracotta flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Securing Your Booking...</span>
              ) : (
                <>
                  <Check size={17} />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
