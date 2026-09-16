"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Handshake, Mail, MessageCircle, Package, Quote, Send } from "lucide-react";
import { formatDate } from "@/components/operations/OperationSummary";
import { Avatar, Badge, Card, EmptyState, Loading, PageHeader, buttonStyles, cn } from "@/components/ui";
import { getAlly } from "@/data/allies";
import { getAllyType } from "@/data/catalog";
import { getDocument } from "@/lib/requirements";
import { mailtoLink, referralMessage, referralStatusLabel, referralStatuses, referralTone, whatsappLink } from "@/lib/referrals";
import { useAppStore, useHydrated } from "@/lib/store";
import type { ReferralStatus } from "@/lib/types";

const statusAccent: Record<ReferralStatus, string> = {
  enviado: "bg-sky",
  contactado: "bg-amber",
  "en-proceso": "bg-trace",
  cerrado: "bg-seal-strong",
  descartado: "bg-rose",
};

export default function ReferralsPage() {
  const hydrated = useHydrated();
  const referrals = useAppStore((state) => state.referrals);
  const operations = useAppStore((state) => state.operations);
  const profile = useAppStore((state) => state.profile);
  const setReferralStatus = useAppStore((state) => state.setReferralStatus);
  const [filter, setFilter] = useState<ReferralStatus | "todos">("todos");

  const visible = filter === "todos" ? referrals : referrals.filter((ref) => ref.status === filter);

  return (
    <>
      <PageHeader
        icon={Send}
        eyebrow="Referidos"
        title="Tus referidos a aliados"
        description="Cada referido tiene un código único. Actualiza su estado a medida que la agencia avanza con tu trámite."
        actions={
          <Link href="/aliados" className={buttonStyles("secondary")}>
            <Handshake className="size-4" aria-hidden />
            Buscar aliados
          </Link>
        }
      />

      {!hydrated ? (
        <div className="mt-8">
          <Loading />
        </div>
      ) : referrals.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Aún no has referido ninguna operación" icon={Send}>
            <p>Desde un documento, una operación o el directorio puedes referir tu exportación a un aliado.</p>
            <Link href="/documentos" className={`${buttonStyles("primary", "sm")} mt-4`}>
              Consultar documentos
            </Link>
          </EmptyState>
        </div>
      ) : (
        <>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label="Filtrar por estado">
            {[{ id: "todos" as const, label: "Todos" }, ...referralStatuses].map((item) => {
              const count = item.id === "todos" ? referrals.length : referrals.filter((ref) => ref.status === item.id).length;
              const active = filter === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setFilter(item.id)}
                    aria-pressed={active}
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
                      active ? "border-navy bg-navy text-white shadow-float" : "border-rule bg-card shadow-card hover:border-seal/30",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn("absolute inset-x-0 top-0 h-1", item.id === "todos" ? "bg-gradient-to-r from-sky via-trace to-seal-strong" : statusAccent[item.id])}
                    />
                    <span className={cn("block text-sm", active ? "text-white/70" : "text-muted")}>{item.label}</span>
                    <span className="display mt-1 block text-2xl tabular-nums">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {visible.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No hay referidos con ese estado.</p>
          ) : (
            <ul className="mt-6 flex flex-col gap-4">
              {visible.map((ref) => {
                const ally = getAlly(ref.allyId);
                const operation = operations.find((op) => op.id === ref.operationId);
                const message = ally ? referralMessage(ref, ally, profile, operation) : "";
                const docNames = ref.documentIds.map((id) => getDocument(id)?.name).filter(Boolean);
                const currentIndex = referralStatuses.findIndex((s) => s.id === ref.status);
                return (
                  <li key={ref.id}>
                    <Card className="overflow-hidden">
                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <Avatar name={ally?.name ?? "Aliado"} />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm text-seal">{ref.code}</span>
                              <Badge tone={referralTone(ref.status)}>{referralStatusLabel(ref.status)}</Badge>
                            </div>
                            <p className="mt-1 font-semibold">{ally?.name ?? "Aliado no disponible"}</p>
                            <p className="text-sm text-muted">
                              {ally && `${getAllyType(ally.type).name} · `}Creado el {formatDate(ref.createdAt)}
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-muted sm:flex-col sm:items-end">
                          Cambiar estado
                          <select
                            value={ref.status}
                            onChange={(event) => setReferralStatus(ref.id, event.target.value as ReferralStatus)}
                            className="h-9 rounded-xl border border-rule bg-card px-3 text-sm text-ink shadow-card focus:border-seal focus:outline-none"
                          >
                            {referralStatuses.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      {(operation || docNames.length > 0 || ref.note) && (
                        <div className="flex flex-col gap-2 px-5 pb-4 text-sm">
                          {operation && (
                            <p className="flex items-center gap-2">
                              <Package className="size-4 text-muted" aria-hidden />
                              <Link href={`/operaciones/${operation.id}`} className="text-seal-strong hover:underline">
                                {operation.code} · {operation.product}
                              </Link>
                            </p>
                          )}
                          {docNames.length > 0 && (
                            <p className="flex items-start gap-2 text-muted">
                              <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
                              {docNames.join(", ")}
                            </p>
                          )}
                          {ref.note && (
                            <p className="flex items-start gap-2 text-muted italic">
                              <Quote className="mt-0.5 size-4 shrink-0" aria-hidden />
                              {ref.note}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-3 border-t border-rule bg-paper/50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <ol className="flex items-center gap-1" aria-label="Avance del referido">
                          {referralStatuses.slice(0, 4).map((status, index) => {
                            const reached = ref.status !== "descartado" && index <= currentIndex;
                            return (
                              <li key={status.id} className="flex items-center gap-1">
                                <span
                                  title={status.label}
                                  className={cn("size-2.5 rounded-full", reached ? "bg-trace" : "bg-rule")}
                                />
                                {index < 3 && <span className={cn("h-0.5 w-6 rounded-full sm:w-10", reached && index < currentIndex ? "bg-trace" : "bg-rule")} />}
                              </li>
                            );
                          })}
                          <li className="ml-2 text-xs text-muted">{referralStatusLabel(ref.status)}</li>
                        </ol>
                        {ally && (
                          <div className="-ml-3 flex flex-wrap gap-1 sm:ml-0">
                            <a
                              href={mailtoLink(ally.email, `Referido ${ref.code} · Trader Marketer`, message)}
                              className={buttonStyles("ghost", "sm")}
                            >
                              <Mail className="size-4" aria-hidden />
                              Reenviar por correo
                            </a>
                            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={buttonStyles("ghost", "sm")}>
                              <MessageCircle className="size-4" aria-hidden />
                              WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </>
  );
}
