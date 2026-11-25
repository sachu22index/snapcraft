import React, { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Image as ImageIcon,
  CheckCircle2,
  FileEdit,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Database,
  ShieldCheck,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logoImg } from "@/data/products";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export function AdminLayout({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchStr = typeof window !== "undefined" ? window.location.search : "";

  const navItems = [
    {
      label: "Dashboard Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard" || pathname === "/admin",
    },
    {
      label: "All Products",
      href: "/admin/products",
      icon: Package,
      active: pathname === "/admin/products" && !searchStr.includes("status="),
    },
    {
      label: "Add New Product",
      href: "/admin/products/new",
      icon: PlusCircle,
      active: pathname === "/admin/products/new",
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      active: pathname === "/admin/categories",
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: ImageIcon,
      active: pathname === "/admin/media",
    },
    {
      label: "Published Products",
      href: "/admin/products?status=published",
      icon: CheckCircle2,
      active: pathname === "/admin/products" && searchStr.includes("status=published"),
    },
    {
      label: "Draft Products",
      href: "/admin/products?status=draft",
      icon: FileEdit,
      active: pathname === "/admin/products" && searchStr.includes("status=draft"),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname === "/admin/settings",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#C45934] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#6E5C56]">Verifying SnapCraft Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <p className="text-sm text-[#6E5C56]">Redirecting to admin login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out of the Admin Dashboard?")) {
      await logout();
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#342825] flex flex-col antialiased">
      {/* Top Banner for Supabase Connectivity State */}
      {!isSupabaseConfigured && (
        <div className="bg-[#FAF0E6] border-b border-[#E8D8C8] px-4 py-2 text-xs flex flex-wrap items-center justify-between text-[#7A4B29] gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Local Database Active:</span>
            <span>
              All your products, edits and asset uploads persist locally. Connect your Supabase
              project in Settings for cloud database sync.
            </span>
          </div>
          <Link
            to="/admin/settings"
            className="font-medium underline hover:text-[#C45934] flex items-center gap-1"
          >
            <span>Supabase Setup Guide</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#2A1D1A] text-[#FAF7F2] flex-col justify-between shrink-0 border-r border-[#3E2C27] shadow-xl">
          <div>
            {/* Brand Header */}
            <div className="p-5 border-b border-[#3E2C27] flex items-center justify-between">
              <Link to="/admin/dashboard" className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="SnapCraft"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C45934]"
                />
                <div>
                  <span className="font-serif text-lg font-bold tracking-tight text-[#FAF7F2] block">
                    SnapCraft
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-medium text-[#C79E75] block">
                    Admin Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Admin User Info Pill */}
            <div className="px-4 py-3 mx-3 my-3 bg-[#382723] rounded-lg border border-[#48332E] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C45934] text-white flex items-center justify-center font-bold text-xs uppercase">
                {user?.displayName ? user.displayName.charAt(0) : "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.displayName || "Admin User"}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#C79E75]">
                  <ShieldCheck size={11} className="text-[#C45934]" />
                  <span className="capitalize">{user?.role?.replace("_", " ") || "Admin"}</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="px-3 py-2 space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#9E8B84]">
                Menu
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      item.active
                        ? "bg-[#C45934] text-white font-semibold shadow-sm"
                        : "text-[#D3C7BF] hover:bg-[#382723] hover:text-white"
                    }`}
                  >
                    <Icon size={16} className={item.active ? "text-white" : "text-[#C79E75]"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[#3E2C27] space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-[#C79E75] hover:bg-[#382723] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={14} />
                <span>View Public Website</span>
              </span>
              <ChevronRight size={12} />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header & Sidebar Sheet */}
        <div className="lg:hidden flex flex-col w-full">
          <header className="bg-[#2A1D1A] text-white px-4 py-3 flex items-center justify-between border-b border-[#3E2C27]">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="SnapCraft"
                className="w-8 h-8 rounded-full border border-[#C45934]"
              />
              <span className="font-serif font-bold text-base">SnapCraft Admin</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FAF7F2] hover:bg-[#382723] rounded-md"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </header>

          {mobileMenuOpen && (
            <div className="bg-[#2A1D1A] text-white border-b border-[#3E2C27] px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      item.active ? "bg-[#C45934] text-white" : "text-[#D3C7BF] hover:bg-[#382723]"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-[#3E2C27] flex items-center justify-between">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#C79E75] flex items-center gap-1"
                >
                  <ExternalLink size={13} />
                  <span>Public Store</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-300 flex items-center gap-1"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar */}
          <div className="bg-[#FFFDF9] border-b border-[#EFE8DF] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-10 shadow-xs">
            <div>
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1 text-[11px] text-[#6E5C56] mb-1">
                  <Link to="/admin/dashboard" className="hover:text-[#C45934]">
                    Dashboard
                  </Link>
                  {breadcrumbs.map((b, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight size={10} className="text-[#A5958E]" />
                      {b.href ? (
                        <Link to={b.href} className="hover:text-[#C45934]">
                          {b.label}
                        </Link>
                      ) : (
                        <span className="font-semibold text-[#2A1D1A]">{b.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
              <h1 className="font-serif text-2xl font-bold text-[#2A1D1A]">{title}</h1>
              {subtitle && <p className="text-xs text-[#6E5C56] mt-0.5">{subtitle}</p>}
            </div>

            {/* Actions / Primary CTA */}
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>

          {/* Page Body */}
          <div className="p-6 md:p-8 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
