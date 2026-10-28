import React, { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  CheckCircle2,
  FileEdit,
  FolderTree,
  PlusCircle,
  TrendingUp,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Eye,
  Edit,
  ShieldAlert,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminProducts } from "@/hooks/use-products";
import { getCategories, DEFAULT_CATEGORIES } from "@/lib/products-service";
import { handleImageError } from "@/lib/image-fallback";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard Overview — SnapCraft Admin" }],
  }),
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { products, isLoading, refresh } = useAdminProducts();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });
  }, []);

  // Metrics
  const totalProducts = products.length;
  const publishedProducts = useMemo(
    () => products.filter((p) => p.status === "published"),
    [products],
  );
  const draftProducts = useMemo(() => products.filter((p) => p.status === "draft"), [products]);
  const totalCategories = categories.length;

  // Recently added (sorted by createdAt)
  const recentlyAdded = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [products]);

  // Recently updated (sorted by updatedAt)
  const recentlyUpdated = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [products]);

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Welcome back to SnapCraft store administration and catalogue analytics"
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
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <div className="bg-white rounded-xl border border-[#E8DED6] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C56]">
                Total Products
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#2A1D1A] mt-1">
                {isLoading ? "..." : totalProducts}
              </h3>
              <p className="text-[11px] text-[#A5958E] mt-0.5">In catalog</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8DED6] text-[#C45934] flex items-center justify-center">
              <Package size={22} />
            </div>
          </div>

          {/* Published Products */}
          <div className="bg-white rounded-xl border border-[#E8DED6] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C56]">
                Published Live
              </p>
              <h3 className="font-serif text-3xl font-bold text-emerald-700 mt-1">
                {isLoading ? "..." : publishedProducts.length}
              </h3>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                Visible to customers
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>

          {/* Draft Products */}
          <div className="bg-white rounded-xl border border-[#E8DED6] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C56]">
                Draft Products
              </p>
              <h3 className="font-serif text-3xl font-bold text-amber-700 mt-1">
                {isLoading ? "..." : draftProducts.length}
              </h3>
              <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Hidden from website</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <FileEdit size={22} />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl border border-[#E8DED6] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C56]">
                Categories
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#2A1D1A] mt-1">
                {totalCategories}
              </h3>
              <p className="text-[11px] text-[#A5958E] mt-0.5">Active collections</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EDF3EB] border border-[#D5E4D2] text-[#2E4624] flex items-center justify-center">
              <FolderTree size={22} />
            </div>
          </div>
        </div>

        {/* Quick Launchpad Action Cards */}
        <div className="bg-gradient-to-r from-[#2A1D1A] to-[#3E2C27] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C79E75]">
              <Sparkles size={14} />
              <span>Real-Time Storefront Synchronization</span>
            </div>
            <h3 className="font-serif text-xl font-bold">
              Want to showcase a new celebration hamper?
            </h3>
            <p className="text-xs text-[#D3C7BF] max-w-xl">
              Add photos, set pricing, write inclusions and publish directly to the live website.
              Your changes appear immediately without rebuilding or editing code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/products/new"
              className="px-4 py-2.5 rounded-lg bg-[#C45934] text-white text-xs font-bold hover:bg-[#A74523] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle size={15} />
              <span>Add New Product</span>
            </Link>
            <a
              href="/hampers"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>View Public Catalogue</span>
            </a>
          </div>
        </div>

        {/* Two-Column Split: Recently Added vs Recently Updated */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Added */}
          <div className="bg-white rounded-xl border border-[#E8DED6] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E8DED6] flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2A1D1A]">
                  Recently Added Products
                </h4>
                <p className="text-[11px] text-[#6E5C56]">Latest additions to the catalogue</p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs text-[#C45934] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-[#E8DED6]">
              {recentlyAdded.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.primaryImageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2] border border-[#E8DED6] shrink-0"
                      onError={handleImageError}
                    />
                    <div className="min-w-0">
                      <h5 className="font-semibold text-[#2A1D1A] truncate">{product.name}</h5>
                      <div className="flex items-center gap-2 text-[10px] text-[#6E5C56] mt-0.5">
                        <span>{product.categoryLabel}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#2A1D1A]">₹{product.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        product.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.status}
                    </span>
                    <Link
                      to={`/admin/products/$id/edit`}
                      params={{ id: product.id }}
                      className="p-1 text-[#6E5C56] hover:text-[#C45934]"
                    >
                      <Edit size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Updated */}
          <div className="bg-white rounded-xl border border-[#E8DED6] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E8DED6] flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2A1D1A]">
                  Recently Updated Products
                </h4>
                <p className="text-[11px] text-[#6E5C56]">Items modified or published recently</p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs text-[#C45934] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Manage Products</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-[#E8DED6]">
              {recentlyUpdated.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.primaryImageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2] border border-[#E8DED6] shrink-0"
                      onError={handleImageError}
                    />
                    <div className="min-w-0">
                      <h5 className="font-semibold text-[#2A1D1A] truncate">{product.name}</h5>
                      <div className="flex items-center gap-2 text-[10px] text-[#6E5C56] mt-0.5">
                        <Clock size={11} className="text-[#A5958E]" />
                        <span>
                          {new Date(product.updatedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        product.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.status}
                    </span>
                    <Link
                      to={`/admin/products/$id/edit`}
                      params={{ id: product.id }}
                      className="p-1 text-[#6E5C56] hover:text-[#C45934]"
                    >
                      <Edit size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
