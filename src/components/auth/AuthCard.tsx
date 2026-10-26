"use client";

import { useState } from "react";
import { Check, Loader, LockKeyhole, Mail } from "lucide-react";
import { Field, Input, buttonStyles, cn } from "@/components/ui";
import { useAuth } from "@/lib/auth";

type Tab = "registro" | "ingreso";

/** Formulario de cuenta: registro e inicio de sesión. */
export function AuthCard({
  title = "Crea tu cuenta",
  description,
  benefits,
  onAuthenticated,
  className,
}: {
  title?: string;
  description?: string;
  benefits?: string[];
  onAuthenticated?: () => void;
  className?: string;
}) {
  const { signUp, signIn, mode } = useAuth();
  const [tab, setTab] = useState<Tab>("registro");
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);

    const result =
      tab === "registro" ? await signUp({ email, password, company, contactName }) : await signIn(email, password);

    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if ("needsConfirmation" in result && result.needsConfirmation) {
      setNeedsConfirmation(true);
      return;
    }
    onAuthenticated?.();
  }

  if (needsConfirmation) {
    return (
      <div className={cn("rounded-2xl border border-rule bg-card p-6 text-center shadow-card", className)}>
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-seal-tint text-seal">
          <Mail className="size-6" aria-hidden />
        </span>
        <h2 className="display mt-4 text-xl">Confirma tu correo</h2>
        <p className="mt-2 text-muted">
          Te enviamos un enlace a <span className="font-medium text-ink">{email}</span>. Ábrelo para activar tu cuenta y
          vuelve a esta página: tu informe te está esperando.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-rule bg-card p-6 shadow-card", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-seal-tint text-seal">
          <LockKeyhole className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="display text-xl">{title}</h2>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
      </div>

      {benefits && (
        <ul className="mt-5 flex flex-col gap-2 text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden />
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex gap-1 rounded-xl bg-paper p-1">
        {(
          [
            { id: "registro", label: "Crear cuenta" },
            { id: "ingreso", label: "Ya tengo cuenta" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setError("");
            }}
            aria-pressed={tab === item.id}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
              tab === item.id ? "bg-card text-ink shadow-card" : "text-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        {tab === "registro" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Empresa">
              <Input required value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" />
            </Field>
            <Field label="Tu nombre">
              <Input required value={contactName} onChange={(event) => setContactName(event.target.value)} autoComplete="name" />
            </Field>
          </div>
        )}
        <Field label="Correo">
          <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        </Field>
        <Field label="Contraseña" hint={tab === "registro" ? "Mínimo 8 caracteres." : undefined}>
          <Input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={tab === "registro" ? "new-password" : "current-password"}
          />
        </Field>

        {error && (
          <p role="alert" className="rounded-xl bg-rose-tint px-3 py-2 text-sm text-rose">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className={cn(buttonStyles("primary", "lg"), "mt-1")}>
          {busy && <Loader className="size-4 animate-spin" aria-hidden />}
          {tab === "registro" ? "Crear cuenta y abrir el informe" : "Entrar"}
        </button>
      </form>

      {mode === "demo" && (
        <p className="mt-4 text-xs text-muted">
          Modo demostración: la cuenta queda guardada solo en este dispositivo hasta que conectemos Supabase.
        </p>
      )}
    </div>
  );
}
