"use client";

import { useState } from "react";
import { Building2, Check, Eraser, RotateCcw, ShieldCheck } from "lucide-react";
import { Avatar, Card, Field, IconTile, Input, Loading, PageHeader, buttonStyles, cn } from "@/components/ui";
import { useAppStore, useHydrated } from "@/lib/store";
import type { CompanyProfile } from "@/lib/types";

export default function ProfilePage() {
  const hydrated = useHydrated();

  return (
    <>
      <PageHeader
        icon={Building2}
        eyebrow="Mi empresa"
        title="Datos de tu empresa"
        description="Los usamos para que los aliados sepan quién los contacta cuando refieres una operación."
      />
      {hydrated ? <ProfileContent /> : <Loading />}
    </>
  );
}

const fields: { key: keyof CompanyProfile; label: string; type?: string; required?: boolean }[] = [
  { key: "company", label: "Razón social", required: true },
  { key: "taxId", label: "NIT" },
  { key: "contactName", label: "Nombre de contacto", required: true },
  { key: "email", label: "Correo", type: "email", required: true },
  { key: "phone", label: "Teléfono o WhatsApp", type: "tel" },
  { key: "city", label: "Ciudad" },
];

function ProfileContent() {
  const stored = useAppStore((state) => state.profile);
  const saveProfile = useAppStore((state) => state.saveProfile);
  const loadDemo = useAppStore((state) => state.loadDemo);
  const clearData = useAppStore((state) => state.clearData);
  const operationsCount = useAppStore((state) => state.operations.length);
  const referralsCount = useAppStore((state) => state.referrals.length);
  const [profile, setProfile] = useState(stored);
  const [saved, setSaved] = useState(false);

  function reset(action: "demo" | "vaciar") {
    const message =
      action === "demo"
        ? "¿Restablecer los datos de demostración? Se reemplazan tus operaciones, referidos y perfil actuales."
        : "¿Borrar todos los datos de este dispositivo? Esta acción no se puede deshacer.";
    if (!window.confirm(message)) return;
    if (action === "demo") loadDemo();
    else clearData();
    setProfile(useAppStore.getState().profile);
    setSaved(false);
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 border-b border-rule bg-paper/60 px-6 py-5">
          <Avatar name={profile.company || "Mi empresa"} size="lg" />
          <div className="min-w-0">
            <p className="display truncate text-xl">{profile.company || "Tu empresa"}</p>
            <p className="truncate text-sm text-muted">
              {[profile.contactName, profile.city].filter(Boolean).join(" · ") || "Completa los datos de contacto"}
            </p>
          </div>
        </div>
        <form
          className="p-6"
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile(profile);
            setSaved(true);
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <Field key={field.key} label={field.label}>
                <Input
                  type={field.type ?? "text"}
                  required={field.required}
                  value={profile[field.key]}
                  onChange={(event) => {
                    setSaved(false);
                    setProfile({ ...profile, [field.key]: event.target.value });
                  }}
                />
              </Field>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
            <button type="submit" className={buttonStyles("primary")}>
              Guardar datos
            </button>
            {saved && (
              <p className="flex items-center gap-1.5 text-sm text-seal" role="status">
                <Check className="size-4" aria-hidden />
                Datos guardados
              </p>
            )}
          </div>
        </form>
      </Card>

      <aside className="flex flex-col gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <IconTile icon={ShieldCheck} size="sm" />
            <p className="font-semibold">Privacidad</p>
          </div>
          <p className="mt-3 text-sm text-muted">
            Tus datos se guardan solo en este dispositivo. Ningún aliado los recibe hasta que envías un referido.
          </p>
        </Card>

        <Card className="p-5">
          <p className="font-semibold">Datos de la demostración</p>
          <p className="mt-1 text-sm text-muted">
            {operationsCount} operaciones y {referralsCount} referidos guardados en este dispositivo.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={() => reset("demo")} className={cn(buttonStyles("secondary", "sm"), "justify-start")}>
              <RotateCcw className="size-4" aria-hidden />
              Restablecer datos de demostración
            </button>
            <button
              type="button"
              onClick={() => reset("vaciar")}
              className={cn(buttonStyles("ghost", "sm"), "justify-start hover:bg-rose-tint hover:text-rose")}
            >
              <Eraser className="size-4" aria-hidden />
              Empezar sin datos
            </button>
          </div>
        </Card>
      </aside>
    </div>
  );
}
