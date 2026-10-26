"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

let cached: SupabaseClient | null = null;

/** Cliente de Supabase en el navegador, o null si aún no hay credenciales. */
export function getSupabaseBrowser() {
  if (!isSupabaseConfigured) return null;
  cached ??= createBrowserClient(supabaseUrl, supabaseAnonKey);
  return cached;
}
