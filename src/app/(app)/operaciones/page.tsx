"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { OperationSummary } from "@/components/operations/OperationSummary";
import { EmptyState, Loading, PageHeader, buttonStyles, cn } from "@/components/ui";
import { checklistProgress } from "@/lib/requirements";
import { useAppStore, useHydrated } from "@/lib/store";

const filters = [
  { id: "todas", label: "Todas" },
  { id: "curso", label: "En curso" },
  { id: "listas", label: "Listas para embarcar" },
] as const;

export default function OperationsPage() {
  const hydrated = useHydrated();
  const operations = useAppStore((state) => state.operations);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("todas");

  const isComplete = (op: (typeof operations)[number]) => checklistProgress(op.checklist).ratio === 1;
  const counts = {
    todas: operations.length,
    curso: operations.filter((op) => !isComplete(op)).length,
    listas: operations.filter(isComplete).length,
  };
  const visible = operations.filter((op) =>
    filter === "todas" ? true : filter === "listas" ? isComplete(op) : !isComplete(op),
  );

  return (
    <>
      <PageHeader
        icon={Package}
        eyebrow="Operaciones"
        title="Tus exportaciones"
        description="Cada operación tiene su checklist de documentos. Marca el avance y pide ayuda a un aliado cuando lo necesites."
        actions={
          <Link href="/operaciones/nueva" className={buttonStyles("primary")}>
            <Plus className="size-4" aria-hidden />
            Nueva operación
          </Link>
        }
      />

      {!hydrated ? (
        <div className="mt-8">
          <Loading />
        </div>
      ) : operations.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Aún no tienes operaciones" icon={Package}>
            <p>Crea una para generar el checklist de documentos de tu próximo embarque.</p>
            <Link href="/operaciones/nueva" className={`${buttonStyles("primary", "sm")} mt-4`}>
              Crear operación
            </Link>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-8 flex gap-1 rounded-xl bg-card p-1 shadow-card ring-1 ring-rule sm:inline-flex" role="group" aria-label="Filtrar operaciones">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors sm:flex-none",
                  filter === item.id ? "bg-navy text-white" : "text-muted hover:text-ink",
                )}
              >
                {item.label} <span className="ml-1 tabular-nums opacity-70">{counts[item.id]}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No hay operaciones en este estado.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((operation) => (
                <li key={operation.id}>
                  <OperationSummary operation={operation} />
                </li>
              ))}
              <li>
                <Link
                  href="/operaciones/nueva"
                  className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rule text-muted transition hover:border-seal/50 hover:bg-seal-tint/40 hover:text-seal-strong"
                >
                  <Plus className="size-6" aria-hidden />
                  <span className="font-medium">Nueva operación</span>
                </Link>
              </li>
            </ul>
          )}
        </>
      )}
    </>
  );
}
