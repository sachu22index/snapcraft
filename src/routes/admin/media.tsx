import React, { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Check,
  Film,
  FileText,
  Filter,
  Sparkles,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAllMedia, uploadProductMediaFile } from "@/lib/products-service";
import { ProductMediaItem } from "@/types/admin";
import { useAdminProducts } from "@/hooks/use-products";
import { handleImageError } from "@/lib/image-fallback";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [{ title: "Media Library — SnapCraft Admin" }],
  }),
  component: MediaLibraryPage,
});

function MediaLibraryPage() {
  const { products } = useAdminProducts();
  const [mediaItems, setMediaItems] = useState<ProductMediaItem[]>([]);
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "document">("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collect all media from products + upload storage
  const loadMedia = React.useCallback(async () => {
    const directMedia = await getAllMedia();
    const productMedia: ProductMediaItem[] = [];

    products.forEach((p) => {
      if (p.primaryImageUrl) {
        productMedia.push({
          id: `prod-prim-${p.id}`,
          productId: p.id,
          fileUrl: p.primaryImageUrl,
          fileType: "image",
          altText: p.name,
          displayOrder: 0,
          isPrimary: true,
        });
      }
      p.additionalImages.forEach((img, idx) => {
        if (img !== p.primaryImageUrl) {
          productMedia.push({
            id: `prod-add-${p.id}-${idx}`,
            productId: p.id,
            fileUrl: img,
            fileType: "image",
            altText: `${p.name} gallery ${idx + 1}`,
            displayOrder: idx + 1,
            isPrimary: false,
          });
        }
      });
      if (p.videoUrl) {
        productMedia.push({
          id: `prod-vid-${p.id}`,
          productId: p.id,
          fileUrl: p.videoUrl,
          fileType: "video",
          altText: `${p.name} demonstration video`,
          displayOrder: 99,
          isPrimary: false,
        });
      }
      p.downloadableAssets.forEach((doc, idx) => {
        productMedia.push({
          id: `prod-doc-${p.id}-${idx}`,
          productId: p.id,
          fileUrl: doc.url,
          fileType: "document",
          altText: doc.name,
          displayOrder: idx,
          isPrimary: false,
        });
      });
    });

    // Merge by unique fileUrl
    const urlMap = new Map<string, ProductMediaItem>();
    [...directMedia, ...productMedia].forEach((m) => {
      if (!urlMap.has(m.fileUrl)) {
        urlMap.set(m.fileUrl, m);
      }
    });

    setMediaItems(Array.from(urlMap.values()));
  }, [products]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        await uploadProductMediaFile(file);
      }
      toast.success("Assets uploaded to storage successfully!");
      await loadMedia();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to upload asset.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Public asset URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredMedia = mediaItems.filter((item) => {
    if (filterType === "all") return true;
    return item.fileType === filterType;
  });

  return (
    <AdminLayout
      title="Media Library"
      subtitle="Persistent object storage for product photography, videos, and brochures"
      breadcrumbs={[{ label: "Media Library" }]}
      actions={
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,video/mp4,video/webm,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <UploadCloud size={15} />
            <span>{isUploading ? "Uploading..." : "Upload Assets"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-[#E8DED6] pb-3">
          <div className="flex gap-2">
            {[
              { id: "all", label: `All Files (${mediaItems.length})` },
              {
                id: "image",
                label: `Images (${mediaItems.filter((m) => m.fileType === "image").length})`,
              },
              {
                id: "video",
                label: `Videos (${mediaItems.filter((m) => m.fileType === "video").length})`,
              },
              {
                id: "document",
                label: `Documents (${mediaItems.filter((m) => m.fileType === "document").length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as "all" | "image" | "video" | "document")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === tab.id
                    ? "bg-[#2A1D1A] text-white font-bold"
                    : "bg-white text-[#6E5C56] border border-[#E8DED6] hover:bg-[#FAF7F2]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#6E5C56]">Click any asset to copy its direct URL</span>
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#D6C7BE] p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF7F2] text-[#C45934] flex items-center justify-center">
              <ImageIcon size={24} />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2A1D1A]">No media found</h4>
            <p className="text-xs text-[#6E5C56] mt-1 max-w-sm mx-auto">
              Upload images, videos or PDF brochures to populate your digital asset library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-[#E8DED6] overflow-hidden group shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Media Preview Box */}
                <div className="aspect-square bg-[#FAF7F2] relative overflow-hidden flex items-center justify-center">
                  {m.fileType === "image" ? (
                    <img
                      src={m.fileUrl}
                      alt={m.altText || "Product asset"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  ) : m.fileType === "video" ? (
                    <div className="text-center p-4 text-[#C45934]">
                      <Film size={32} className="mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider block">
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-rose-600">
                      <FileText size={32} className="mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider block">
                        PDF Doc
                      </span>
                    </div>
                  )}

                  {/* Copy URL Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(m.fileUrl)}
                      className="px-2.5 py-1.5 rounded-lg bg-white text-[#2A1D1A] text-xs font-semibold hover:bg-[#FAF7F2] flex items-center gap-1 shadow-sm"
                    >
                      {copiedUrl === m.fileUrl ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white text-[#2A1D1A] hover:bg-[#FAF7F2]"
                      title="Open full size"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 text-[11px] border-t border-[#E8DED6] bg-white">
                  <span className="font-semibold text-[#2A1D1A] truncate block">
                    {m.altText || "Asset"}
                  </span>
                  <div className="flex items-center justify-between text-[#A5958E] text-[10px] mt-0.5">
                    <span className="capitalize">{m.fileType}</span>
                    {m.isPrimary && <span className="text-[#C45934] font-semibold">Primary</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
