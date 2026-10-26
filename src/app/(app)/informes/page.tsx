"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, FileSearch, Search, Sparkles } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Flag } from "@/components/Flag";
import { formatDate } from "@/components/operations/OperationSummary";
import { Badge, EmptyState, Loading, PageHeader, buttonStyles } from "@/components/ui";
import { getMarket, modeLabels } from "@/data/catalog";
import { useAuth } from "@/lib/auth";
import { fetchReports } from "@/lib/reports";
import type { ExportReport } from "@/lib/agent/types";

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<ExportReport[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchReports(user).then((result) => {
      if (active) setReports(user ? result : []);
    });
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <>
      <PageHeader
        icon={FileSearch}
        eyebrow="Informes"
        title="Informes del agente"
        description="Cada consulta que haces en el buscador queda guardada aquí con su clasificación arancelaria y sus requisitos."
        actions={
          <Link href="/" className={buttonStyles("primary")}>
            <Search className="size-4" aria-hidden />
            Nuevo informe
          </Link>
        }
      />

      {loading || reports === null ? (
        <div className="mt-8">
          <Loading />
        </div>
      ) : !user ? (
        <div className="mt-8 max-w-lg">
          <AuthCard
            title="Entra para ver tus informes"
            description="Tus informes quedan guardados en tu cuenta."
            benefits={["Historial de consultas con su clasificación.", "Conviértelos en operaciones cuando quieras."]}
          />
        </div>
      ) : reports.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Todavía no has generado informes" icon={FileSearch}>
            <p>Escribe tu producto o su partida arancelaria en el buscador del inicio.</p>
            <Link href="/" className={`${buttonStyles("primary", "sm")} mt-4`}>
              Generar mi primer informe
            </Link>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <li key={report.id}>
              <Link
                href={`/informes/${report.id}`}
                className="group flex h-full flex-col rounded-2xl border border-rule bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-float"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-seal">{report.classification.code}</span>
                    <p className="mt-1 line-clamp-2 font-semibold leading-snug">{report.classification.product}</p>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted group-hover:text-seal" aria-hidden />
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Flag market="co" className="h-3 w-[18px]" />
                  <span aria-hidden>→</span>
                  <Flag market={report.input.market} className="h-3 w-[18px]" />
                  {report.input.destinationCountry || getMarket(report.input.market).name} ·{" "}
                  {modeLabels[report.selection.mode]}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-3 text-xs text-muted">
                  <span>{formatDate(report.createdAt)}</span>
                  {report.generatedBy === "groq" ? (
                    <Badge tone="seal">
                      <Sparkles className="size-3" aria-hidden />
                      Agente IA
                    </Badge>
                  ) : (
                    <Badge tone="muted">Base documental</Badge>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
