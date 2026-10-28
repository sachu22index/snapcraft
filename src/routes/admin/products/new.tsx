import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({
    meta: [{ title: "Add New Product — SnapCraft Admin" }],
  }),
  component: AddProductPage,
});

function AddProductPage() {
  return (
    <AdminLayout
      title="Add New Creation"
      subtitle="Register a new hamper, bouquet, or keepsake with rich media and specifications"
      breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Add New" }]}
    >
      <ProductForm isEdit={false} />
    </AdminLayout>
  );
}
