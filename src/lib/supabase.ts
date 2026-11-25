import { createClient, SupabaseClient } from "@supabase/supabase-js";

const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : typeof process !== "undefined" && process.env
      ? process.env
      : {};
const supabaseUrl = env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseAnonKey = (env["VITE_SUPABASE_ANON_KEY"] ||
  env["VITE_SUPABASE_PUBLISHABLE_KEY"]) as string | undefined;

const hasValidUrl = Boolean(
  supabaseUrl &&
    (supabaseUrl.startsWith("https://") || supabaseUrl.startsWith("http://")) &&
    !supabaseUrl.includes("your-project"),
);

const hasValidKey = Boolean(
  supabaseAnonKey &&
    !supabaseAnonKey.includes("your-anon-key") &&
    !supabaseAnonKey.includes("your-publishable-key"),
);

export const isSupabaseConfigured = hasValidUrl && hasValidKey;

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!client) {
    client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}
