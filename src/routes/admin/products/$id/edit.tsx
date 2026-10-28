import React, { useEffect, useState } from "react";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products-service";
import { AdminProduct } from "@/types/admin";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: () => ({
    meta: [{ title: "Edit Product — SnapCraft Admin" }],
  }),
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getProductById(id)
      .then((p) => {
        if (p) {
          setProduct(p);
        } else {
          setError(`Product with reference "${id}" could not be located.`);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout
        title="Loading Product..."
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]}
      >
        <div className="py-20 text-center">
          <Loader2 size={32} className="animate-spin text-[#C45934] mx-auto mb-3" />
          <p className="text-xs text-[#6E5C56]">Loading product information...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout
        title="Product Not Found"
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]}
      >
        <div className="bg-white rounded-xl border border-[#E8DED6] p-8 text-center max-w-md mx-auto">
          <p className="text-sm font-semibold text-[#2A1D1A] mb-2">
            {error || "Product not found"}
          </p>
          <p className="text-xs text-[#6E5C56] mb-4">
            The product you are trying to edit may have been removed or renamed.
          </p>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C45934] text-white text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Return to Products List</span>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit: ${product.name}`}
      subtitle={`SKU: ${product.sku} · Status: ${product.status}`}
      breadcrumbs={[
        { label: "Products", href: "/admin/products" },
        { label: product.name },
        { label: "Edit" },
      ]}
    >
      <ProductForm key={product.id} initialProduct={product} isEdit={true} />
    </AdminLayout>
  );
}
