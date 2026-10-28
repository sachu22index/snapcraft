import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Settings,
  Database,
  ShieldCheck,
  User,
  Key,
  Copy,
  Check,
  Server,
  RefreshCw,
  ExternalLink,
  Phone,
  MessageCircle,
  Instagram,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PHONE_NUMBER, WHATSAPP_LINK, INSTAGRAM_LINK } from "@/components/Navbar";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [{ title: "Admin Settings — SnapCraft Portal" }],
  }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleEnvConfig = `# Supabase Cloud Credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  return (
    <AdminLayout
      title="System Settings"
      subtitle="Configure administrator accounts, database storage, and storefront integrations"
      breadcrumbs={[{ label: "Settings" }]}
    >
      <div className="max-w-4xl space-y-8">
        {/* Admin Profile Section */}
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1D1A]">
            <User size={16} className="text-[#C45934]" />
            <span>Administrator Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block">Full Name</span>
              <span className="font-semibold text-sm text-[#2A1D1A]">
                {user?.displayName || "Admin User"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block">Email Address</span>
              <span className="font-semibold text-sm text-[#2A1D1A]">{user?.email}</span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block">Assigned Role</span>
              <span className="font-semibold text-sm text-[#C45934] uppercase tracking-wider">
                {user?.role?.replace("_", " ") || "Admin"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block">Account Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Database & Cloud Persistence Status */}
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1D1A]">
              <Database size={16} className="text-[#C45934]" />
              <span>Backend & Database Integration</span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                isSupabaseConfigured
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {isSupabaseConfigured ? "Supabase Cloud Connected" : "Local Workspace Mode"}
            </span>
          </div>

          {isSupabaseConfigured ? (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Cloud PostgreSQL & Storage Connected Successfully</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Your product catalogue, categories, and media uploads are persisting securely into
                your Supabase database with Row Level Security (RLS) policies enabled.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF0E6] border border-[#E8D8C8] space-y-2 text-xs text-[#7A4B29]">
                <div className="flex items-center gap-2 font-bold text-[#C45934]">
                  <Server size={16} />
                  <span>How to connect your Supabase Cloud Database:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  The dashboard is currently running in zero-friction{" "}
                  <strong>Local Workspace Mode</strong>. All products, edits, and file uploads are
                  saved and fully working in browser storage. To synchronize with Supabase Cloud
                  PostgreSQL:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-[11px]">
                  <li>
                    Create a free project at{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold"
                    >
                      supabase.com
                    </a>
                  </li>
                  <li>
                    Run the SQL migration script located in{" "}
                    <code className="bg-white/80 px-1 py-0.5 rounded font-mono">
                      supabase/schema.sql
                    </code>{" "}
                    in your Supabase SQL Editor.
                  </li>
                  <li>
                    Copy your Project URL and Anon Key into{" "}
                    <code className="bg-white/80 px-1 py-0.5 rounded font-mono">.env</code>.
                  </li>
                </ol>
              </div>

              {/* Sample Environment Variables */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#6E5C56]">
                    Environment File Format (.env):
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText("env", sampleEnvConfig)}
                    className="text-[11px] text-[#C45934] font-semibold hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "env" ? <Check size={12} /> : <Copy size={12} />}
                    <span>Copy Config</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-[#2A1D1A] text-[#D3C7BF] text-xs font-mono overflow-x-auto">
                  {sampleEnvConfig}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Storefront Contact & Social Links */}
        <div className="bg-white rounded-xl border border-[#E8DED6] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A1D1A]">
            <Phone size={16} className="text-[#C45934]" />
            <span>Storefront Contact & Social Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block flex items-center gap-1">
                <Phone size={12} className="text-[#C45934]" />
                Customer Phone
              </span>
              <span className="font-semibold text-sm text-[#2A1D1A] mt-1 block">
                {PHONE_NUMBER}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block flex items-center gap-1">
                <MessageCircle size={12} className="text-[#25D366]" />
                WhatsApp Ordering
              </span>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-xs text-[#2A1D1A] hover:text-[#C45934] mt-1 block truncate"
              >
                {PHONE_NUMBER} ↗
              </a>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DED6]">
              <span className="text-[11px] text-[#6E5C56] block flex items-center gap-1">
                <Instagram size={12} className="text-[#E4405F]" />
                Instagram Profile
              </span>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-xs text-[#2A1D1A] hover:text-[#C45934] mt-1 block truncate"
              >
                @snapcraft_official ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
