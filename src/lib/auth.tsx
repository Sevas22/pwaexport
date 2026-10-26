"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useAppStore, useHydrated } from "@/lib/store";

// Cuentas de usuario. Con credenciales de Supabase son cuentas reales;
// sin ellas el registro funciona igual, pero la cuenta vive en este dispositivo
// (modo demostración), para poder mostrar el flujo completo.

export interface AppUser {
  id: string;
  email: string;
  company: string;
  contactName: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  company: string;
  contactName: string;
}

interface AuthValue {
  user: AppUser | null;
  loading: boolean;
  mode: "supabase" | "demo";
  /** true cuando Supabase pide confirmar el correo antes de iniciar sesión. */
  pendingConfirmation: boolean;
  signUp: (input: SignUpInput) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

const toAppUser = (user: User | null): AppUser | null =>
  user
    ? {
        id: user.id,
        email: user.email ?? "",
        company: String(user.user_metadata?.company ?? ""),
        contactName: String(user.user_metadata?.contact_name ?? ""),
      }
    : null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mode: AuthValue["mode"] = isSupabaseConfigured ? "supabase" : "demo";
  const hydrated = useHydrated();
  const demoAccount = useAppStore((state) => state.account);
  const setAccount = useAppStore((state) => state.setAccount);
  const [remoteUser, setRemoteUser] = useState<AppUser | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(isSupabaseConfigured);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setRemoteUser(toAppUser(data.user));
      setRemoteLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setRemoteUser(toAppUser(session?.user ?? null));
      setRemoteLoading(false);
      if (session?.user) setPendingConfirmation(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback<AuthValue["signUp"]>(
    async ({ email, password, company, contactName }) => {
      const supabase = getSupabaseBrowser();

      if (!supabase) {
        setAccount({ id: `demo-${Date.now().toString(36)}`, email, company, contactName });
        return {};
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { company, contact_name: contactName } },
      });
      if (error) return { error: error.message };

      if (!data.session) {
        setPendingConfirmation(true);
        return { needsConfirmation: true };
      }
      return {};
    },
    [setAccount],
  );

  const signIn = useCallback<AuthValue["signIn"]>(
    async (email, password) => {
      const supabase = getSupabaseBrowser();

      if (!supabase) {
        const stored = useAppStore.getState().account;
        if (!stored || stored.email !== email) {
          return { error: "No encontramos una cuenta con ese correo en este dispositivo." };
        }
        setAccount(stored);
        return {};
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    [setAccount],
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    else setAccount(null);
  }, [setAccount]);

  const value = useMemo<AuthValue>(
    () => ({
      user: mode === "supabase" ? remoteUser : hydrated ? demoAccount : null,
      loading: mode === "supabase" ? remoteLoading : !hydrated,
      mode,
      pendingConfirmation,
      signUp,
      signIn,
      signOut,
    }),
    [mode, remoteUser, remoteLoading, hydrated, demoAccount, pendingConfirmation, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
