"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ExportSentence, defaultSelection, selectionToQuery } from "@/components/documents/ExportSentence";
import { ManifestStrip } from "@/components/documents/ManifestStrip";
import { stageIcons } from "@/components/icons";
import { buttonStyles } from "@/components/ui";
import { documentsFor, groupByStage } from "@/lib/requirements";

/** Consulta en vivo de la landing: la frase y un adelanto de la ruta documental. */
export function LandingQuery() {
  const [selection, setSelection] = useState(defaultSelection);
  const docs = documentsFor(selection);
  const groups = groupByStage(docs);
  const required = docs.filter((doc) => doc.requirement === "obligatorio").length;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="flex flex-col">
        <ExportSentence value={selection} onChange={setSelection} size="hero" />
        <div className="mt-auto pt-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-seal-tint p-4">
              <p className="display text-4xl text-seal-strong tabular-nums" aria-live="polite">
                {docs.length}
              </p>
              <p className="mt-1 text-sm text-seal-strong/80">documentos en total</p>
            </div>
            <div className="rounded-2xl bg-paper p-4">
              <p className="display text-4xl tabular-nums">{required}</p>
              <p className="mt-1 text-sm text-muted">son obligatorios</p>
            </div>
          </div>
          <ManifestStrip selection={selection} className="mt-4" />
          <Link href={`/documentos?${selectionToQuery(selection)}`} className={`${buttonStyles("primary", "lg")} mt-6`}>
            Ver la ruta documental completa
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      <ol className="relative flex flex-col gap-3 self-start" aria-label="Etapas y documentos">
        <span aria-hidden className="absolute top-6 bottom-6 left-5 w-0.5 bg-gradient-to-b from-trace via-trace/50 to-trace/10" />
        {groups.map((group) => {
          const Icon = stageIcons[group.id];
          return (
            <li key={group.id} className="relative flex gap-4">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-trace/40 bg-card text-seal shadow-card">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-rule bg-paper/60 px-4 py-3">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{group.name}</span>
                  <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium tabular-nums text-muted ring-1 ring-rule">
                    {group.documents.length}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {group.documents.map((doc) => doc.short ?? doc.name).join(" · ")}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
