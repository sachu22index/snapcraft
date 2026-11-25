import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logoImg } from "@/data/products";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — SnapCraft Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, resetPassword, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! Admin authentication successful.");
      navigate({ to: "/admin/dashboard" });
    } catch (err: unknown) {
      console.error("Login failed:", err);
      const msg =
        err instanceof Error ? err.message : "Invalid credentials or unauthorized account.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your admin email address to receive reset instructions.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await resetPassword(email);
      setResetSent(true);
      toast.success("Password reset instructions dispatched!");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to initiate password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Accents */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <img
            src={logoImg}
            alt="SnapCraft"
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C45934] shadow-md group-hover:scale-105 transition-transform"
          />
        </Link>
        <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#2A1D1A]">
          SnapCraft Admin Portal
        </h2>
        <p className="mt-1 text-xs text-[#6E5C56]">
          Secure content management & catalogue administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-[#E8DED6]">
          {/* Status Indicator */}
          <div className="mb-6 flex items-center justify-between text-xs pb-3 border-b border-[#E8DED6]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#C45934]" />
              <span className="font-semibold text-[#2A1D1A]">Restricted Access</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSupabaseConfigured
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {isSupabaseConfigured ? "Supabase Cloud" : "Local Workspace"}
            </span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {isForgotPassword ? (
            <div>
              {resetSent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2A1D1A]">Check Your Inbox</h3>
                  <p className="text-xs text-[#6E5C56]">
                    If an administrator account exists for <strong>{email}</strong>, a secure
                    password reset link has been sent.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                    }}
                    className="text-xs text-[#C45934] font-semibold hover:underline block mx-auto pt-2"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                      Administrator Email
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Dispatching Reset Link..." : "Send Password Reset Link"}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs text-[#6E5C56] hover:text-[#2A1D1A]"
                    >
                      Cancel and return to sign in
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D1A] mb-1">
                  Admin Email Address
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#2A1D1A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-[#C45934] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-[#A5958E]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs pl-9 pr-10 py-2.5 border border-[#D6C7BE] rounded-lg bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C45934]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#A5958E] hover:text-[#2A1D1A]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#C45934] text-white text-xs font-semibold hover:bg-[#A74523] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? "Verifying..." : "Sign In to Admin Dashboard"}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* First Time Admin Setup Link */}
          <div className="mt-6 pt-5 border-t border-[#E8DED6] text-center space-y-2">
            <p className="text-xs text-[#6E5C56]">Setting up this portal for the first time?</p>
            <Link
              to="/admin/setup"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2A1D1A] hover:text-[#C45934]"
            >
              <KeyRound size={13} className="text-[#C45934]" />
              <span>Initial Administrator Setup Wizard</span>
            </Link>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-medium text-[#6E5C56] hover:text-[#2A1D1A] flex items-center justify-center gap-1.5"
          >
            <span>← Return to Public Storefront</span>
          </a>
        </div>
      </div>
    </div>
  );
}
