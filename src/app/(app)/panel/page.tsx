"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  FileCheck,
  Hourglass,
  Package,
  Plus,
  Send,
  type LucideIcon,
} from "lucide-react";
import { moduleIcons } from "@/components/icons";
import { OperationSummary, nextPendingDocument } from "@/components/operations/OperationSummary";
import { ReferDialog, type ReferContext } from "@/components/referrals/ReferDialog";
import { SponsoredAlly } from "@/components/SponsoredAlly";
import { Avatar, Badge, Card, EmptyState, IconTile, Loading, SectionTitle, buttonStyles, cn } from "@/components/ui";
import { getAlly } from "@/data/allies";
import { coreModules, type ModuleKind } from "@/data/modules";
import { referralStatusLabel, referralStatuses, referralTone } from "@/lib/referrals";
import { checklistProgress } from "@/lib/requirements";
import { useAppStore, useHydrated } from "@/lib/store";
import type { AllyTypeId } from "@/lib/types";

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
}

export default function PanelPage() {
  const hydrated = useHydrated();
  const profile = useAppStore((state) => state.profile);
  const operations = useAppStore((state) => state.operations);
  const referrals = useAppStore((state) => state.referrals);
  const [refer, setRefer] = useState<ReferContext | null>(null);

  if (!hydrated) return <Loading />;

  const active = operations.filter((op) => checklistProgress(op.checklist).ratio < 1);
  const totals = operations.reduce(
    (acc, op) => {
      const progress = checklistProgress(op.checklist);
      const inProgress = Object.values(op.checklist).filter((s) => s === "en-tramite").length;
      return { done: acc.done + progress.done, total: acc.total + progress.total, inProgress: acc.inProgress + inProgress };
    },
    { done: 0, total: 0, inProgress: 0 },
  );
  const openReferrals = referrals.filter((ref) => ref.status !== "cerrado" && ref.status !== "descartado");
  const nextSteps = active
    .map((op) => ({ op, next: nextPendingDocument(op) }))
    .filter((item): item is { op: typeof item.op; next: NonNullable<typeof item.next> } => Boolean(item.next));
  const pendingHelpers = [...new Set(nextSteps.flatMap(({ next }) => next.doc.helpers))] as AllyTypeId[];
  const firstName = profile.contactName.split(" ")[0];

  const kpis: { label: string; value: string; detail: string; icon: LucideIcon; tone: "seal" | "sky" | "amber" | "navy" }[] = [
    { label: "Operaciones activas", value: String(active.length), detail: `${operations.length} en total`, icon: Package, tone: "seal" },
    {
      label: "Documentos listos",
      value: totals.total ? `${Math.round((totals.done / totals.total) * 100)}%` : "0%",
      detail: `${totals.done} de ${totals.total}`,
      icon: CheckCheck,
      tone: "sky",
    },
    { label: "Trámites en curso", value: String(totals.inProgress), detail: "documentos en trámite", icon: Hourglass, tone: "amber" },
    { label: "Referidos abiertos", value: String(openReferrals.length), detail: `${referrals.length} enviados a aliados`, icon: Send, tone: "navy" },
  ];

  return (
    <>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-seal">Panel de exportación</p>
          <h1 className="display mt-1.5 text-[1.9rem] sm:text-[2.3rem]">
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1.5 text-muted">
            {active.length > 0
              ? `Tienes ${nextSteps.length} ${nextSteps.length === 1 ? "documento por mover" : "documentos por mover"} en tus operaciones de ${profile.company || "tu empresa"}.`
              : "Consulta los documentos de tu próximo envío o crea una operación para controlarlo."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/documentos" className={buttonStyles("secondary")}>
            <FileCheck className="size-4" aria-hidden />
            Consultar documentos
          </Link>
          <Link href="/operaciones/nueva" className={buttonStyles("primary")}>
            <Plus className="size-4" aria-hidden />
            Nueva operación
          </Link>
        </div>
      </header>

      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {kpis.map((kpi, index) => (
          <li key={kpi.label} className="animate-rise" style={{ animationDelay: `${index * 60}ms` }}>
            <Card className="h-full p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-muted">{kpi.label}</p>
                <IconTile icon={kpi.icon} tone={kpi.tone} size="sm" />
              </div>
              <p className="display mt-3 text-3xl tabular-nums">{kpi.value}</p>
              <p className="mt-1 text-xs text-muted">{kpi.detail}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-10">
          <section>
            <SectionTitle
              title="Operaciones en curso"
              description="Avance del checklist documental de cada embarque"
              action={
                <Link href="/operaciones" className="inline-flex items-center gap-1 text-sm font-medium text-seal hover:underline">
                  Ver todas <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              }
            />
            {active.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No tienes operaciones abiertas" icon={Package}>
                  <p>Crea una operación y obtén su checklist de documentos.</p>
                  <Link href="/operaciones/nueva" className={`${buttonStyles("primary", "sm")} mt-4`}>
                    Crear operación
                  </Link>
                </EmptyState>
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {active.slice(0, 4).map((op) => (
                  <li key={op.id}>
                    <OperationSummary operation={op} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {nextSteps.length > 0 && (
            <section>
              <SectionTitle title="Próximos pasos" description="El siguiente documento obligatorio de cada operación" />
              <Card className="mt-4 divide-y divide-rule">
                {nextSteps.map(({ op, next }) => (
                  <div key={op.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <IconTile icon={FileCheck} tone={next.status === "en-tramite" ? "amber" : "muted"} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium">
                          <Link href={`/documentos/${next.doc.id}`} className="hover:text-seal">
                            {next.doc.name}
                          </Link>
                        </p>
                        <p className="truncate text-sm text-muted">
                          <span className="font-mono text-xs">{op.code}</span> · {op.product}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pl-11 sm:pl-0">
                      <Badge tone={next.status === "en-tramite" ? "amber" : "muted"}>
                        {next.status === "en-tramite" ? "En trámite" : "Pendiente"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() =>
                          setRefer({ allyTypes: next.doc.helpers, market: op.market, operationId: op.id, documentIds: [next.doc.id] })
                        }
                        className={buttonStyles("ghost", "sm")}
                      >
                        <Send className="size-4" aria-hidden />
                        Pedir ayuda
                      </button>
                    </div>
                  </div>
                ))}
              </Card>
            </section>
          )}

          <section>
            <SectionTitle title="Módulos TM Core" description="Lo que resuelves en la app, con un aliado y lo que viene" />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <ModuleColumn title="En la app" kind="app" />
              <ModuleColumn title="Con aliados" kind="aliados" />
              <ModuleColumn title="Próximamente" kind="hoja-de-ruta" />
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5">
            <SectionTitle
              title="Referidos"
              action={
                <Link href="/referidos" className="text-sm font-medium text-seal hover:underline">
                  Ver todos
                </Link>
              }
            />
            <ReferralFunnel counts={referralStatuses.map((s) => referrals.filter((r) => r.status === s.id).length)} />
            {referrals.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Aún no has referido operaciones a aliados.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {referrals.slice(0, 4).map((ref) => {
                  const ally = getAlly(ref.allyId);
                  return (
                    <li key={ref.id} className="flex items-center gap-3">
                      <Avatar name={ally?.name ?? "Aliado"} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{ally?.name}</p>
                        <p className="font-mono text-xs text-muted">{ref.code}</p>
                      </div>
                      <Badge tone={referralTone(ref.status)}>{referralStatusLabel(ref.status)}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <SponsoredAlly types={pendingHelpers.length ? pendingHelpers : undefined} market={active[0]?.market} />
        </aside>
      </div>

      <ReferDialog context={refer} onClose={() => setRefer(null)} />
    </>
  );
}

function ReferralFunnel({ counts }: { counts: number[] }) {
  const total = counts.reduce((a, b) => a + b, 0);
  const colors = ["bg-sky", "bg-amber", "bg-trace", "bg-seal-strong", "bg-rose"];
  return (
    <div className="mt-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-rule">
        {total > 0 &&
          counts.map((count, index) =>
            count ? (
              <span key={index} className={colors[index]} style={{ width: `${(count / total) * 100}%` }} />
            ) : null,
          )}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted">
        {referralStatuses.map((status, index) => (
          <li key={status.id} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", colors[index])} aria-hidden />
            {status.label}
            <span className="ml-auto font-medium tabular-nums text-ink">{counts[index]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModuleColumn({ title, kind }: { title: string; kind: ModuleKind }) {
  const items = coreModules.filter((module) => module.kind === kind);
  const tone = kind === "app" ? "seal" : kind === "aliados" ? "sky" : "muted";
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Badge tone={tone}>{items.length}</Badge>
      </div>
      <ul className="mt-3 flex flex-col gap-1">
        {items.map((module) => {
          const Icon = moduleIcons[module.id];
          const href = module.href ?? (module.allyTypes ? `/aliados?tipo=${module.allyTypes[0]}` : undefined);
          const content = (
            <>
              <IconTile icon={Icon} tone={tone} size="sm" />
              <span className="flex-1">{module.name}</span>
              {href && <ArrowUpRight className="size-3.5 text-muted opacity-0 transition group-hover:opacity-100" aria-hidden />}
            </>
          );
          return (
            <li key={module.id}>
              {href ? (
                <Link href={href} className="group flex items-center gap-3 rounded-xl px-1.5 py-1.5 text-sm hover:bg-paper">
                  {content}
                </Link>
              ) : (
                <span className="flex items-center gap-3 px-1.5 py-1.5 text-sm text-muted">{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
