import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Portal — SnapCraft" }],
  }),
  component: AdminIndexPage,
});

function AdminIndexPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/admin/login" });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C45934] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#6E5C56]">Loading SnapCraft Admin...</p>
      </div>
    </div>
  );
}
