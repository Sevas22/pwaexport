"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Check, Loader, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ReportView } from "@/components/report/ReportView";
import { Card, IconTile, buttonStyles, cn } from "@/components/ui";
import { isRouteId } from "@/data/catalog";
import { defaultDestination, defaultOrigin, getDestination, getOrigin } from "@/data/countries";
import { useAuth } from "@/lib/auth";
import { persistReport } from "@/lib/reports";
import type { ExportReport } from "@/lib/agent/types";

const phases = [
  "Interpretando el producto y su partida arancelaria",
  "Cruzando el destino con la base documental",
  "Redactando el informe de exportación",
];

export function ReportClient() {
  const params = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const query = (params.get("q") ?? "").slice(0, 160);
  const originParam = params.get("desde") ?? "";
  const origin = getOrigin(originParam) ? originParam : defaultOrigin;
  const destinationParam = params.get("pais") ?? "";
  const destination = getDestination(destinationParam) ? destinationParam : defaultDestination;
  const routeParam = params.get("ruta");
  const route = isRouteId(routeParam) ? routeParam : "ordinaria";

  const [report, setReport] = useState<ExportReport | null>(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(0);
  const requested = useRef("");
  const persisted = useRef("");

  useEffect(() => {
    if (!query || requested.current === `${query}|${origin}|${destination}|${route}`) return;
    requested.current = `${query}|${origin}|${destination}|${route}`;
    setReport(null);
    setError("");
    setPhase(0);

    const timer = setInterval(() => setPhase((current) => Math.min(current + 1, phases.length - 1)), 2200);

    fetch("/api/informe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, origin, destination, route, mode: params.get("modo") ?? undefined }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "No pudimos generar el informe.");
        setReport(data.report as ExportReport);
      })
      .catch((cause: Error) => setError(cause.message))
      .finally(() => clearInterval(timer));

    return () => clearInterval(timer);
  }, [query, origin, destination, route, params]);

  // Al tener cuenta, el informe queda guardado en el historial del usuario.
  useEffect(() => {
    if (!user || !report || persisted.current === report.id) return;
    persisted.current = report.id;
    void persistReport(report, user);
  }, [user, report]);

  if (!query) {
    return (
      <Card className="mx-auto mt-16 max-w-lg p-8 text-center">
        <h1 className="display text-2xl">¿Qué quieres exportar?</h1>
        <p className="mt-2 text-muted">Vuelve al inicio y escribe tu producto o su partida arancelaria.</p>
        <Link href="/" className={`${buttonStyles("primary")} mt-6`}>
          Ir al buscador
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden />
          Nueva consulta
        </Link>
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
      </div>

      {error ? (
        <Card className="mt-8 p-8 text-center">
          <IconTile icon={AlertTriangle} tone="amber" size="lg" className="mx-auto" />
          <h1 className="display mt-4 text-2xl">No pudimos generar el informe</h1>
          <p className="mt-2 text-muted">{error}</p>
          <Link href="/" className={`${buttonStyles("primary")} mt-6`}>
            Intentar otra consulta
          </Link>
        </Card>
      ) : !report ? (
        <GeneratingState query={query} destination={destination} phase={phase} />
      ) : (
        <ReportView report={report} unlocked={Boolean(user)} authLoading={authLoading} />
      )}
    </div>
  );
}

function GeneratingState({ query, destination, phase }: { query: string; destination: string; phase: number }) {
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="relative bg-navy px-6 py-10 text-center text-white sm:px-10">
        <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
        <div aria-hidden className="absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-trace/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
            <Sparkles className="size-4 text-[#6fd3a0]" aria-hidden />
            Agente de comercio exterior
          </span>
          <h1 className="display mt-5 text-balance text-2xl sm:text-3xl">{query}</h1>
          <p className="mt-2 text-white/70">
            Analizando la exportación hacia {getDestination(destination)?.name ?? "tu mercado"}
          </p>
        </div>
      </div>
      <ol className="flex flex-col gap-4 p-6 sm:p-8">
        {phases.map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                index < phase && "bg-seal-tint text-seal",
                index === phase && "bg-navy text-white",
                index > phase && "bg-paper text-muted ring-1 ring-rule",
              )}
            >
              {index < phase ? (
                <Check className="size-4" strokeWidth={3} aria-hidden />
              ) : index === phase ? (
                <Loader className="size-4 animate-spin" aria-hidden />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </span>
            <span className={cn("text-sm", index === phase ? "font-medium" : "text-muted")}>{label}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

