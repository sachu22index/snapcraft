import { useState, useEffect, useCallback } from "react";
import { AdminUser } from "@/types/admin";
import {
  initAuth,
  loginAdmin,
  logoutAdmin,
  setupInitialAdmin as apiSetupAdmin,
  requestPasswordReset as apiResetPassword,
  subscribeToAuthChanges,
} from "@/lib/auth-service";

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    initAuth().then((u) => {
      if (mounted) {
        setUser(u);
        setIsLoading(false);
      }
    });

    const unsubscribe = subscribeToAuthChanges((u) => {
      if (mounted) {
        setUser(u);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    const loggedIn = await loginAdmin(email, pass);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setUser(null);
  }, []);

  const setupAdmin = useCallback(async (email: string, pass: string, name: string) => {
    const created = await apiSetupAdmin(email, pass, name);
    setUser(created);
    return created;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await apiResetPassword(email);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user && user.status === "active"),
    isAdmin: Boolean(user && (user.role === "admin" || user.role === "super_admin")),
    isLoading,
    login,
    logout,
    setupAdmin,
    resetPassword,
  };
}
