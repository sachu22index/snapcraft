import React, { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  Star,
  FileText,
  Video,
  AlertCircle,
  MoveUp,
  MoveDown,
  Check,
  Loader2,
} from "lucide-react";
import { uploadProductMediaFile } from "@/lib/products-service";
import { handleImageError } from "@/lib/image-fallback";

export interface MediaUploaderProps {
  primaryImage: string;
  onPrimaryImageChange: (url: string) => void;
  additionalImages: string[];
  onAdditionalImagesChange: (urls: string[]) => void;
  videoUrl?: string | undefined;
  onVideoUrlChange?: ((url: string) => void) | undefined;
  downloadableAssets?:
    Array<{ name: string; url: string; type: string; size?: string | undefined }> | undefined;
  onDownloadableAssetsChange?:
    | ((
        assets: Array<{ name: string; url: string; type: string; size?: string | undefined }>,
      ) => void)
    | undefined;
  productId?: string | undefined;
}

export function MediaUploader({
  primaryImage,
  onPrimaryImageChange,
  additionalImages,
  onAdditionalImagesChange,
  videoUrl,
  onVideoUrlChange,
  downloadableAssets = [],
  onDownloadableAssetsChange,
  productId,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{ id: string; name: string; progress: number; error?: string }>
  >([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Handle files selection
  const handleFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    let currentPrimary = primaryImage;
    let currentAdditional = [...additionalImages];

    for (const file of fileArray) {
      const uploadId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setUploadingFiles((prev) => [...prev, { id: uploadId, name: file.name, progress: 15 }]);

      try {
        const result = await uploadProductMediaFile(file, {
          ...(productId ? { productId } : {}),
          onProgress: (percent) => {
            setUploadingFiles((prev) =>
              prev.map((item) => (item.id === uploadId ? { ...item, progress: percent } : item)),
            );
          },
        });

        if (result.fileType === "image") {
          if (!currentPrimary) {
            currentPrimary = result.url;
            onPrimaryImageChange(result.url);
          } else if (!currentAdditional.includes(result.url) && result.url !== currentPrimary) {
            currentAdditional = [...currentAdditional, result.url];
            onAdditionalImagesChange(currentAdditional);
          }
        } else if (result.fileType === "video") {
          if (onVideoUrlChange) {
            onVideoUrlChange(result.url);
          }
        } else if (result.fileType === "document") {
          if (onDownloadableAssetsChange) {
            onDownloadableAssetsChange([
              ...downloadableAssets,
              {
                name: result.fileName,
                url: result.url,
                type: "pdf",
                size: `${(result.size / (1024 * 1024)).toFixed(1)} MB`,
              },
            ]);
          }
        }

        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((item) => item.id !== uploadId));
        }, 800);
      } catch (err: unknown) {
        console.error("Upload failed", err);
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploadError(msg);
        setUploadingFiles((prev) =>
          prev.map((item) => (item.id === uploadId ? { ...item, error: msg } : item)),
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const setAsPrimary = (url: string) => {
    if (url === primaryImage) return;
    const filteredAdditional = additionalImages.filter((img) => img !== url);
    const newAdditional = primaryImage ? [primaryImage, ...filteredAdditional] : filteredAdditional;
    onPrimaryImageChange(url);
    onAdditionalImagesChange(newAdditional);
  };

  const removeImage = (url: string) => {
    if (url === primaryImage) {
      if (additionalImages.length > 0) {
        const [nextPrimary, ...rest] = additionalImages;
        onPrimaryImageChange(nextPrimary ?? "");
        onAdditionalImagesChange(rest);
      } else {
        onPrimaryImageChange("");
      }
    } else {
      onAdditionalImagesChange(additionalImages.filter((img) => img !== url));
    }
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= additionalImages.length) return;
    const items = [...additionalImages];
    const moved = items.splice(index, 1)[0];
    if (moved) {
      items.splice(newIndex, 0, moved);
      onAdditionalImagesChange(items);
    }
  };

  const removeDoc = (index: number) => {
    if (!onDownloadableAssetsChange) return;
    onDownloadableAssetsChange(downloadableAssets.filter((_, i) => i !== index));
  };

  const allImages = [
    ...(primaryImage ? [{ url: primaryImage, isPrimary: true }] : []),
    ...additionalImages.filter((u) => u !== primaryImage).map((url) => ({ url, isPrimary: false })),
  ];

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#C45934] bg-[#FDF1ED]"
            : "border-[#D6C7BE] hover:border-[#C45934] bg-[#FFFDF9] hover:bg-[#FAF7F2]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          multiple
          accept="image/*,video/mp4,video/webm,application/pdf"
          className="hidden"
        />

        <div className="w-14 h-14 mx-auto rounded-full bg-[#FDF1ED] text-[#C45934] flex items-center justify-center mb-4 shadow-xs">
          <UploadCloud size={28} />
        </div>

        <h4 className="text-base font-semibold text-[#2A1D1A]">
          Drop product images, videos or documents here
        </h4>
        <p className="text-xs text-[#6E5C56] mt-1 max-w-md mx-auto">
          Drag and drop files, or{" "}
          <span className="text-[#C45934] font-semibold underline">browse</span> from your computer.
          Supports PNG, JPG, WEBP, MP4, and PDF brochures.
        </p>
        <p className="text-[11px] text-[#A5958E] mt-2">
          Images up to 15MB · Videos up to 50MB · PDFs up to 25MB
        </p>
      </div>

      {/* Uploading Progress Indicators */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-[#E8DED6] rounded-lg p-3 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-4">
                {f.progress < 100 ? (
                  <Loader2 size={16} className="text-[#C45934] animate-spin shrink-0" />
                ) : (
                  <Check size={16} className="text-emerald-600 shrink-0" />
                )}
                <span className="truncate font-medium text-[#2A1D1A]">{f.name}</span>
                <span className="text-[#6E5C56] text-[11px] shrink-0">
                  {f.error ? `Error: ${f.error}` : `${f.progress}%`}
                </span>
              </div>
              <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    f.error ? "bg-rose-500" : f.progress === 100 ? "bg-emerald-500" : "bg-[#C45934]"
                  }`}
                  style={{ width: `${f.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Gallery & Order Controls */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6E5C56]">
            Product Image Gallery ({allImages.length})
          </label>
          <span className="text-[11px] text-[#A5958E]">
            Star icon sets primary storefront thumbnail
          </span>
        </div>

        {allImages.length === 0 ? (
          <div className="bg-[#FFFDF9] border border-dashed border-[#D6C7BE] rounded-lg p-6 text-center text-xs text-[#6E5C56]">
            No images uploaded yet. Upload at least one primary image for your product.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allImages.map((img, idx) => (
              <div
                key={img.url}
                className={`relative group rounded-xl overflow-hidden border-2 bg-white shadow-xs transition-all ${
                  img.isPrimary ? "border-[#C45934] ring-2 ring-[#C45934]/20" : "border-[#E8DED6]"
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={img.url}
                    alt={`Product preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>

                {/* Primary Tag */}
                {img.isPrimary && (
                  <div className="absolute top-2 left-2 bg-[#C45934] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={10} className="fill-white" />
                    <span>Primary</span>
                  </div>
                )}

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setAsPrimary(img.url)}
                      title="Set as Primary"
                      className="p-1.5 rounded-full bg-white text-[#C45934] hover:bg-[#FDF1ED] transition-colors shadow-sm"
                    >
                      <Star size={14} />
                    </button>
                  )}

                  {!img.isPrimary &&
                    (() => {
                      const addIdx = additionalImages.indexOf(img.url);
                      return (
                        <>
                          {addIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(addIdx, "up")}
                              title="Move Left"
                              className="p-1.5 rounded-full bg-white text-[#2A1D1A] hover:bg-[#FAF7F2] transition-colors shadow-sm"
                            >
                              <MoveUp size={14} className="-rotate-90" />
                            </button>
                          )}

                          {addIdx !== -1 && addIdx < additionalImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(addIdx, "down")}
                              title="Move Right"
                              className="p-1.5 rounded-full bg-white text-[#2A1D1A] hover:bg-[#FAF7F2] transition-colors shadow-sm"
                            >
                              <MoveDown size={14} className="-rotate-90" />
                            </button>
                          )}
                        </>
                      );
                    })()}

                  <button
                    type="button"
                    onClick={() => removeImage(img.url)}
                    title="Remove Image"
                    className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video & PDF Brochure Attachments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Demonstration Video Field */}
        <div className="bg-[#FFFDF9] border border-[#E8DED6] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#2A1D1A]">
            <Video size={16} className="text-[#C45934]" />
            <span>Product Demonstration Video (Optional)</span>
          </div>
          <p className="text-[11px] text-[#6E5C56] mb-3">
            Enter a YouTube/Vimeo embed URL or upload an MP4/WEBM video file.
          </p>
          <input
            type="text"
            value={videoUrl || ""}
            onChange={(e) => onVideoUrlChange && onVideoUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or upload video above"
            className="w-full text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
          />
        </div>

        {/* Downloadable Brochures & Manuals */}
        <div className="bg-[#FFFDF9] border border-[#E8DED6] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2A1D1A]">
              <FileText size={16} className="text-[#C45934]" />
              <span>Brochures & Spec Sheets ({downloadableAssets.length})</span>
            </div>
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="text-[11px] text-[#C45934] font-semibold hover:underline"
            >
              + Add PDF
            </button>
            <input
              type="file"
              ref={docInputRef}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              accept="application/pdf"
              className="hidden"
            />
          </div>

          {downloadableAssets.length === 0 ? (
            <p className="text-[11px] text-[#A5958E]">
              No documents attached. You can upload product catalogs or care guides.
            </p>
          ) : (
            <div className="space-y-2 mt-2">
              {downloadableAssets.map((doc, idx) => (
                <div
                  key={doc.url || idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E8DED6] text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <FileText size={14} className="text-[#C45934] shrink-0" />
                    <span className="truncate font-medium text-[#2A1D1A]">{doc.name}</span>
                    {doc.size && (
                      <span className="text-[10px] text-[#A5958E] shrink-0">({doc.size})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
