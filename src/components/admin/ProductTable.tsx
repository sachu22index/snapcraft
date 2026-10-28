import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Archive,
  Send,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { AdminProduct, Category, ProductStatus } from "@/types/admin";
import { setProductStatus, deleteProduct } from "@/lib/products-service";
import { handleImageError } from "@/lib/image-fallback";
import { ProductPreviewModal } from "./ProductPreviewModal";

interface ProductTableProps {
  products: AdminProduct[];
  categories: Category[];
  onRefresh: () => void;
  initialStatusFilter?: string;
}

export function ProductTable({
  products,
  categories,
  onRefresh,
  initialStatusFilter = "all",
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-asc" | "price-desc" | "name">(
    "newest",
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Selected item for preview or delete confirmation
  const [previewProduct, setPreviewProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.categoryId === categoryFilter);
    }

    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q),
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, statusFilter, categoryFilter, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  // Actions
  const handleStatusChange = async (product: AdminProduct, newStatus: ProductStatus) => {
    try {
      await setProductStatus(product.id, newStatus);
      toast.success(
        newStatus === "published"
          ? `"${product.name}" is now live on the public website!`
          : newStatus === "archived"
            ? `"${product.name}" has been archived.`
            : `"${product.name}" set to draft.`,
      );
      onRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update product status.");
    }
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      toast.success(`"${deletingProduct.name}" deleted successfully.`);
      setDeletingProduct(null);
      onRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Filters, Sorters */}
      <div className="bg-white rounded-xl border border-[#E8DED6] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-[#A5958E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name, SKU or keyword..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white text-[#2A1D1A] focus:outline-none focus:ring-1 focus:ring-[#C45934]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white text-[#2A1D1A] focus:outline-none focus:ring-1 focus:ring-[#C45934]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(
                e.target.value as "newest" | "oldest" | "price-asc" | "price-desc" | "name",
              );
              setPage(1);
            }}
            className="text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-white text-[#2A1D1A] focus:outline-none focus:ring-1 focus:ring-[#C45934]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <Link
            to="/admin/products/new"
            className="px-3.5 py-2 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] flex items-center gap-1.5 shadow-2xs"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Product Table Card */}
      <div className="bg-white rounded-xl border border-[#E8DED6] overflow-hidden shadow-xs">
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FDF1ED] text-[#C45934] flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2A1D1A]">No products found</h3>
            <p className="text-xs text-[#6E5C56] mt-1 max-w-sm mx-auto">
              {search || statusFilter !== "all" || categoryFilter !== "all"
                ? "No products match your current search and filter settings. Try resetting your filters."
                : "Your catalogue has no products yet. Add your first handcrafted gift creation to display it on the website."}
            </p>
            <div className="mt-4">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523]"
              >
                <Plus size={14} />
                <span>Create New Product</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DED6] text-[11px] font-bold uppercase tracking-wider text-[#6E5C56]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED6] text-xs">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFFDF9] transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primaryImageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F2] border border-[#E8DED6] shrink-0"
                          onError={handleImageError}
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-semibold text-[#2A1D1A] block truncate hover:text-[#C45934]">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-[#6E5C56] truncate block">
                            {p.tagline || p.shortDescription}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#6E5C56]">{p.sku}</td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#2A1D1A] text-[11px] font-medium border border-[#E8DED6]">
                        {p.categoryLabel}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-semibold text-[#2A1D1A]">
                      <div>
                        <span>₹{p.price.toLocaleString("en-IN")}</span>
                        {p.salePrice && (
                          <span className="text-[10px] text-[#A5958E] line-through block font-normal">
                            ₹{p.salePrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">{getStatusBadge(p.status)}</td>

                    {/* Last Updated */}
                    <td className="py-3 px-3 text-[#6E5C56] text-[11px]">
                      {new Date(p.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Live Preview Button */}
                        <button
                          type="button"
                          onClick={() => setPreviewProduct(p)}
                          title="Live Preview"
                          className="p-1.5 rounded-md text-[#6E5C56] hover:text-[#C45934] hover:bg-[#FDF1ED] transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit Button */}
                        <Link
                          to={`/admin/products/$id/edit`}
                          params={{ id: p.id }}
                          title="Edit Product"
                          className="p-1.5 rounded-md text-[#6E5C56] hover:text-[#C45934] hover:bg-[#FDF1ED] transition-colors"
                        >
                          <Edit size={15} />
                        </Link>

                        {/* Toggle Status (Publish / Unpublish) */}
                        {p.status === "published" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(p, "draft")}
                            title="Unpublish (move to draft)"
                            className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Archive size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(p, "published")}
                            title="Publish immediately to public store"
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Send size={15} />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(p)}
                          title="Delete Product"
                          className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredProducts.length > pageSize && (
          <div className="px-4 py-3 border-t border-[#E8DED6] bg-[#FAF7F2] flex items-center justify-between text-xs text-[#6E5C56]">
            <div>
              Showing{" "}
              <span className="font-semibold text-[#2A1D1A]">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-semibold text-[#2A1D1A]">
                {Math.min(page * pageSize, filteredProducts.length)}
              </span>{" "}
              of <span className="font-semibold text-[#2A1D1A]">{filteredProducts.length}</span>{" "}
              products
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md border border-[#D6C7BE] bg-white text-[#2A1D1A] disabled:opacity-40 hover:bg-[#FAF7F2]"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md border border-[#D6C7BE] bg-white text-[#2A1D1A] disabled:opacity-40 hover:bg-[#FAF7F2]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeletingProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#D6C7BE] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2A1D1A]">Delete Product</h3>
            </div>

            <p className="text-xs text-[#6E5C56]">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#2A1D1A]">"{deletingProduct.name}"</strong>? It will
              immediately disappear from the public website, search results, and category
              collections.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-lg border border-[#D6C7BE] text-xs font-semibold text-[#2A1D1A] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-2xs"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewProduct && (
        <ProductPreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
      )}
    </div>
  );
}
