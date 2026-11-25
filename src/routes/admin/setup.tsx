import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  KeyRound,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logoImg } from "@/data/products";

export const Route = createFileRoute("/admin/setup")({
  head: () => ({
    meta: [
      { title: "Initial Administrator Setup — SnapCraft Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSetupPage,
});

function AdminSetupPage() {
  const navigate = useNavigate();
  const { setupAdmin, isAuthenticated } = useAdminAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName.trim()) {
      setErrorMessage("Please enter the administrator's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid administrator email address.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long for security.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password and confirmation password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await setupAdmin(email, password, displayName);
      toast.success("Super Administrator setup successful! Welcome to SnapCraft.");
      navigate({ to: "/admin/dashboard" });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to configure administrator account.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <img
            src={logoImg}
            alt="SnapCraft"
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C45934] shadow-md"
          />
        </Link>
        <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#2A1D1A]">
          Initial Admin Setup
        </h2>
        <p className="mt-1 text-xs text-[#6E5C56]">
          Configure the primary Super Administrator account for SnapCraft
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-[#E8DED6]">
          {/* Security Notice */}
          <div className="mb-6 p-3 bg-[#FAF0E6] rounded-xl border border-[#E8D8C8] text-xs text-[#7A4B29] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <KeyRound size={14} className="text-[#C45934]" />
              <span>One-Time System Initialization</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              This setup creates the primary Super Administrator with full privileges. Subsequent
              registrations are restricted and invitation-only to prevent unauthorized access.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-[#A5958E]" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Maya Nair"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-[#A5958E]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@snapcraft.in"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Master Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#A5958E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full text-xs pl-9 pr-10 py-2.5 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#A5958E] hover:text-[#2A1D1A]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#A5958E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat master password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>
                {isLoading ? "Provisioning Admin..." : "Complete Setup & Launch Dashboard"}
              </span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E8DED6] text-center">
            <Link to="/admin/login" className="text-xs text-[#6E5C56] hover:text-[#C45934]">
              Already configured? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
