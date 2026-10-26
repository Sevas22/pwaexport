"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock, Copy, FileText, Mail, MessageCircle, Sparkles, X } from "lucide-react";
import { allyTypeIcons } from "@/components/icons";
import { SelectMenu } from "@/components/SelectMenu";
import { Avatar, Field, Input, Textarea, buttonStyles, cn } from "@/components/ui";
import { allies, getAlly } from "@/data/allies";
import { getAllyType } from "@/data/catalog";
import { alliesFor, getDocument } from "@/lib/requirements";
import { mailtoLink, referralMessage, whatsappLink } from "@/lib/referrals";
import { useAppStore } from "@/lib/store";
import type { AllyTypeId, CompanyProfile, MarketId, Referral } from "@/lib/types";

export interface ReferContext {
  allyId?: string;
  allyTypes?: AllyTypeId[];
  market?: MarketId;
  operationId?: string;
  documentIds?: string[];
}

interface ReferDialogProps {
  context: ReferContext | null;
  onClose: () => void;
}

/** Flujo de referido: elegir aliado → describir la necesidad → enviar. */
export function ReferDialog({ context, onClose }: ReferDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (context && !dialog.open) dialog.showModal();
    if (!context && dialog.open) dialog.close();
  }, [context]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="refer-title"
      className="m-auto max-h-[92dvh] w-[min(100%-1.5rem,38rem)] overflow-y-auto rounded-3xl border border-rule bg-card p-0 text-ink shadow-[0_40px_100px_-30px_rgb(0_0_0/0.5)]"
    >
      {context && <ReferFlow key={JSON.stringify(context)} context={context} onClose={onClose} />}
    </dialog>
  );
}

const steps = ["Aliado", "Detalles", "Enviar"];

function ReferFlow({ context, onClose }: { context: ReferContext; onClose: () => void }) {
  const storedProfile = useAppStore((state) => state.profile);
  const operations = useAppStore((state) => state.operations);
  const saveProfile = useAppStore((state) => state.saveProfile);
  const createReferral = useAppStore((state) => state.createReferral);

  const [allyId, setAllyId] = useState(context.allyId);
  const [operationId, setOperationId] = useState(context.operationId ?? "");
  const [note, setNote] = useState("");
  const [profile, setProfile] = useState<CompanyProfile>(storedProfile);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [copied, setCopied] = useState(false);

  const ally = allyId ? getAlly(allyId) : undefined;
  const suggested = context.allyTypes?.length ? alliesFor(context.allyTypes, context.market) : [];
  const options = suggested.length ? suggested : [...allies].sort((a, b) => Number(b.sponsored) - Number(a.sponsored));
  const documentNames = (context.documentIds ?? []).map((id) => getDocument(id)?.name).filter(Boolean);

  const step = referral ? 2 : ally ? 1 : 0;
  const title = step === 0 ? "Elige un aliado" : step === 1 ? "Describe lo que necesitas" : "Referido creado";

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ally) return;
    saveProfile(profile);
    setReferral(createReferral({ allyId: ally.id, operationId: operationId || undefined, documentIds: context.documentIds ?? [], note }));
  }

  const operation = operations.find((op) => op.id === (referral?.operationId ?? operationId));
  const message = referral && ally ? referralMessage(referral, ally, profile, operation) : "";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-rule bg-card/95 px-6 pt-5 pb-4 backdrop-blur">
        <div className="flex items-center gap-2">
          {step === 1 && !context.allyId && (
            <button
              type="button"
              onClick={() => setAllyId(undefined)}
              className="-ml-2 flex size-9 items-center justify-center rounded-xl text-muted hover:bg-paper hover:text-ink"
              aria-label="Elegir otro aliado"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
          )}
          <h2 id="refer-title" className="display flex-1 text-xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 flex size-9 items-center justify-center rounded-xl text-muted hover:bg-paper hover:text-ink"
            aria-label="Cerrar"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <ol className="mt-4 flex items-center gap-2" aria-label="Pasos">
          {steps.map((label, index) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  index < step && "bg-trace text-white",
                  index === step && "bg-navy text-white",
                  index > step && "bg-paper text-muted ring-1 ring-rule",
                )}
              >
                {index < step ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : index + 1}
              </span>
              <span className={cn("text-xs", index === step ? "font-medium" : "text-muted")}>{label}</span>
              {index < steps.length - 1 && <span className={cn("h-0.5 flex-1 rounded-full", index < step ? "bg-trace" : "bg-rule")} />}
            </li>
          ))}
        </ol>
      </div>

      {step === 0 && (
        <div className="px-6 py-5">
          {documentNames.length > 0 && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-seal-tint px-3 py-2 text-sm text-seal-strong">
              <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>Aliados que ayudan con {documentNames.join(", ")}</span>
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {options.map((option) => {
              const TypeIcon = allyTypeIcons[option.type];
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => setAllyId(option.id)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-rule p-3 text-left transition hover:border-seal/40 hover:bg-seal-tint/30"
                  >
                    <Avatar name={option.name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">{option.name}</span>
                        {option.sponsored && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-tint px-1.5 py-0.5 text-[0.7rem] font-medium text-amber">
                            <Sparkles className="size-3" aria-hidden />
                            Patrocinado
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <TypeIcon className="size-3.5" aria-hidden />
                          {getAllyType(option.type).name} · {option.city}
                        </span>
                        {option.responseTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" aria-hidden />
                            {option.responseTime}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-seal" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {step === 1 && ally && (
        <form onSubmit={submit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex items-center gap-3 rounded-2xl bg-paper p-3 ring-1 ring-rule">
            <Avatar name={ally.name} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{ally.name}</p>
              <p className="text-sm text-muted">
                {[getAllyType(ally.type).name, ally.city, ally.responseTime].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {documentNames.length > 0 && (
            <div>
              <p className="text-sm font-medium">Necesitas ayuda con</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {documentNames.map((name) => (
                  <li key={name} className="rounded-full bg-seal-tint px-2.5 py-1 text-sm text-seal-strong">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!context.operationId && operations.length > 0 && (
            <Field label="Operación relacionada">
              <SelectMenu
                label="Operación relacionada"
                value={operationId}
                onChange={setOperationId}
                options={[
                  { value: "", label: "Sin operación" },
                  ...operations.map((op) => ({ value: op.id, label: `${op.code} · ${op.product}` })),
                ]}
                buttonClassName="h-11 w-full justify-between rounded-xl border border-rule bg-card px-3.5 text-left text-ink hover:border-muted/40"
                menuClassName="w-full max-w-[calc(100vw-4rem)]"
              />
            </Field>
          )}
          <Field label="Mensaje para el aliado">
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ej.: Primer embarque de 2 estibas en junio, necesitamos cotización del trámite completo."
            />
          </Field>

          <fieldset className="grid grid-cols-1 gap-3 rounded-2xl border border-rule p-4 sm:grid-cols-2">
            <legend className="px-1 text-sm font-medium">Tus datos de contacto</legend>
            <Field label="Empresa">
              <Input required value={profile.company} onChange={(event) => setProfile({ ...profile, company: event.target.value })} />
            </Field>
            <Field label="Nombre">
              <Input required value={profile.contactName} onChange={(event) => setProfile({ ...profile, contactName: event.target.value })} />
            </Field>
            <Field label="Correo">
              <Input type="email" required value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
            </Field>
            <Field label="Teléfono">
              <Input type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
            </Field>
          </fieldset>

          <button type="submit" className={buttonStyles("primary", "lg")}>
            Crear referido
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </form>
      )}

      {step === 2 && referral && ally && (
        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-seal-tint shadow-glow">
              <span className="flex size-11 items-center justify-center rounded-full bg-trace text-white">
                <Check className="size-6" strokeWidth={3} aria-hidden />
              </span>
            </span>
            <p className="eyebrow mt-4 text-muted">Código de referido</p>
            <p className="mt-1 font-mono text-3xl font-medium tracking-wider">{referral.code}</p>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Quedó en tu historial. Envíale el mensaje a {ally.name} para que te contacte.
            </p>
          </div>
          <pre className="max-h-44 overflow-auto rounded-2xl bg-paper p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap ring-1 ring-rule">
            {message}
          </pre>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <a href={mailtoLink(ally.email, `Referido ${referral.code} · Trader Marketer`, message)} className={buttonStyles("primary", "sm")}>
              <Mail className="size-4" aria-hidden />
              Enviar por correo
            </a>
            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={buttonStyles("secondary", "sm")}>
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </a>
            <button type="button" onClick={copyMessage} className={buttonStyles("secondary", "sm")}>
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copied ? "Copiado" : "Copiar mensaje"}
            </button>
          </div>
          <Link href="/referidos" onClick={onClose} className="text-center text-sm font-medium text-seal hover:underline">
            Ver mis referidos
          </Link>
        </div>
      )}
    </div>
  );
}
