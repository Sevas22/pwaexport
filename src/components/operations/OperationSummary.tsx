import Link from "next/link";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { Flag } from "@/components/Flag";
import { Badge, ProgressRing, cn } from "@/components/ui";
import { getRoute, modeLabels } from "@/data/catalog";
import { checklistProgress, getDocument } from "@/lib/requirements";
import type { Operation } from "@/lib/types";

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(iso));

export function ProgressBar({ ratio, label, className }: { ratio: number; label: string; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      className={cn("h-2 overflow-hidden rounded-full bg-rule", className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-seal to-trace transition-all duration-700"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

/** Primer documento obligatorio sin terminar, en el orden de la ruta documental. */
export function nextPendingDocument(operation: Operation) {
  const entries = Object.entries(operation.checklist);
  const pending = (onlyRequired: boolean) =>
    entries.find(([id, status]) => {
      const doc = getDocument(id);
      return doc && (status === "pendiente" || status === "en-tramite") && (!onlyRequired || doc.requirement === "obligatorio");
    });
  const match = pending(true) ?? pending(false);
  return match ? { doc: getDocument(match[0])!, status: match[1] } : undefined;
}

export function OperationSummary({ operation }: { operation: Operation }) {
  const progress = checklistProgress(operation.checklist);
  const next = nextPendingDocument(operation);
  const complete = progress.total > 0 && progress.done === progress.total;

  return (
    <Link
      href={`/operaciones/${operation.id}`}
      className="group flex h-full flex-col rounded-2xl border border-rule bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-float"
    >
      <div className="flex items-start gap-4">
        <ProgressRing ratio={progress.ratio} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted">{operation.code}</span>
            {complete ? <Badge tone="seal">Lista para embarcar</Badge> : <Badge tone="sky">En curso</Badge>}
          </div>
          <p className="mt-1 line-clamp-2 font-semibold leading-snug">{operation.product}</p>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
            <Flag market="co" className="h-3 w-[18px]" />
            <span aria-hidden>→</span>
            <Flag market={operation.market} className="h-3 w-[18px]" />
            <span className="truncate">{operation.destinationCountry}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {modeLabels[operation.mode]} · {operation.incoterm}
          </p>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-seal"
          aria-hidden
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-rule pt-3 text-sm">
        {next ? (
          <span className="flex min-w-0 items-center gap-2">
            <CircleDot className={cn("size-4 shrink-0", next.status === "en-tramite" ? "text-amber" : "text-muted")} aria-hidden />
            <span className="truncate">
              <span className="text-muted">Siguiente:</span> {next.doc.name}
            </span>
          </span>
        ) : (
          <span className="text-muted">{getRoute(operation.route).name}</span>
        )}
        <span className="shrink-0 tabular-nums text-muted">
          {progress.done}/{progress.total}
        </span>
      </div>
    </Link>
  );
}
