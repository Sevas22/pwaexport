"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Download,
  Boxes,
  Check,
  FileText,
  Landmark,
  Lock,
  Package,
  Receipt,
  Send,
  Sparkles,
  Truck,
} from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { CountryFlag } from "@/components/CountryFlag";
import { allyTypeIcons } from "@/components/icons";
import { selectionToQuery } from "@/components/documents/ExportSentence";
import { Term } from "@/components/Term";
import { Badge, Card, IconTile, buttonStyles } from "@/components/ui";
import { getAllyType, getMarket, modeLabels } from "@/data/catalog";
import { getOrigin } from "@/data/countries";
import { site } from "@/data/site";
import type { ExportReport } from "@/lib/agent/types";

// Vista del informe del agente: cabecera, hallazgos y, según la sesión,
// el informe completo o el muro de registro.

export function ReportView({ report, unlocked, authLoading }: { report: ExportReport; unlocked: boolean; authLoading: boolean }) {
  const market = getMarket(report.input.market);
  const destination = report.input.destinationCountry || market.name;
  const origin = getOrigin(report.input.origin);
  const originName = origin?.name ?? "Colombia";
  const { classification } = report;
  // El agente devuelve el producto como lo escribió la persona.
  const productTitle = classification.product.charAt(0).toUpperCase() + classification.product.slice(1);

  return (
    <article className="mt-6 flex flex-col gap-6">
      <Card className="overflow-hidden">
        <div className="relative bg-navy px-6 py-8 text-white sm:px-8 print:hidden">
          <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs">
                <Sparkles className="size-3.5 text-[#6fd3a0]" aria-hidden />
                {report.generatedBy === "groq" ? "Informe generado por el agente de IA" : "Informe de la base documental"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{modeLabels[report.selection.mode]}</span>
            </div>
            <h1 className="display mt-4 text-balance text-3xl sm:text-4xl">{productTitle}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-white/75">
              <CountryFlag code={report.input.origin} />
              {originName}
              <span aria-hidden>→</span>
              <CountryFlag code={report.input.destination} />
              {destination}
            </p>
          </div>
        </div>

        <header className="hidden border-b border-rule px-6 pb-4 print:block">
          <p className="eyebrow text-muted">Informe de exportación · {site.name}</p>
          <h1 className="display mt-1 text-2xl">{productTitle}</h1>
          <p className="mt-1 text-sm text-muted">
            {originName} → {destination} · {modeLabels[report.selection.mode]} · Subpartida {classification.code} ·{" "}
            {new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date(report.createdAt))}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6 sm:p-8">
          <div className="rounded-2xl bg-seal-tint px-5 py-4 text-center">
            <p className="eyebrow text-seal-strong">
              <Term name="partida">Subpartida sugerida</Term>
            </p>
            <p className="display mt-1 font-mono text-2xl text-seal-strong">{classification.code}</p>
            <p className="mt-1 text-xs text-seal-strong/80">Confianza {classification.confidence}</p>
          </div>
          <div>
            <p className="font-medium">{classification.description}</p>
            <p className="mt-1 text-sm text-muted">{classification.note}</p>
            {classification.alternatives.length > 0 && (
              <p className="mt-2 text-sm text-muted">
                Alternativas:{" "}
                {classification.alternatives.map((alt) => `${alt.code} (${alt.description})`).join(" · ")}
              </p>
            )}
          </div>
        </div>
      </Card>

      {origin?.coverage === "parcial" && (
        <p className="flex gap-3 rounded-2xl border border-amber/25 bg-amber-tint p-4 text-sm text-amber">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <span>
            Nuestra base documental detallada es de exportaciones desde Colombia. Para {originName}, el informe cubre los
            requisitos del país de destino; los trámites de salida confírmalos con un agente de aduanas local.
          </span>
        </p>
      )}

      {report.summary.length > 0 && (
        <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
          <h2 className="display text-xl">Hallazgos clave</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {report.summary.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-trace" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {unlocked ? (
        <FullReport report={report} />
      ) : (
        <Gate report={report} authLoading={authLoading} />
      )}
    </article>
  );
}

function Gate({ report, authLoading }: { report: ExportReport; authLoading: boolean }) {
  const sections = [
    { icon: Landmark, title: "Requisitos del mercado", count: report.marketOverview.entryRequirements.length },
    { icon: FileText, title: "Documentos exigidos", count: report.documents.length },
    { icon: Truck, title: "Logística recomendada", count: 3 },
    { icon: Receipt, title: "Costos a considerar", count: report.costs.length },
    { icon: AlertTriangle, title: "Riesgos de la operación", count: report.risks.length },
    { icon: Boxes, title: "Plan de siguientes pasos", count: report.nextSteps.length },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <h2 className="display text-xl">El informe completo incluye</h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.title} className="flex items-center gap-3 rounded-xl bg-paper p-3 ring-1 ring-rule">
              <IconTile icon={section.icon} size="sm" />
              <span className="flex-1 text-sm font-medium">{section.title}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                {section.count}
                <Lock className="size-3.5" aria-hidden />
              </span>
            </li>
          ))}
        </ul>
        <div className="relative mt-6" aria-hidden>
          <div className="pointer-events-none select-none blur-[3px]">
            <p className="font-medium">{report.marketOverview.agreement}</p>
            <p className="mt-2 text-muted">{report.marketOverview.tariffNote}</p>
            <p className="mt-2 text-muted">{report.logistics.recommendation}</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
        </div>
      </Card>

      <div className="lg:sticky lg:top-6 lg:self-start">
        {authLoading ? (
          <Card className="p-6">
            <p className="text-sm text-muted">Comprobando tu sesión…</p>
          </Card>
        ) : (
          <AuthCard
            title="Crea tu cuenta para abrir el informe"
            description="Es gratis y toma menos de un minuto."
            benefits={[
              "Informe completo con requisitos, documentos, costos y riesgos.",
              "Se guarda en tu cuenta para consultarlo cuando quieras.",
              "Puedes convertirlo en una operación y seguir cada documento.",
              "Refieres los trámites a las agencias aliadas del ecosistema.",
            ]}
          />
        )}
      </div>
    </div>
  );
}

/** Abre el diálogo de impresión del navegador, que permite guardar en PDF. */
function downloadPdf() {
  window.print();
}

function FullReport({ report }: { report: ExportReport }) {
  const operationQuery = `${selectionToQuery(report.selection)}&producto=${encodeURIComponent(report.classification.product)}&partida=${encodeURIComponent(report.classification.code)}&pais=${encodeURIComponent(report.input.destinationCountry ?? "")}`;

  return (
    <>
      <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
        <div className="flex items-center gap-3">
          <IconTile icon={Landmark} size="sm" />
          <h2 className="display text-xl">El mercado de destino</h2>
        </div>
        {report.marketOverview.opportunity && <p className="mt-4 leading-relaxed">{report.marketOverview.opportunity}</p>}
        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-paper p-4 ring-1 ring-rule">
            <dt className="text-xs text-muted">Acuerdo comercial</dt>
            <dd className="mt-1 text-sm">{report.marketOverview.agreement}</dd>
          </div>
          <div className="rounded-xl bg-paper p-4 ring-1 ring-rule">
            <dt className="text-xs text-muted">
              <Term name="arancel">Arancel</Term>
            </dt>
            <dd className="mt-1 text-sm">{report.marketOverview.tariffNote}</dd>
          </div>
        </dl>
        {report.marketOverview.entryRequirements.length > 0 && (
          <>
            <h3 className="mt-6 text-sm font-semibold">Requisitos de ingreso</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {report.marketOverview.entryRequirements.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {report.requirements.length > 0 && (
        <SectionCard icon={Check} title="Requisitos del producto" items={report.requirements} />
      )}

      <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconTile icon={FileText} size="sm" />
            <h2 className="display text-xl">Documentos de la operación</h2>
          </div>
          <Badge tone="muted">{report.documents.length}</Badge>
        </div>
        <ul className="mt-5 divide-y divide-rule">
          {report.documents.map((doc, index) => (
            <li key={`${doc.id ?? doc.name}-${index}`} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">
                  {doc.id ? (
                    <Link href={`/documentos/${doc.id}`} className="hover:text-seal-strong hover:underline">
                      {doc.name}
                    </Link>
                  ) : (
                    doc.name
                  )}
                </p>
              </div>
              {doc.why && <p className="mt-1 text-sm text-muted">{doc.why}</p>}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
        <div className="flex items-center gap-3">
          <IconTile icon={Truck} size="sm" />
          <h2 className="display text-xl">Logística</h2>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <p className="leading-relaxed">{report.logistics.recommendation}</p>
          <p className="rounded-xl bg-paper p-4 text-sm ring-1 ring-rule">{report.logistics.transitTime}</p>
          <p className="rounded-xl bg-paper p-4 text-sm ring-1 ring-rule">
            <Term name="incoterm" className="mr-1 font-medium" />: {report.logistics.incotermTip}
          </p>
        </div>
      </Card>

      {report.costs.length > 0 && <SectionCard icon={Receipt} title="Costos a considerar" items={report.costs} />}

      {report.risks.length > 0 && (
        <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
          <div className="flex items-center gap-3">
            <IconTile icon={AlertTriangle} tone="amber" size="sm" />
            <h2 className="display text-xl">Riesgos</h2>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {report.risks.map((risk) => (
              <li key={risk} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber" aria-hidden />
                {risk}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {report.nextSteps.length > 0 && (
        <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
          <div className="flex items-center gap-3">
            <IconTile icon={Boxes} size="sm" />
            <h2 className="display text-xl">Siguientes pasos</h2>
          </div>
          <ol className="mt-4 flex flex-col gap-3">
            {report.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {report.allyTypes.length > 0 && (
        <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
          <div className="flex items-center gap-3">
            <IconTile icon={Send} size="sm" />
            <h2 className="display text-xl">Aliados que te pueden ayudar</h2>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {report.allyTypes.map((type) => {
              const Icon = allyTypeIcons[type];
              return (
                <li key={type}>
                  <Link
                    href={`/aliados?tipo=${type}&mercado=${report.input.market}`}
                    className="flex items-center gap-2 rounded-xl border border-rule bg-card px-3 py-2 text-sm transition hover:border-seal/40 hover:text-seal-strong"
                  >
                    <Icon className="size-4 text-seal" aria-hidden />
                    {getAllyType(type).plural}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 print:hidden">
        <div>
          <h2 className="display text-xl">Convierte el informe en tu operación</h2>
          <p className="mt-1 text-muted">Genera el checklist de documentos y sigue cada trámite hasta embarcar.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/operaciones/nueva?${operationQuery}`} className={buttonStyles("primary")}>
            <Package className="size-4" aria-hidden />
            Crear operación
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button type="button" onClick={downloadPdf} className={buttonStyles("secondary")}>
            <Download className="size-4" aria-hidden />
            Descargar en PDF
          </button>
          <Link href="/panel" className={buttonStyles("ghost")}>
            Ir al panel
          </Link>
        </div>
      </Card>

      <p className="px-2 pb-4 text-xs leading-relaxed text-muted">
        Informe de referencia generado automáticamente
        {report.model ? ` con el modelo ${report.model}` : ""}. La normativa de comercio exterior cambia con frecuencia:
        valida los requisitos y la clasificación arancelaria con tu agente de aduanas antes de embarcar.
      </p>
    </>
  );
}

function SectionCard({
  icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { title: string; detail: string }[];
}) {
  return (
    <Card className="p-6 sm:p-8 print:break-inside-avoid print:border-0 print:p-0 print:pt-6">
      <div className="flex items-center gap-3">
        <IconTile icon={icon} size="sm" />
        <h2 className="display text-xl">{title}</h2>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl bg-paper p-4 ring-1 ring-rule">
            <dt className="font-medium">{item.title}</dt>
            <dd className="mt-1 text-sm text-muted">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
