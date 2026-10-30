import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Clock, Globe, Info, ListChecks, MapPin, Phone, Sparkles } from "lucide-react";
import { Flag } from "@/components/Flag";
import { allyTypeIcons } from "@/components/icons";
import { ReferButton } from "@/components/referrals/ReferButton";
import { Avatar, Card, IconTile, RequirementBadge } from "@/components/ui";
import { allies, getAlly } from "@/data/allies";
import { documents } from "@/data/documents";
import { getAllyType, getMarket } from "@/data/catalog";
import { navigation } from "@/data/navigation";

export function generateStaticParams() {
  return allies.map((ally) => ({ id: ally.id }));
}

export async function generateMetadata({ params }: PageProps<"/aliados/[id]">): Promise<Metadata> {
  const { id } = await params;
  const ally = getAlly(id);
  return ally ? { title: ally.name, description: ally.description } : {};
}

export default async function AllyPage({ params }: PageProps<"/aliados/[id]">) {
  const { id } = await params;
  const ally = getAlly(id);
  if (!ally) notFound();

  const type = getAllyType(ally.type);
  const TypeIcon = allyTypeIcons[ally.type];
  const helpsWith = documents.filter((doc) => doc.helpers.includes(ally.type));
  // Secciones del sitio donde este tipo de aliado aparece como quien resuelve.
  const appearsIn = navigation.flatMap((section) =>
    section.children
      .filter((child) => child.allyTypes?.includes(ally.type))
      .map((child) => ({ section, child })),
  );

  return (
    <article>
      <Link href="/aliados" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Aliados
      </Link>

      <Card className="mt-4 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-br from-navy via-navy-2 to-seal-strong sm:h-40">
          <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
          <TypeIcon aria-hidden className="absolute top-1/2 right-8 size-28 -translate-y-1/2 text-white/10" />
          {ally.sponsored && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="size-3.5" aria-hidden />
              Aliado patrocinado
            </span>
          )}
        </div>
        <div className="relative px-5 pb-6 sm:px-8">
          <Avatar name={ally.name} size="lg" className="-mt-10 size-20 text-2xl ring-4 ring-card" />
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-seal">
                  <TypeIcon className="size-4" aria-hidden />
                  {type.name}
                </p>
                <h1 className="display mt-1 text-2xl sm:text-3xl">{ally.name}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" aria-hidden />
                    {ally.city}, {ally.country}
                  </span>
                  {ally.responseTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" aria-hidden />
                      {ally.responseTime}
                    </span>
                  )}
                  {ally.website && (
                    <a
                      href={ally.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-seal hover:underline"
                    >
                      <Globe className="size-4" aria-hidden />
                      {new URL(ally.website).hostname.replace("www.", "")}
                    </a>
                  )}
                  {ally.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="size-4" aria-hidden />
                      {ally.phone}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <ReferButton context={{ allyId: ally.id }} />
          </div>
        </div>
      </Card>

      {ally.isDemo && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-amber/25 bg-amber-tint px-3 py-2 text-sm text-amber">
          <Info className="size-4 shrink-0" aria-hidden />
          Perfil de ejemplo: los datos de contacto de esta ficha son ficticios.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="display text-lg">Sobre el aliado</h2>
            <p className="mt-2 leading-relaxed text-muted">{ally.description}</p>
            <h3 className="mt-6 text-sm font-semibold">Servicios</h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ally.services.map((service) => (
                <li key={service} className="flex items-center gap-2.5 rounded-xl bg-paper px-3 py-2.5 text-sm ring-1 ring-rule">
                  <span className="flex size-5 items-center justify-center rounded-full bg-seal text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </Card>

          {helpsWith.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <IconTile icon={ListChecks} size="sm" />
                <div>
                  <h2 className="display text-lg">Documentos con los que ayuda</h2>
                  <p className="text-sm text-muted">{type.description}</p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-rule">
                {helpsWith.map((doc) => (
                  <li key={doc.id}>
                    <Link href={`/documentos/${doc.id}`} className="group flex items-center justify-between gap-3 py-3">
                      <span className="flex min-w-0 items-center gap-3">
                        <RequirementBadge requirement={doc.requirement} />
                        <span className="truncate group-hover:text-seal-strong">{doc.name}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted group-hover:text-seal" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          {appearsIn.length > 0 && (
            <Card className="p-6">
              <h2 className="text-sm font-semibold">Aparece en</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {appearsIn.map(({ section, child }) => (
                  <li key={`${section.slug}/${child.slug}`}>
                    <Link
                      href={child.href ?? `/${section.slug}/${child.slug}`}
                      className="group flex items-center justify-between gap-2 text-sm hover:text-seal-strong"
                    >
                      <span>
                        <span className="text-muted">{section.label} · </span>
                        {child.label}
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted group-hover:text-seal" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { value: ally.markets.length, label: "mercados" },
                { value: ally.services.length, label: "servicios" },
                { value: helpsWith.length, label: "documentos" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-paper py-3 ring-1 ring-rule">
                  <p className="display text-2xl tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <h2 className="mt-6 flex items-center gap-2 text-sm font-semibold">
              <Globe className="size-4 text-seal" aria-hidden />
              Mercados que atiende
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {ally.markets.map((market) => (
                <li key={market} className="flex items-center gap-3 text-sm">
                  <Flag market={market} />
                  {getMarket(market).name}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </article>
  );
}
