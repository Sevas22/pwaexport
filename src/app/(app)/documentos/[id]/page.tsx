import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, ExternalLink, Lightbulb, MapPin, Package, Target, TriangleAlert, Truck } from "lucide-react";
import { documents } from "@/data/documents";
import { getAllyType, getCategory, markets, modeLabels, stages } from "@/data/catalog";
import { Flag } from "@/components/Flag";
import { allyTypeIcons, stageIcons } from "@/components/icons";
import { ReferButton } from "@/components/referrals/ReferButton";
import { SponsoredAlly } from "@/components/SponsoredAlly";
import { Card, IconTile, RequirementBadge } from "@/components/ui";
import { getDocument } from "@/lib/requirements";

export function generateStaticParams() {
  return documents.map((doc) => ({ id: doc.id }));
}

export async function generateMetadata({ params }: PageProps<"/documentos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const doc = getDocument(id);
  return doc ? { title: doc.name, description: doc.summary } : {};
}

export default async function DocumentPage({ params }: PageProps<"/documentos/[id]">) {
  const { id } = await params;
  const doc = getDocument(id);
  if (!doc) notFound();

  const stageIndex = stages.findIndex((item) => item.id === doc.stage);
  const stage = stages[stageIndex];
  const StageIcon = stageIcons[doc.stage];
  const scope = [
    {
      icon: MapPin,
      label: "Mercados",
      value: doc.appliesTo.markets ? doc.appliesTo.markets.map((m) => markets.find((x) => x.id === m)?.name).join(", ") : "Todos los mercados",
    },
    {
      icon: Package,
      label: "Productos",
      value: doc.appliesTo.categories ? doc.appliesTo.categories.map((c) => getCategory(c).name).join(", ") : "Todas las categorías",
    },
    {
      icon: Truck,
      label: "Envío",
      value: doc.appliesTo.modes ? doc.appliesTo.modes.map((m) => modeLabels[m]).join(", ") : "Cualquier modo de envío",
    },
  ];

  return (
    <article>
      <Link href="/documentos" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Asistente documental
      </Link>

      <Card className="relative mt-4 overflow-hidden">
        <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <RequirementBadge requirement={doc.requirement} />
            {doc.short && <span className="rounded-md bg-paper px-2 py-0.5 font-mono text-xs text-muted ring-1 ring-rule">{doc.short}</span>}
          </div>
          <h1 className="display mt-4 max-w-3xl text-balance text-3xl sm:text-4xl">{doc.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{doc.summary}</p>

          <ol className="mt-8 flex flex-wrap gap-2" aria-label="Etapa del proceso">
            {stages.map((item, index) => {
              const Icon = stageIcons[item.id];
              const current = index === stageIndex;
              return (
                <li
                  key={item.id}
                  aria-current={current ? "step" : undefined}
                  className={
                    current
                      ? "flex items-center gap-2 rounded-full bg-navy px-3 py-1.5 text-sm text-white"
                      : "flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm text-muted ring-1 ring-rule"
                  }
                >
                  <Icon className="size-4" aria-hidden />
                  {item.name}
                </li>
              );
            })}
          </ol>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="flex flex-col gap-6">
          {doc.condition && (
            <p className="flex gap-3 rounded-2xl border border-amber/25 bg-amber-tint p-4 text-amber">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
              <span>
                <span className="font-semibold">Cuándo aplica:</span> {doc.condition}
              </span>
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <IconTile icon={Building2} size="sm" />
              <p className="mt-3 text-xs text-muted">Quién lo emite</p>
              <p className="mt-0.5 font-medium">{doc.issuer}</p>
            </Card>
            <Card className="p-5">
              <IconTile icon={StageIcon} size="sm" tone="sky" />
              <p className="mt-3 text-xs text-muted">Dónde se tramita · {stage.name}</p>
              <p className="mt-0.5 font-medium">{doc.where}</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <IconTile icon={Target} size="sm" />
              <h2 className="display text-lg">A quién aplica</h2>
            </div>
            <dl className="mt-4 divide-y divide-rule">
              {scope.map((item) => (
                <div key={item.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[8rem_1fr]">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <item.icon className="size-4" aria-hidden />
                    {item.label}
                  </dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {doc.marketNotes && (
            <Card className="p-6">
              <h2 className="display text-lg">Diferencias por mercado</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {markets
                  .filter((market) => doc.marketNotes?.[market.id])
                  .map((market) => (
                    <li key={market.id} className="flex gap-4 rounded-xl bg-paper p-4 ring-1 ring-rule">
                      <Flag market={market.id} className="mt-0.5 h-5 w-7" />
                      <div>
                        <p className="font-medium">{market.name}</p>
                        <p className="mt-0.5 text-sm text-muted">{doc.marketNotes?.[market.id]}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </Card>
          )}

          {doc.tips && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <IconTile icon={Lightbulb} size="sm" tone="amber" />
                <h2 className="display text-lg">Recomendaciones</h2>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {doc.tips.map((tip) => (
                  <li key={tip} className="border-l-2 border-trace pl-3">
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {doc.source && (
            <a
              href={doc.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-seal hover:underline"
            >
              Fuente oficial: {doc.source.label}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>

        <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
          <Card className="relative overflow-hidden">
            <div className="relative bg-navy p-5 text-white">
              <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
              <p className="relative font-semibold">¿Necesitas ayuda con este documento?</p>
              <p className="relative mt-1 text-sm text-white/70">Refiérelo a una agencia aliada que lo tramite contigo.</p>
            </div>
            <div className="p-5">
              <ul className="flex flex-col gap-1">
                {doc.helpers.map((type) => {
                  const Icon = allyTypeIcons[type];
                  return (
                    <li key={type}>
                      <Link
                        href={`/aliados?tipo=${type}`}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-paper hover:text-seal-strong"
                      >
                        <Icon className="size-4 text-seal" aria-hidden />
                        {getAllyType(type).plural}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ReferButton className="mt-4 w-full" label="Pedir ayuda a un aliado" context={{ allyTypes: doc.helpers, documentIds: [doc.id] }} />
            </div>
          </Card>
          <SponsoredAlly types={doc.helpers} />
        </aside>
      </div>
    </article>
  );
}
