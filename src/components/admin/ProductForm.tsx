import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Tag,
  Gift,
  ListPlus,
  Layers,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AdminProduct, Category, ProductSpecification, ProductStatus } from "@/types/admin";
import {
  createProduct,
  updateProduct,
  generateSlug,
  generateSku,
  DEFAULT_CATEGORIES,
  getCategories,
} from "@/lib/products-service";
import { MediaUploader } from "./MediaUploader";
import { ProductPreviewModal } from "./ProductPreviewModal";

interface ProductFormProps {
  initialProduct?: AdminProduct;
  isEdit?: boolean;
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const navigate = useNavigate();

  // Form State
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialProduct?.slug));
  const [tagline, setTagline] = useState(initialProduct?.tagline || "");
  const [shortDesc, setShortDesc] = useState(initialProduct?.shortDescription || "");
  const [fullDesc, setFullDesc] = useState(initialProduct?.fullDescription || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "hampers");
  const [price, setPrice] = useState<string>(
    initialProduct?.price ? String(initialProduct.price) : "",
  );
  const [salePrice, setSalePrice] = useState<string>(
    initialProduct?.salePrice ? String(initialProduct.salePrice) : "",
  );
  const [currency, setCurrency] = useState(initialProduct?.currency || "INR");
  const [badge, setBadge] = useState<string>(initialProduct?.badge || "None");
  const [leadTime, setLeadTime] = useState(
    initialProduct?.leadTime || "Handcrafted to Order / 24 hrs",
  );
  const [isCustomizable, setIsCustomizable] = useState(initialProduct?.isCustomizable ?? true);
  const [isAvailable, setIsAvailable] = useState(initialProduct?.isAvailable ?? true);

  // Inclusions & Specifications
  const [inclusions, setInclusions] = useState<string[]>(
    initialProduct?.inclusions || [
      "Signature Handcrafted Gift Presentation Box",
      "Personalized Hand-Lettered Wax-Sealed Greeting Card",
    ],
  );
  const [newInclusion, setNewInclusion] = useState("");

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    initialProduct?.specifications || [
      { key: "Packaging", value: "Handcrafted Luxury Keepsake Box with Satin Ribbon" },
      { key: "Lead Time", value: "24-48 hours pre-booking recommended" },
      { key: "Delivery", value: "Pan-India insulated express delivery" },
    ],
  );

  // Occasions & Tags
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    initialProduct?.occasions || ["Birthday", "Anniversary"],
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    initialProduct?.tags || ["gift", "hamper", "handmade"],
  );

  // Media
  const [primaryImage, setPrimaryImage] = useState(initialProduct?.primaryImageUrl || "");
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initialProduct?.additionalImages || [],
  );
  const [videoUrl, setVideoUrl] = useState(initialProduct?.videoUrl || "");
  const [downloadableAssets, setDownloadableAssets] = useState(
    initialProduct?.downloadableAssets || [],
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || "");

  // Status & UI State
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || "draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"basics" | "pricing" | "media" | "specs" | "seo">(
    "basics",
  );

  // Load categories
  useEffect(() => {
    getCategories().then((cats) => {
      if (cats.length > 0) setCategories(cats);
    });
  }, []);

  // Sync state when initialProduct updates (e.g., when loaded in edit mode)
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || "");
      setSlug(initialProduct.slug || "");
      setIsSlugManual(Boolean(initialProduct.slug));
      setTagline(initialProduct.tagline || "");
      setShortDesc(initialProduct.shortDescription || "");
      setFullDesc(initialProduct.fullDescription || "");
      setSku(initialProduct.sku || "");
      setCategoryId(initialProduct.categoryId || "hampers");
      setPrice(initialProduct.price ? String(initialProduct.price) : "");
      setSalePrice(initialProduct.salePrice ? String(initialProduct.salePrice) : "");
      setCurrency(initialProduct.currency || "INR");
      setBadge(initialProduct.badge || "None");
      setLeadTime(initialProduct.leadTime || "Handcrafted to Order / 24 hrs");
      setIsCustomizable(initialProduct.isCustomizable ?? true);
      setIsAvailable(initialProduct.isAvailable ?? true);
      setInclusions(initialProduct.inclusions || []);
      setSpecifications(initialProduct.specifications || []);
      setSelectedOccasions(initialProduct.occasions || []);
      setTags(initialProduct.tags || []);
      setPrimaryImage(initialProduct.primaryImageUrl || "");
      setAdditionalImages(initialProduct.additionalImages || []);
      setVideoUrl(initialProduct.videoUrl || "");
      setDownloadableAssets(initialProduct.downloadableAssets || []);
      setSeoTitle(initialProduct.seoTitle || "");
      setSeoDescription(initialProduct.seoDescription || "");
      setStatus(initialProduct.status || "draft");
    }
  }, [initialProduct]);

  // Auto-generate slug when name changes (unless manually edited)
  useEffect(() => {
    if (!isSlugManual && name.trim()) {
      setSlug(generateSlug(name));
    }
  }, [name, isSlugManual]);

  // Auto-generate SKU if blank
  useEffect(() => {
    if (!sku && name.trim()) {
      setSku(generateSku(categoryId, name));
    }
  }, [categoryId, name, sku]);

  // Handle inclusions
  const addInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions([...inclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const removeInclusion = (idx: number) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };

  // Handle specifications
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index: number, key: string, value: string) => {
    const list = [...specifications];
    list[index] = { key, value };
    setSpecifications(list);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Handle tags
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const toggleOccasion = (occ: string) => {
    if (selectedOccasions.includes(occ)) {
      setSelectedOccasions(selectedOccasions.filter((o) => o !== occ));
    } else {
      setSelectedOccasions([...selectedOccasions, occ]);
    }
  };

  // Validate form
  const validate = (targetStatus: ProductStatus): boolean => {
    if (!name.trim()) {
      toast.error("Product name is required.");
      setActiveTab("basics");
      return false;
    }
    if (!shortDesc.trim()) {
      toast.error("Please enter a short description.");
      setActiveTab("basics");
      return false;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error("Please enter a valid price greater than 0.");
      setActiveTab("pricing");
      return false;
    }

    if (targetStatus === "published" && !primaryImage.trim()) {
      toast.error("A primary product image is required before publishing.");
      setActiveTab("media");
      return false;
    }

    return true;
  };

  // Build product object for preview or save
  const currentCategoryObj = categories.find((c) => c.id === categoryId);
  const currentProductData: AdminProduct = {
    id: initialProduct?.id || slug.trim() || generateSlug(name) || `prod-${Date.now()}`,
    name: name.trim(),
    slug: slug.trim() || generateSlug(name),
    tagline: tagline.trim(),
    shortDescription: shortDesc.trim(),
    fullDescription: fullDesc.trim() || shortDesc.trim(),
    sku: sku.trim() || generateSku(categoryId, name),
    categoryId,
    categoryLabel: currentCategoryObj?.name || "Gift Hampers",
    price: Number(price) || 0,
    salePrice: salePrice ? Number(salePrice) : undefined,
    currency,
    rating: initialProduct?.rating || 4.9,
    reviewsCount: initialProduct?.reviewsCount || 14,
    badge: badge !== "None" ? (badge as AdminProduct["badge"]) : null,
    primaryImageUrl: primaryImage.trim() || (initialProduct?.primaryImageUrl ?? ""),
    additionalImages: additionalImages.filter((img) => img !== primaryImage.trim()),
    inclusions,
    specifications: specifications.filter((s) => s.key.trim() && s.value.trim()),
    occasions: selectedOccasions,
    tags,
    leadTime,
    isCustomizable,
    isAvailable,
    status,
    seoTitle: seoTitle || `${name} — SnapCraft Luxury Gifts`,
    seoDescription: seoDescription || shortDesc,
    videoUrl,
    downloadableAssets,
    createdAt: initialProduct?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt:
      status === "published" ? initialProduct?.publishedAt || new Date().toISOString() : null,
  };

  const handleSave = async (targetStatus: ProductStatus) => {
    if (!validate(targetStatus)) return;

    setIsSubmitting(true);
    setStatus(targetStatus);

    try {
      const now = new Date().toISOString();
      const payload: AdminProduct = {
        ...currentProductData,
        status: targetStatus,
        publishedAt:
          targetStatus === "published"
            ? initialProduct?.publishedAt || now
            : null,
        updatedAt: now,
      };

      if (isEdit && initialProduct?.id) {
        await updateProduct(initialProduct.id, payload);
        toast.success(
          targetStatus === "published"
            ? "Product published to website successfully!"
            : "Product draft updated successfully!",
        );
      } else {
        await createProduct(payload);
        toast.success(
          targetStatus === "published"
            ? "New product published directly to website!"
            : "Product saved as draft successfully!",
        );
      }

      navigate({ to: "/admin/products" });
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allOccasionsList = [
    "Birthday",
    "Anniversary",
    "Wedding",
    "Engagement",
    "Love & Romance",
    "Valentine",
    "Baby Shower",
    "Baptism",
    "Corporate",
    "Festival",
    "Congratulations",
    "Thank You",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED6]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-lg bg-white border border-[#D6C7BE] hover:bg-[#FAF7F2] text-[#6E5C56]"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C45934]">
              {isEdit ? "Editing Product" : "New Creation"}
            </span>
            <h2 className="text-xl font-bold text-[#2A1D1A]">{name || "Untitled Product"}</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-2 rounded-lg bg-white border border-[#D6C7BE] text-xs font-semibold text-[#2A1D1A] hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-2xs"
          >
            <Eye size={14} className="text-[#C45934]" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave("draft")}
            className="px-4 py-2 rounded-lg bg-white border border-[#C45934] text-[#C45934] text-xs font-semibold hover:bg-[#FDF1ED] flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Save size={14} />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave("published")}
            className="px-4 py-2 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Send size={14} />
            <span>{isSubmitting ? "Publishing..." : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-[#E8DED6] gap-2 overflow-x-auto pb-1 text-xs font-medium">
        {[
          { id: "basics", label: "1. Basic Details", icon: Gift },
          { id: "pricing", label: "2. Pricing & Inclusions", icon: Tag },
          { id: "media", label: "3. Media & Assets", icon: Layers },
          { id: "specs", label: "4. Specifications", icon: ListPlus },
          { id: "seo", label: "5. SEO & Publishing", icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(tab.id as "basics" | "pricing" | "media" | "specs" | "seo")
              }
              className={`px-4 py-2.5 rounded-t-lg flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#C45934] text-[#C45934] bg-white font-bold"
                  : "border-transparent text-[#6E5C56] hover:text-[#2A1D1A] hover:bg-white/50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Basic Details */}
      {activeTab === "basics" && (
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 space-y-5 shadow-xs">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Victorian Garden Rose & Truffle Hamper"
              className="w-full text-sm px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C45934]/30 focus:border-[#C45934]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1D1A]">
                  Product URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManual(false);
                    setSlug(generateSlug(name));
                  }}
                  className="text-[10px] text-[#C45934] hover:underline"
                >
                  Regenerate from title
                </button>
              </div>
              <div className="flex items-center rounded-lg border border-[#D6C7BE] bg-[#FAF7F2] overflow-hidden focus-within:ring-2 focus-within:ring-[#C45934]/30 focus-within:border-[#C45934]">
                <span className="px-3 text-xs text-[#6E5C56]">/products/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  className="w-full text-xs px-2 py-2.5 bg-white border-l border-[#D6C7BE] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                SKU / Product Reference ID
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SC-HAM-104"
                className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Storefront Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
              >
                <option value="None">No Badge</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Signature">Signature</option>
                <option value="Popular">Popular</option>
                <option value="Romantic">Romantic</option>
                <option value="New">New Arrival</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Tagline (Catchy 1-line phrase)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. English garden roses, sparkling cider & Belgian chocolates"
              className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Short Description (Card Summary) *
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief summary displayed on catalogue cards and search results..."
              className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Full Product Description (Story & Experience)
            </label>
            <textarea
              rows={5}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Comprehensive description displayed on quick view modal and product detail page..."
              className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30 font-sans"
            />
          </div>

          {/* Occasions Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-2">
              Suitable Occasions
            </label>
            <div className="flex flex-wrap gap-2">
              {allOccasionsList.map((occ) => {
                const isSelected = selectedOccasions.includes(occ);
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#C45934] text-white shadow-2xs"
                        : "bg-[#FAF7F2] text-[#6E5C56] border border-[#E8DED6] hover:bg-[#FDF1ED]"
                    }`}
                  >
                    {occ} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pricing & Inclusions */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#6E5C56]">₹</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2499"
                  className="w-full text-sm pl-7 pr-3 py-2.5 border border-[#D6C7BE] rounded-lg font-bold text-[#2A1D1A] focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Original / Strike-through Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#6E5C56]">₹</span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="2999"
                  className="w-full text-sm pl-7 pr-3 py-2.5 border border-[#D6C7BE] rounded-lg text-[#6E5C56] focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Currency
              </label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full text-xs px-3 py-2.5 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] text-[#6E5C56]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Lead Time & Preparation Guarantee
              </label>
              <input
                type="text"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                placeholder="e.g. Same day dispatch / 24 hrs pre-booking"
                className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#2A1D1A]">
                <input
                  type="checkbox"
                  checked={isCustomizable}
                  onChange={(e) => setIsCustomizable(e.target.checked)}
                  className="w-4 h-4 text-[#C45934] rounded border-gray-300 focus:ring-[#C45934]"
                />
                <span>Supports Personal Customization</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#2A1D1A]">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#C45934] rounded border-gray-300 focus:ring-[#C45934]"
                />
                <span>In Stock & Ready to Order</span>
              </label>
            </div>
          </div>

          {/* Hamper Inclusions Checklist Builder */}
          <div className="pt-4 border-t border-[#E8DED6]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2A1D1A] flex items-center gap-1.5">
                <Gift size={14} className="text-[#C45934]" />
                <span>What's Inside This Hamper / Box ({inclusions.length} items)</span>
              </label>
              <span className="text-[11px] text-[#6E5C56]">
                Displayed on the QuickView checklist
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {inclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#E8DED6] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C45934] text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-[#2A1D1A] font-medium">{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInclusion(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                placeholder="e.g. 18 Stem Dutch Garden Roses, Artisanal Honey Jar, Wax-Sealed Note..."
                className="flex-1 text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
              />
              <button
                type="button"
                onClick={addInclusion}
                className="px-3 py-2 rounded-lg bg-[#2A1D1A] text-white text-xs font-medium hover:bg-[#3E2C27] flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Media & Assets */}
      {activeTab === "media" && (
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 shadow-xs">
          <MediaUploader
            primaryImage={primaryImage}
            onPrimaryImageChange={setPrimaryImage}
            additionalImages={additionalImages}
            onAdditionalImagesChange={setAdditionalImages}
            videoUrl={videoUrl}
            onVideoUrlChange={setVideoUrl}
            downloadableAssets={downloadableAssets}
            onDownloadableAssetsChange={setDownloadableAssets}
            productId={initialProduct?.id}
          />
        </div>
      )}

      {/* Tab 4: Specifications */}
      {activeTab === "specs" && (
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#2A1D1A]">Key-Value Product Specifications</h3>
              <p className="text-xs text-[#6E5C56]">
                Provide technical specifications, dimensions, weight, packaging type or shelf life.
              </p>
            </div>
            <button
              type="button"
              onClick={addSpecification}
              className="px-3 py-1.5 rounded-lg bg-[#C45934] text-white text-xs font-medium hover:bg-[#A74523] flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpecification(idx, e.target.value, spec.value)}
                  placeholder="Attribute (e.g. Dimensions)"
                  className="w-1/3 text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecification(idx, spec.key, e.target.value)}
                  placeholder="Value (e.g. 12 x 8 x 6 inches, 1.8 kg)"
                  className="flex-1 text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(idx)}
                  className="p-2 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: SEO & Tags */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 space-y-5 shadow-xs">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Search Engine Title (Meta Title)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Victorian Garden Rose & Truffle Hamper | SnapCraft Gifts"
              className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Google search summary (150-160 characters recommended)..."
              className="w-full text-xs px-3.5 py-2.5 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
              Keywords & Tags
            </label>
            <p className="text-[11px] text-[#6E5C56] mb-2">
              Type a keyword and press Enter or comma to add.
            </p>
            <div className="flex flex-wrap gap-1.5 p-2 border border-[#D6C7BE] rounded-lg bg-white min-h-[46px] items-center">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-[#FAF7F2] text-[#2A1D1A] border border-[#E8DED6] text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-[#6E5C56] hover:text-rose-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tag..."
                className="flex-1 min-w-[100px] text-xs px-2 py-1 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Preview Modal */}
      {isPreviewOpen && (
        <ProductPreviewModal product={currentProductData} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
}
