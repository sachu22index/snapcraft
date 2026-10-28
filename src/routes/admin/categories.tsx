import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolderTree, Plus, Trash2, Sparkles, Package, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminProducts } from "@/hooks/use-products";
import {
  getCategories,
  createCategory,
  deleteCategory,
  DEFAULT_CATEGORIES,
} from "@/lib/products-service";
import { Category } from "@/types/admin";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Categories — SnapCraft Admin" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { products } = useAdminProducts();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // New Category Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const list = await getCategories();
      setCategories(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsAdding(true);
    try {
      await createCategory({
        id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        description: description.trim(),
      });
      toast.success(`Category "${name}" created successfully!`);
      setName("");
      setDescription("");
      await loadCategories();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const assignedProducts = products.filter((p) => p.categoryId === category.id);
    if (assignedProducts.length > 0) {
      toast.error(
        `Cannot delete "${category.name}" because ${assignedProducts.length} product(s) are currently assigned to it.`,
      );
      return;
    }

    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        toast.success(`Category "${category.name}" deleted.`);
        await loadCategories();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to delete category.");
      }
    }
  };

  return (
    <AdminLayout
      title="Category Management"
      subtitle="Organize your creations into collections for the public storefront"
      breadcrumbs={[{ label: "Categories" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[#E8DED6] overflow-hidden shadow-xs">
            <div className="p-4 bg-[#FAF7F2] border-b border-[#E8DED6] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E5C56]">
                Active Categories ({categories.length})
              </span>
              <span className="text-[11px] text-[#A5958E]">
                Used in storefront filter tabs & menus
              </span>
            </div>

            <div className="divide-y divide-[#E8DED6]">
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#FFFDF9] transition-colors text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8DED6] text-[#C45934] flex items-center justify-center shrink-0 mt-0.5">
                        <FolderTree size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#2A1D1A]">
                            {cat.name}
                          </h4>
                          <span className="font-mono text-[10px] text-[#A5958E] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8DED6]">
                            id: {cat.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E5C56] mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-bold text-[#2A1D1A] block">{count}</span>
                        <span className="text-[10px] text-[#A5958E] block">products</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        title="Delete category"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Add New Category Form */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E8DED6] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1D1A]">
              <Plus size={16} className="text-[#C45934]" />
              <span>Create New Category</span>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wedding & Bridal Garlands"
                  className="w-full text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description displayed on storefront section headers..."
                  className="w-full text-xs px-3 py-2 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C45934]"
                />
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className="w-full py-2.5 px-4 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] disabled:opacity-50 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>{isAdding ? "Adding..." : "Add Category"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
