import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PlusCircle, Package } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductTable } from "@/components/admin/ProductTable";
import { useAdminProducts } from "@/hooks/use-products";
import { getCategories, DEFAULT_CATEGORIES } from "@/lib/products-service";
import { Category, ProductStatus } from "@/types/admin";

type AdminProductsSearch = {
  status?: string | undefined;
};

export const Route = createFileRoute("/admin/products/")({
  validateSearch: (search: Record<string, unknown>): AdminProductsSearch => {
    const s = typeof search["status"] === "string" ? (search["status"] as string) : undefined;
    return s ? { status: s } : {};
  },
  head: () => ({
    meta: [{ title: "Products Management — SnapCraft Admin" }],
  }),
  component: ProductsManagementPage,
});

function ProductsManagementPage() {
  const { status } = Route.useSearch();
  const { products, isLoading, refresh } = useAdminProducts({
    status: (status as ProductStatus | "all") || "all",
  });
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    getCategories().then((cats) => {
      if (cats.length > 0) setCategories(cats);
    });
  }, []);

  return (
    <AdminLayout
      title="Products Catalogue"
      subtitle="Manage, edit, publish and organize handcrafted creations across your store"
      breadcrumbs={[{ label: "Products" }]}
      actions={
        <Link
          to="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] flex items-center gap-1.5 shadow-sm transition-all"
        >
          <PlusCircle size={15} />
          <span>Add New Product</span>
        </Link>
      }
    >
      <ProductTable
        products={products}
        categories={categories}
        onRefresh={refresh}
        initialStatusFilter={status || "all"}
      />
    </AdminLayout>
  );
}
