import React, { useState } from "react";
import { X, Star, Heart, ShoppingBag, Eye, Check, Gift, Clock, Sparkles } from "lucide-react";
import { AdminProduct } from "@/types/admin";
import { handleImageError } from "@/lib/image-fallback";

interface ProductPreviewModalProps {
  product: AdminProduct;
  onClose: () => void;
}

export function ProductPreviewModal({ product, onClose }: ProductPreviewModalProps) {
  const [activeView, setActiveView] = useState<"card" | "detail">("detail");
  const [activeImg, setActiveImg] = useState(product.primaryImageUrl);

  const images = [
    product.primaryImageUrl,
    ...product.additionalImages.filter((img) => img !== product.primaryImageUrl),
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D6C7BE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#2A1D1A] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-[#C79E75]" />
            <span className="font-serif font-bold text-base">Storefront Live Preview</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C45934] text-white">
              {product.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#3E2C27] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveView("detail")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeView === "detail" ? "bg-[#C45934] text-white font-bold" : "text-[#D3C7BF]"
                }`}
              >
                Detail View
              </button>
              <button
                type="button"
                onClick={() => setActiveView("card")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeView === "card" ? "bg-[#C45934] text-white font-bold" : "text-[#D3C7BF]"
                }`}
              >
                Catalogue Card
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#3E2C27] text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="p-6 md:p-8">
          {activeView === "card" ? (
            <div className="max-w-xs mx-auto">
              <p className="text-xs text-center text-[#6E5C56] mb-4">
                This is how your creation appears in product grids across the homepage and
                catalogue.
              </p>

              <article className="snapcraft-product-card bg-white rounded-xl overflow-hidden border border-[#E8DED6] shadow-sm">
                <div className="product-card-media relative aspect-square overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={product.primaryImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  {product.badge && product.badge !== "None" && (
                    <span
                      className={`product-badge badge-${product.badge.toLowerCase()} absolute top-3 left-3 bg-[#C45934] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm`}
                    >
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-white/90 text-[#C45934] flex items-center justify-center shadow-xs"
                    >
                      <Heart size={15} />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-white/90 text-[#2A1D1A] flex items-center justify-center shadow-xs"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#C45934] text-[11px] uppercase tracking-wider">
                      {product.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-[#2A1D1A] font-bold text-xs">
                      <Star size={12} className="fill-[#C99738] text-[#C99738]" />
                      <span>{product.rating}</span>
                      <small className="text-[#6E5C56]">({product.reviewsCount})</small>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#2A1D1A] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#6E5C56] line-clamp-2">{product.shortDescription}</p>

                  <div className="pt-2 border-t border-[#E8DED6] flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#2A1D1A]">₹{product.price}</span>
                      {product.salePrice && (
                        <span className="text-xs text-[#A5958E] line-through ml-1.5">
                          ₹{product.salePrice}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-[#C45934] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E8DED6] p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Media gallery */}
              <div className="space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DED6]">
                  <img
                    src={activeImg}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImg(img)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                          activeImg === img ? "border-[#C45934]" : "border-[#E8DED6]"
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumb"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C45934] font-bold uppercase tracking-wider text-[11px]">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#2A1D1A]">
                    <Star size={13} className="fill-[#C99738] text-[#C99738]" />
                    <span>{product.rating}</span>
                    <span className="text-[#6E5C56]">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-[#2A1D1A]">{product.name}</h2>
                {product.tagline && (
                  <p className="text-xs italic text-[#C45934] font-serif">{product.tagline}</p>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#2A1D1A]">₹{product.price}</span>
                  {product.salePrice && (
                    <span className="text-sm text-[#A5958E] line-through">
                      ₹{product.salePrice}
                    </span>
                  )}
                  <span className="text-[11px] text-[#2E4624] font-semibold bg-[#EDF3EB] px-2 py-0.5 rounded-full">
                    Handcrafted to Order
                  </span>
                </div>

                <p className="text-xs text-[#6E5C56] leading-relaxed">
                  {product.fullDescription || product.shortDescription}
                </p>

                {/* Inclusions */}
                {product.inclusions && product.inclusions.length > 0 && (
                  <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E8DED6] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1D1A] flex items-center gap-1.5">
                      <Gift size={13} className="text-[#C45934]" />
                      <span>What's Inside This Hamper</span>
                    </h4>
                    <ul className="text-xs space-y-1 text-[#6E5C56]">
                      {product.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lead time */}
                <div className="flex items-center gap-2 text-xs text-[#6E5C56] bg-white border border-[#E8DED6] px-3 py-2 rounded-lg">
                  <Clock size={14} className="text-[#C45934]" />
                  <span>{product.leadTime}</span>
                </div>

                {/* Add to Cart CTA */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    className="flex-1 py-2.5 bg-[#C45934] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    className="p-2.5 border border-[#D6C7BE] rounded-lg text-[#C45934] hover:bg-[#FDF1ED]"
                  >
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
