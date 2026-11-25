import React from "react";
import {
  Check,
  MessageCircle,
  ArrowRight,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logoImg } from "@/data/products";
import { WHATSAPP_LINK } from "@/components/Navbar";

export function OrderConfirmationModal() {
  const { orderSuccess, setOrderSuccess } = useCart();

  if (!orderSuccess) return null;

  const handleWhatsAppSync = () => {
    const text = `🎉 *SnapCraft Order Placed!*
• *Order ID:* ${orderSuccess.orderId}
• *Recipient:* ${orderSuccess.customerName} (${orderSuccess.phone})
• *Delivery Date:* ${orderSuccess.deliveryDate} (${orderSuccess.deliverySlot})
• *Address:* ${orderSuccess.address}, ${orderSuccess.city} - ${orderSuccess.pincode}
• *Items:* ${orderSuccess.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
• *Order Request:* via ${orderSuccess.paymentMethod}

Please confirm receipt of this booking and share photos when ready!`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="order-modal-backdrop" onClick={() => setOrderSuccess(null)}>
      <div className="order-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOrderSuccess(null)}
          className="order-close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="order-modal-inner">
          {/* Top Success Badge */}
          <div className="order-success-icon-wrap">
            <Check size={36} />
          </div>

          <div className="order-header-text">
            <span className="order-sub-eyebrow">
              <Sparkles size={14} /> Booking Confirmed
            </span>
            <h2 className="order-headline">Your Gift is in Artisan Hands!</h2>
            <p className="order-desc">
              Thank you for trusting SnapCraft. We have received your order and our florists are
              preparing your handcrafted hamper with obsessive care.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="order-receipt-card">
            <div className="receipt-brand-row">
              <img src={logoImg} alt="SnapCraft" className="receipt-logo-thumb" />
              <div>
                <strong>SnapCraft Gifting Hub</strong>
                <small>Order #{orderSuccess.orderId}</small>
              </div>
            </div>

            <div className="receipt-meta-grid">
              <div className="receipt-meta-item">
                <Calendar size={15} />
                <span>
                  <strong>Date:</strong> {orderSuccess.deliveryDate}
                </span>
              </div>

              <div className="receipt-meta-item">
                <Clock size={15} />
                <span>
                  <strong>Slot:</strong> {orderSuccess.deliverySlot}
                </span>
              </div>

              <div className="receipt-meta-item">
                <MapPin size={15} />
                <span>
                  <strong>To:</strong> {orderSuccess.customerName}, {orderSuccess.city}
                </span>
              </div>

              <div className="receipt-meta-item">
                <Package size={15} />
                <span>
                  <strong>Method:</strong> {orderSuccess.paymentMethod}
                </span>
              </div>
            </div>

            {/* Items list */}
            <div className="receipt-items-list">
              {orderSuccess.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-olive font-medium">Bespoke</span>
                </div>
              ))}
            </div>

            <div className="receipt-total-row">
              <span>Total Items</span>
              <span className="receipt-total-amount">
                {orderSuccess.items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="order-actions-stack">
            <button onClick={handleWhatsAppSync} className="btn btn-whatsapp-confirm btn-full">
              <MessageCircle size={18} />
              <span>Send Order Confirmation to SnapCraft via WhatsApp</span>
            </button>

            <button
              onClick={() => setOrderSuccess(null)}
              className="btn btn-outline-olive btn-full"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
