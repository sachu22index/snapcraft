import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  Star,
  Heart,
  ShoppingBag,
  MessageCircle,
  Clock,
  ShieldCheck,
  Check,
  Gift,
  FileText,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Share2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { getProductBySlug, getPublishedProducts, toPublicProduct } from "@/lib/products-service";
import { AdminProduct } from "@/types/admin";
import { Product } from "@/data/products";
import { WHATSAPP_LINK } from "@/components/Navbar";
import { PageHero, CTASection } from "@/components/Site";
import { handleImageError } from "@/lib/image-fallback";

export const Route = createFileRoute("/products/$slug")({
  head: () => ({
    meta: [
      { title: "Product Details — SnapCraft Gifts" },
      { name: "description", content: "Handcrafted personalized celebration hamper by SnapCraft" },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getProductBySlug(slug)
      .then((p) => {
        // Only published products can be viewed publicly
        if (p && p.status === "published") {
          setProduct(p);
          setSelectedImg(p.primaryImageUrl);

          // Fetch related published items
          getPublishedProducts().then((all) => {
            const related = all.filter(
              (item) => item.id !== p.id && item.category === p.categoryId,
            );
            setRelatedProducts(related.slice(0, 4));
          });
        } else {
          setProduct(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C45934] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#6E5C56]">Loading handcrafted creation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF7F2] px-4 py-16">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl border border-[#E8DED6] shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-[#2A1D1A]">Creation Not Available</h2>
          <p className="text-xs text-[#6E5C56] mt-2 mb-6">
            The gift hamper or bouquet you are looking for is currently being customized, drafted,
            or no longer listed.
          </p>
          <Link
            to="/hampers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523]"
          >
            <ArrowLeft size={14} />
            <span>Explore All Hampers</span>
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const publicItem = toPublicProduct(product);

  const images = [
    product.primaryImageUrl,
    ...product.additionalImages.filter((img) => img !== product.primaryImageUrl),
  ];

  const handleAddToCart = () => {
    addToCart(publicItem, quantity, { giftMessage: giftNote });
    setIsAdded(true);
    toast.success(`"${product.name}" added to your cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getWhatsAppProductLink = () => {
    const text = `Hello SnapCraft! I am enquiring about:
*${product.name}* (Price: ₹${product.price})
${giftNote ? `Personal message: "${giftNote}"` : ""}
Please let me know availability and delivery slots!`;
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="product-detail-page bg-[#FAF7F2] pb-16">
      {/* Breadcrumbs */}
      <div className="section-container pt-6 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#6E5C56]">
          <Link to="/" className="hover:text-[#C45934]">
            Home
          </Link>
          <ChevronRight size={12} className="text-[#A5958E]" />
          <Link to="/hampers" className="hover:text-[#C45934]">
            Gifts & Hampers
          </Link>
          <ChevronRight size={12} className="text-[#A5958E]" />
          <span className="text-[#2A1D1A] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Showcase Section */}
      <section className="section-container">
        <div className="bg-white rounded-2xl border border-[#E8DED6] p-6 md:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Visual Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DED6] relative">
              <img
                src={selectedImg || product.primaryImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              {product.badge && product.badge !== "None" && (
                <span className="absolute top-4 left-4 bg-[#C45934] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImg === img
                        ? "border-[#C45934] ring-2 ring-[#C45934]/20"
                        : "border-[#E8DED6]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Inclusions, Add to Cart */}
          <div className="space-y-5">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#C45934] uppercase tracking-wider text-[11px]">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#2A1D1A]">
                <Star size={14} className="fill-[#C99738] text-[#C99738]" />
                <span>{product.rating}</span>
                <span className="text-[#6E5C56] font-normal">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Product Title & Tagline */}
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2A1D1A]">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="mt-1 text-sm text-[#C45934] font-serif italic">{product.tagline}</p>
              )}
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-3xl font-bold text-[#2A1D1A]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.salePrice && (
                <span className="text-base text-[#A5958E] line-through">
                  ₹{product.salePrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs font-semibold text-[#2E4624] bg-[#EDF3EB] px-2.5 py-1 rounded-full">
                All Taxes Included · Handcrafted Fresh
              </span>
            </div>

            {/* Full Story Description */}
            <p className="text-xs md:text-sm text-[#6E5C56] leading-relaxed">
              {product.fullDescription || product.shortDescription}
            </p>

            {/* Inclusions Checklist */}
            {product.inclusions && product.inclusions.length > 0 && (
              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E8DED6] space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1D1A] flex items-center gap-1.5">
                  <Gift size={15} className="text-[#C45934]" />
                  <span>What's Inside This Hamper:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#342825]">
                  {product.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lead Time & Guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#6E5C56] bg-white border border-[#E8DED6] p-3 rounded-xl">
              <Clock size={16} className="text-[#C45934] shrink-0" />
              <span>{product.leadTime || "Handcrafted to Order / 24 hrs pre-booking"}</span>
            </div>

            {/* Personal Handwritten Card Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Personalized Handwritten Greeting Card (Complimentary):
              </label>
              <textarea
                rows={2}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="E.g., Dear Maya, happy anniversary! Wishing you endless joy and laughter. Love, Rahul"
                className="w-full text-xs p-3 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
              />
            </div>

            {/* Quantity & Add to Cart Controls */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-[#E8DED6]"
                >
                  -
                </button>
                <span className="px-3">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 hover:bg-[#E8DED6]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-lg bg-[#C45934] text-white text-xs font-bold hover:bg-[#A74523] flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart (₹{(product.price * quantity).toLocaleString("en-IN")})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted
                    ? "bg-[#FDF1ED] border-[#C45934] text-[#C45934]"
                    : "border-[#D6C7BE] text-[#6E5C56] hover:bg-[#FAF7F2]"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} className={isWishlisted ? "fill-[#C45934]" : ""} />
              </button>
            </div>

            {/* WhatsApp Direct Action */}
            <a
              href={getWhatsAppProductLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#25D366]/10 text-[#1E7E34] hover:bg-[#25D366]/20 text-xs font-semibold transition-colors"
            >
              <MessageCircle size={16} />
              <span>Customise this creation with our florists on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Specifications & Downloadable Brochures */}
        {(product.specifications.length > 0 ||
          (product.downloadableAssets && product.downloadableAssets.length > 0)) && (
          <div className="mt-8 bg-white rounded-2xl border border-[#E8DED6] p-6 md:p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2A1D1A]">
              Product Specifications & Documents
            </h3>

            {product.specifications.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6] flex justify-between text-xs"
                  >
                    <span className="font-semibold text-[#6E5C56]">{spec.key}</span>
                    <span className="text-[#2A1D1A] font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {product.downloadableAssets && product.downloadableAssets.length > 0 && (
              <div className="pt-4 border-t border-[#E8DED6]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-3">
                  Downloadable Brochures & Guides
                </h4>
                <div className="flex flex-wrap gap-3">
                  {product.downloadableAssets.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D6C7BE] bg-[#FAF7F2] hover:bg-[#FDF1ED] text-xs font-medium text-[#2A1D1A] transition-colors"
                    >
                      <FileText size={15} className="text-[#C45934]" />
                      <span>{doc.name}</span>
                      <Download size={13} className="text-[#6E5C56]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#2A1D1A]">
              More Handcrafted Creations You May Love
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/products/$slug`}
                  params={{ slug: rel.slug }}
                  className="bg-white rounded-xl border border-[#E8DED6] overflow-hidden group shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-[#FAF7F2] overflow-hidden">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C45934]">
                      {rel.categoryLabel}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#2A1D1A] truncate">
                      {rel.name}
                    </h4>
                    <span className="font-bold text-xs text-[#2A1D1A] block">
                      ₹{rel.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="mt-12">
        <CTASection />
      </div>
    </div>
  );
}
