"use client";

import Link from "next/link";
import { ArrowUpRight, Ban, Check, CircleDashed, ChevronDown, Info, Landmark, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import { Flag } from "@/components/Flag";
import { stageIcons } from "@/components/icons";
import { getMarket } from "@/data/catalog";
import type { StageGroup } from "@/lib/requirements";
import type { ChecklistStatus, ExportDocument, MarketId } from "@/lib/types";
import { RequirementBadge, buttonStyles, cn } from "@/components/ui";

// Firma visual de la app: la ruta documental. Cada etapa es un nodo sobre una
// pista continua (como las pistas del circuito TM Core); el nodo se completa
// cuando todos los documentos de la etapa están listos.

const statusOptions: { id: ChecklistStatus; label: string; icon: typeof Check; className: string }[] = [
  { id: "pendiente", label: "Pendiente", icon: CircleDashed, className: "bg-paper text-muted ring-rule" },
  { id: "en-tramite", label: "En trámite", icon: LoaderCircle, className: "bg-amber-tint text-amber ring-amber/25" },
  { id: "listo", label: "Listo", icon: Check, className: "bg-seal-tint text-seal-strong ring-seal/25" },
  { id: "no-aplica", label: "No aplica", icon: Ban, className: "bg-paper text-muted ring-rule" },
];

interface RouteTraceProps {
  groups: StageGroup[];
  market: MarketId;
  statuses?: Record<string, ChecklistStatus>;
  onStatusChange?: (documentId: string, status: ChecklistStatus) => void;
  onRefer?: (doc: ExportDocument) => void;
}

export function RouteTrace({ groups, market, statuses, onStatusChange, onRefer }: RouteTraceProps) {
  return (
    <ol className="relative flex flex-col gap-10">
      {groups.map((group, index) => {
        const relevant = group.documents.filter((doc) => statuses?.[doc.id] !== "no-aplica");
        const done = relevant.filter((doc) => statuses?.[doc.id] === "listo").length;
        const complete = Boolean(statuses) && relevant.length > 0 && done === relevant.length;
        const Icon = stageIcons[group.id];
        const isLast = index === groups.length - 1;

        return (
          <li key={group.id} id={`etapa-${group.id}`} className="relative scroll-mt-24 pl-14 sm:pl-16">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-12 -bottom-10 left-[19px] w-0.5 sm:left-[23px]",
                  complete ? "bg-trace" : "bg-gradient-to-b from-trace/60 to-trace/15",
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "absolute top-0 left-0 flex size-10 items-center justify-center rounded-xl border-2 shadow-card sm:size-12 sm:rounded-2xl",
                complete ? "border-trace bg-trace text-white" : "border-trace/50 bg-card text-seal",
              )}
            >
              {complete ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-5" />}
            </span>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:min-h-12">
              <div>
                <p className="eyebrow text-muted">Etapa {index + 1}</p>
                <h3 className="display text-lg sm:text-xl">{group.name}</h3>
              </div>
              {statuses ? (
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-rule">
                    <div
                      className="h-full rounded-full bg-trace transition-all duration-500"
                      style={{ width: `${relevant.length ? (done / relevant.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm tabular-nums text-muted">
                    {done}/{relevant.length}
                  </span>
                </div>
              ) : (
                <span className="rounded-full bg-card px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-rule">
                  {group.documents.length} {group.documents.length === 1 ? "documento" : "documentos"}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{group.description}</p>

            <ul className="mt-4 flex flex-col gap-3">
              {group.documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  market={market}
                  status={statuses?.[doc.id]}
                  onStatusChange={onStatusChange}
                  onRefer={onRefer}
                />
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

function StatusSelect({
  value,
  label,
  onChange,
}: {
  value: ChecklistStatus;
  label: string;
  onChange: (status: ChecklistStatus) => void;
}) {
  const option = statusOptions.find((item) => item.id === value) ?? statusOptions[0];
  const Icon = option.icon;
  return (
    <span
      className={cn(
        "relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full pr-8 pl-3 text-sm font-medium ring-1 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-seal",
        option.className,
      )}
    >
      <Icon className="size-4" aria-hidden />
      {option.label}
      <ChevronDown className="absolute right-2.5 size-4 opacity-60" aria-hidden />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as ChecklistStatus)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {statusOptions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </span>
  );
}

function DocumentCard({
  doc,
  market,
  status,
  onStatusChange,
  onRefer,
}: {
  doc: ExportDocument;
  market: MarketId;
  status?: ChecklistStatus;
  onStatusChange?: RouteTraceProps["onStatusChange"];
  onRefer?: RouteTraceProps["onRefer"];
}) {
  const note = doc.marketNotes?.[market];

  return (
    <li
      className={cn(
        "group rounded-2xl border bg-card p-4 shadow-card transition-all sm:p-5",
        status === "listo" ? "border-seal/30" : "border-rule hover:border-seal/30",
        status === "no-aplica" && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <RequirementBadge requirement={doc.requirement} />
            {doc.short && (
              <span className="rounded-md bg-paper px-1.5 py-0.5 font-mono text-[0.7rem] text-muted ring-1 ring-rule">{doc.short}</span>
            )}
          </div>
          <h4 className={cn("mt-2 font-semibold leading-snug", status === "listo" && "text-seal-strong")}>
            <Link href={`/documentos/${doc.id}`} className="hover:underline">
              {doc.name}
            </Link>
          </h4>
        </div>
        {status && onStatusChange && (
          <StatusSelect value={status} label={`Estado de ${doc.name}`} onChange={(next) => onStatusChange(doc.id, next)} />
        )}
      </div>

      <p className="mt-2 text-[0.94rem] leading-relaxed text-muted">{doc.summary}</p>

      {doc.condition && (
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-tint px-3 py-2 text-sm text-amber">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-medium">Cuándo aplica:</span> {doc.condition}
          </span>
        </p>
      )}
      {note && (
        <p className="mt-3 flex gap-2 rounded-xl bg-seal-tint px-3 py-2 text-sm text-seal-strong">
          <Flag market={market} className="mt-0.5 h-3.5 w-5" />
          <span>
            <span className="font-medium">{getMarket(market).name}:</span> {note}
          </span>
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 border-t border-rule pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-muted">
          <Landmark className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{doc.issuer}</span>
        </p>
        <div className="-ml-3 flex items-center gap-1 sm:ml-0">
          <Link href={`/documentos/${doc.id}`} className={buttonStyles("ghost", "sm")}>
            <Info className="size-4" aria-hidden />
            Detalle
          </Link>
          {onRefer && (
            <button type="button" onClick={() => onRefer(doc)} className={cn(buttonStyles("ghost", "sm"), "text-seal")}>
              <Send className="size-4" aria-hidden />
              Pedir ayuda
              <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
