"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { Flag } from "@/components/Flag";
import { RouteTrace } from "@/components/documents/RouteTrace";
import { formatDate } from "@/components/operations/OperationSummary";
import { ReferDialog, type ReferContext } from "@/components/referrals/ReferDialog";
import { SponsoredAlly } from "@/components/SponsoredAlly";
import { Avatar, Badge, Card, EmptyState, Loading, buttonStyles, cn } from "@/components/ui";
import { getAlly } from "@/data/allies";
import { getCategory, getRoute, modeLabels } from "@/data/catalog";
import { checklistProgress, getDocument, groupByStage } from "@/lib/requirements";
import { referralStatusLabel, referralTone } from "@/lib/referrals";
import { useAppStore, useHydrated } from "@/lib/store";
import type { ExportDocument } from "@/lib/types";

export default function OperationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHydrated();
  const operation = useAppStore((state) => state.operations.find((op) => op.id === id));
  const referrals = useAppStore((state) => state.referrals);
  const setChecklistStatus = useAppStore((state) => state.setChecklistStatus);
  const deleteOperation = useAppStore((state) => state.deleteOperation);
  const [refer, setRefer] = useState<ReferContext | null>(null);

  if (!hydrated) return <Loading />;

  if (!operation) {
    return (
      <EmptyState title="No encontramos esta operación">
        <p>Puede que se haya eliminado o que la hayas creado en otro dispositivo.</p>
        <Link href="/operaciones" className="mt-3 inline-block text-seal hover:underline">
          Ver operaciones
        </Link>
      </EmptyState>
    );
  }

  // El checklist se congela al crear la operación; se leen sus documentos, no las reglas actuales.
  const docs = Object.keys(operation.checklist)
    .map(getDocument)
    .filter((doc): doc is ExportDocument => Boolean(doc));
  const progress = checklistProgress(operation.checklist);
  const operationReferrals = referrals.filter((ref) => ref.operationId === operation.id);
  const pendingHelpers = [
    ...new Set(docs.filter((doc) => operation.checklist[doc.id] !== "listo").flatMap((doc) => doc.helpers)),
  ];
  const statusCounts = Object.values(operation.checklist).reduce<Record<string, number>>((acc, status) => {
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  function remove() {
    if (!operation || !window.confirm(`¿Eliminar la operación ${operation.code}? Esta acción no se puede deshacer.`)) return;
    deleteOperation(operation.id);
    router.push("/operaciones");
  }

  const facts = [
    { label: "Destino", value: operation.destinationCountry },
    { label: "Envío", value: modeLabels[operation.mode] },
    { label: "Incoterm", value: operation.incoterm },
    { label: "Subpartida", value: operation.hsCode || "Por definir", mono: Boolean(operation.hsCode) },
    { label: "Creada", value: formatDate(operation.createdAt) },
  ];

  return (
    <>
      <Link href="/operaciones" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Operaciones
      </Link>

      <section className="relative mt-4 overflow-hidden rounded-3xl bg-navy text-white shadow-float">
        <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
        <div aria-hidden className="absolute -right-20 -bottom-24 size-80 rounded-full bg-trace/20 blur-3xl" />
        <div className="relative grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-xs text-[#6fd3a0]">{operation.code}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{getRoute(operation.route).name}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{getCategory(operation.category).name}</span>
            </div>
            <h1 className="display mt-4 text-balance text-3xl sm:text-4xl">{operation.product}</h1>
            <p className="mt-3 flex items-center gap-2 text-white/75">
              <Flag market="co" />
              Colombia
              <span aria-hidden>→</span>
              <Flag market={operation.market} />
              {operation.destinationCountry}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs text-white/50">{fact.label}</dt>
                  <dd className={cn("mt-0.5 text-sm font-medium", fact.mono && "font-mono")}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex items-center gap-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <HeroRing ratio={progress.ratio} />
            <div className="text-sm">
              <p className="font-semibold">
                {progress.done} de {progress.total} listos
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-white/70">
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#4ccf8c]" aria-hidden />
                  {statusCounts["listo"] ?? 0} listos
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#e5a748]" aria-hidden />
                  {statusCounts["en-tramite"] ?? 0} en trámite
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-white/40" aria-hidden />
                  {statusCounts["pendiente"] ?? 0} pendientes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <RouteTrace
          groups={groupByStage(docs)}
          market={operation.market}
          statuses={operation.checklist}
          onStatusChange={(documentId, status) => setChecklistStatus(operation.id, documentId, status)}
          onRefer={(doc) =>
            setRefer({ allyTypes: doc.helpers, market: operation.market, operationId: operation.id, documentIds: [doc.id] })
          }
        />

        <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Referidos</h2>
              <Badge tone="muted">{operationReferrals.length}</Badge>
            </div>
            {operationReferrals.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Todavía no has referido esta operación.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {operationReferrals.map((ref) => {
                  const ally = getAlly(ref.allyId);
                  return (
                    <li key={ref.id} className="flex items-center gap-3">
                      <Avatar name={ally?.name ?? "Aliado"} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{ally?.name ?? "Aliado"}</p>
                        <p className="font-mono text-xs text-muted">{ref.code}</p>
                      </div>
                      <Badge tone={referralTone(ref.status)}>{referralStatusLabel(ref.status)}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setRefer({ allyTypes: pendingHelpers, market: operation.market, operationId: operation.id })}
              className={cn(buttonStyles("primary", "sm"), "mt-5 w-full")}
            >
              <Send className="size-4" aria-hidden />
              Referir operación
            </button>
          </Card>

          <SponsoredAlly types={pendingHelpers} market={operation.market} />

          <button type="button" onClick={remove} className={cn(buttonStyles("ghost", "sm"), "justify-start hover:bg-rose-tint hover:text-rose")}>
            <Trash2 className="size-4" aria-hidden />
            Eliminar operación
          </button>
        </aside>
      </div>

      <ReferDialog context={refer} onClose={() => setRefer(null)} />
    </>
  );
}

function HeroRing({ ratio }: { ratio: number }) {
  const size = 92;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} stroke="rgb(255 255 255 / 0.12)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="#4ccf8c"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="display absolute text-xl tabular-nums">{Math.round(ratio * 100)}%</span>
    </span>
  );
}
