import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { AdminUser, AdminRole } from "@/types/admin";

const LOCAL_ADMIN_STORAGE_KEY = "snapcraft_admin_session";
const LOCAL_ADMIN_USERS_KEY = "snapcraft_admin_users";

// Default seed admin credentials for local offline development when Supabase is not yet connected
const DEFAULT_LOCAL_ADMIN: AdminUser = {
  id: "local-admin-1",
  email: "admin@snapcraft.in",
  displayName: "SnapCraft Founder",
  role: "super_admin",
  status: "active",
  createdAt: new Date().toISOString(),
};

type AuthChangeCallback = (user: AdminUser | null) => void;
const listeners: Set<AuthChangeCallback> = new Set();

function notifyListeners(user: AdminUser | null) {
  listeners.forEach((cb) => cb(user));
}

// In-memory / cached user
let cachedUser: AdminUser | null = null;
let initialized = false;

export async function initAuth(): Promise<AdminUser | null> {
  if (initialized) return cachedUser;
  initialized = true;

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Verify role in admin_profiles
        const { data: profile, error } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!error && profile && profile.status === "active") {
          cachedUser = {
            id: profile.id,
            email: profile.email,
            displayName: profile.display_name || session.user.email?.split("@")[0],
            avatarUrl: profile.avatar_url,
            role: profile.role as AdminRole,
            status: profile.status,
            createdAt: profile.created_at,
          };
          notifyListeners(cachedUser);
          return cachedUser;
        } else {
          // User authenticated but has no admin role
          await supabase.auth.signOut();
          cachedUser = null;
        }
      }
    } catch (err) {
      console.warn("Failed checking Supabase admin session:", err);
    }
  } else {
    // Check local storage session
    try {
      const saved = localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
      if (saved) {
        cachedUser = JSON.parse(saved);
        notifyListeners(cachedUser);
        return cachedUser;
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  cachedUser = null;
  notifyListeners(null);
  return null;
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw new Error(error.message || "Invalid email or password.");
    }

    if (!data.user) {
      throw new Error("Authentication failed. No user returned.");
    }

    // Verify admin role in admin_profiles table
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw new Error("Access denied: This account does not have administrative privileges.");
    }

    if (profile.status !== "active") {
      await supabase.auth.signOut();
      throw new Error("Account suspended: Please contact your system administrator.");
    }

    const adminUser: AdminUser = {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name || profile.email.split("@")[0],
      avatarUrl: profile.avatar_url,
      role: profile.role,
      status: profile.status,
      createdAt: profile.created_at,
    };

    cachedUser = adminUser;
    notifyListeners(adminUser);
    return adminUser;
  }

  // Local persistent development fallback
  const normalizedEmail = email.trim().toLowerCase();
  const registeredUsersStr = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  const registeredUsers: Array<{ user: AdminUser; passwordHash: string }> = registeredUsersStr
    ? JSON.parse(registeredUsersStr)
    : [
        {
          user: DEFAULT_LOCAL_ADMIN,
          passwordHash: "Admin@1234", // Default bootstrap password for quick local preview
        },
      ];

  const matched = registeredUsers.find(
    (u) => u.user.email.toLowerCase() === normalizedEmail && u.passwordHash === password,
  );

  if (!matched) {
    throw new Error(
      "Invalid admin email or password. (For local preview: admin@snapcraft.in / Admin@1234)",
    );
  }

  if (matched.user.status !== "active") {
    throw new Error("This administrator account has been deactivated.");
  }

  cachedUser = matched.user;
  localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(matched.user));
  notifyListeners(cachedUser);
  return cachedUser;
}

export async function setupInitialAdmin(
  email: string,
  password: string,
  displayName: string,
): Promise<AdminUser> {
  const supabase = getSupabaseClient();
  const normalizedEmail = email.trim().toLowerCase();

  if (supabase && isSupabaseConfigured) {
    // Check if an admin already exists in Supabase
    const { count, error: countErr } = await supabase
      .from("admin_profiles")
      .select("*", { count: "exact", head: true });

    if (!countErr && count && count > 0) {
      throw new Error(
        "Initial setup is closed. An administrator account is already registered. Please login or request an invitation.",
      );
    }

    // Sign up the new user
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (authErr) {
      throw new Error(authErr.message || "Failed to create administrator account.");
    }

    if (!authData.user) {
      throw new Error("User creation failed.");
    }

    // Insert into admin_profiles
    const { error: profileErr } = await supabase.from("admin_profiles").insert({
      id: authData.user.id,
      email: normalizedEmail,
      display_name: displayName.trim(),
      role: "super_admin",
      status: "active",
    });

    if (profileErr) {
      console.error("Profile creation error:", profileErr);
    }

    const adminUser: AdminUser = {
      id: authData.user.id,
      email: normalizedEmail,
      displayName: displayName.trim(),
      role: "super_admin",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    cachedUser = adminUser;
    notifyListeners(adminUser);
    return adminUser;
  }

  // Local fallback setup
  const newUser: AdminUser = {
    id: `local-admin-${Date.now()}`,
    email: normalizedEmail,
    displayName: displayName.trim(),
    role: "super_admin",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  const registeredUsersStr = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  const registeredUsers: Array<{ user: AdminUser; passwordHash: string }> = registeredUsersStr
    ? JSON.parse(registeredUsersStr)
    : [];

  registeredUsers.push({ user: newUser, passwordHash: password });
  localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(registeredUsers));
  localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(newUser));

  cachedUser = newUser;
  notifyListeners(newUser);
  return newUser;
}

export async function logoutAdmin(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signout notice:", err);
    }
  }

  cachedUser = null;
  try {
    localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
  } catch {
    // Ignore
  }
  notifyListeners(null);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/admin/login?reset=true`,
    });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  // Local fallback
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export function getCurrentAdmin(): AdminUser | null {
  return cachedUser;
}

export function subscribeToAuthChanges(callback: AuthChangeCallback): () => void {
  listeners.add(callback);
  // Send immediate status
  callback(cachedUser);

  // Also hook Supabase auth changes if active
  const supabase = getSupabaseClient();
  let unsub: (() => void) | null = null;

  if (supabase && isSupabaseConfigured) {
    const { data: authSubscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        cachedUser = null;
        notifyListeners(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await initAuth();
      }
    });
    unsub = () => authSubscription.subscription.unsubscribe();
  }

  return () => {
    listeners.delete(callback);
    if (unsub) unsub();
  };
}
