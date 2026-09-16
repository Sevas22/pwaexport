"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, ShieldAlert } from "lucide-react";
import { ExportSentence, normalizeSelection, selectionToQuery } from "@/components/documents/ExportSentence";
import { ManifestStrip } from "@/components/documents/ManifestStrip";
import { RouteTrace } from "@/components/documents/RouteTrace";
import { allyTypeIcons, stageIcons } from "@/components/icons";
import { ReferDialog, type ReferContext } from "@/components/referrals/ReferDialog";
import { SponsoredAlly } from "@/components/SponsoredAlly";
import { Card, buttonStyles } from "@/components/ui";
import { getAllyType } from "@/data/catalog";
import { documentsFor, groupByStage } from "@/lib/requirements";
import type { ExportSelection } from "@/lib/types";

export function DocumentWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [refer, setRefer] = useState<ReferContext | null>(null);

  const selection = normalizeSelection({
    route: params.get("ruta"),
    category: params.get("categoria"),
    market: params.get("mercado"),
    mode: params.get("modo"),
  });

  const docs = documentsFor(selection);
  const groups = groupByStage(docs);
  const required = docs.filter((doc) => doc.requirement === "obligatorio").length;
  const helperTypes = [...new Set(docs.flatMap((doc) => doc.helpers))];

  function update(next: ExportSelection) {
    router.replace(`${pathname}?${selectionToQuery(next)}`, { scroll: false });
  }

  return (
    <>
      <Card className="relative mt-8 overflow-hidden">
        <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />
        <div className="relative p-5 sm:p-8">
          <ExportSentence value={selection} onChange={update} />
          <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
            <Stat value={docs.length} label="Documentos" />
            <Stat value={required} label="Obligatorios" accent />
            <Stat value={docs.length - required} label="Condicionales" />
          </div>
          <div className="mt-6 flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
            <ManifestStrip selection={selection} />
            <Link href={`/operaciones/nueva?${selectionToQuery(selection)}`} className={buttonStyles("primary")}>
              <Plus className="size-4" aria-hidden />
              Crear operación con esta ruta
            </Link>
          </div>
        </div>
      </Card>

      <nav aria-label="Etapas" className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ol className="flex min-w-max gap-2">
          {groups.map((group, index) => {
            const Icon = stageIcons[group.id];
            return (
              <li key={group.id}>
                <a
                  href={`#etapa-${group.id}`}
                  className="flex items-center gap-2 rounded-full border border-rule bg-card py-1.5 pr-3 pl-1.5 text-sm shadow-card transition hover:border-seal/40 hover:text-seal-strong"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-seal-tint text-seal">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-muted">{index + 1}.</span>
                  {group.name}
                  <span className="rounded-full bg-paper px-1.5 text-xs tabular-nums text-muted">{group.documents.length}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <RouteTrace
          groups={groups}
          market={selection.market}
          onRefer={(doc) => setRefer({ allyTypes: doc.helpers, market: selection.market, documentIds: [doc.id] })}
        />
        <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
          <SponsoredAlly types={helperTypes} market={selection.market} />
          <Card className="p-5">
            <p className="text-sm font-semibold">Aliados para esta ruta</p>
            <ul className="mt-3 flex flex-col gap-1">
              {helperTypes.slice(0, 6).map((type) => {
                const Icon = allyTypeIcons[type];
                return (
                  <li key={type}>
                    <Link
                      href={`/aliados?tipo=${type}&mercado=${selection.market}`}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-paper hover:text-seal-strong"
                    >
                      <Icon className="size-4 text-seal" aria-hidden />
                      {getAllyType(type).plural}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
          <p className="flex gap-2 rounded-2xl border border-rule bg-card/60 p-4 text-xs leading-relaxed text-muted">
            <ShieldAlert className="size-4 shrink-0" aria-hidden />
            Información de referencia para exportaciones desde Colombia. Las normas cambian: valida cada operación con tu
            agente de aduanas antes de embarcar.
          </p>
        </aside>
      </div>

      <ReferDialog context={refer} onClose={() => setRefer(null)} />
    </>
  );
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className={accent ? "rounded-xl bg-seal-tint px-3 py-2.5" : "rounded-xl bg-paper px-3 py-2.5 ring-1 ring-rule"}>
      <p className={accent ? "display text-2xl tabular-nums text-seal-strong" : "display text-2xl tabular-nums"}>{value}</p>
      <p className={accent ? "text-xs text-seal-strong/80" : "text-xs text-muted"}>{label}</p>
    </div>
  );
}
