import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Handshake, Sparkles } from "lucide-react";
import { CoreCircuit } from "@/components/landing/CoreCircuit";
import { CtaButtons } from "@/components/site/CtaButtons";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CountryFlag } from "@/components/CountryFlag";
import { Flag } from "@/components/Flag";
import { allyTypeIcons } from "@/components/icons";
import { Avatar, Badge, Card, IconTile, RequirementBadge, buttonStyles } from "@/components/ui";
import { allies } from "@/data/allies";
import { getAllyType, markets } from "@/data/catalog";
import { allNavPaths, getChild, getSection, type NavChild, type NavSection } from "@/data/navigation";
import { getDocument } from "@/lib/requirements";

// Páginas del sitio público. Cada subpágina trae los aliados y documentos
// reales con los que se cruza, para que no sea un callejón sin salida.

export function generateStaticParams() {
  return allNavPaths();
}

export async function generateMetadata({ params }: PageProps<"/[...ruta]">): Promise<Metadata> {
  const { ruta } = await params;
  const [sectionSlug, childSlug] = ruta;
  const section = getSection(sectionSlug);
  if (!section) return {};
  const child = childSlug ? getChild(sectionSlug, childSlug) : undefined;
  if (childSlug && !child) return {};
  return {
    title: child ? `${child.label} · ${section.label}` : section.label,
    description: child?.summary ?? section.summary,
  };
}

export default async function SitePage({ params }: PageProps<"/[...ruta]">) {
  const { ruta } = await params;
  if (ruta.length > 2) notFound();

  const [sectionSlug, childSlug] = ruta;
  const section = getSection(sectionSlug);
  if (!section) notFound();

  const child = childSlug ? getChild(sectionSlug, childSlug) : undefined;
  if (childSlug && !child) notFound();
  // Las subpáginas que ya viven en la aplicación tienen una única dirección.
  if (child?.href) redirect(child.href);

  return (
    <div className="min-h-dvh">
      <SiteHeader />

      <main>
        <section className="relative border-b border-rule">
          <div aria-hidden className="bg-blueprint absolute inset-0 opacity-70" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <nav aria-label="Ruta" className="flex items-center gap-2 text-sm text-muted">
              <Link href="/" className="hover:text-ink">
                Inicio
              </Link>
              <span aria-hidden>/</span>
              {child ? (
                <>
                  <Link href={`/${section.slug}`} className="hover:text-ink">
                    {section.label}
                  </Link>
                  <span aria-hidden>/</span>
                  <span className="text-ink">{child.label}</span>
                </>
              ) : (
                <span className="text-ink">{section.label}</span>
              )}
            </nav>
            <h1 className="display mt-5 text-balance text-[2.2rem] sm:text-[2.8rem]">{child?.label ?? section.label}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{child?.summary ?? section.summary}</p>
          </div>
        </section>

        {child ? <ChildContent section={section} child={child} /> : <SectionContent section={section} />}

        <section className="border-t border-rule bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="display text-balance text-3xl">¿Hablamos?</h2>
              <p className="mt-3 text-muted">Cuéntenos su caso por WhatsApp y le respondemos hoy mismo.</p>
            </div>
            <CtaButtons className="mt-10" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Una sección lista sus subpáginas. */
function SectionContent({ section }: { section: NavSection }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {section.children.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href ?? `/${section.slug}/${item.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-rule bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-float"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold">{item.label}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted group-hover:text-seal" aria-hidden />
              </span>
              <span className="mt-2 text-sm text-muted">{item.summary}</span>
              <span className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {item.href && <Badge tone="seal">Disponible ahora</Badge>}
                {item.allyTypes?.length ? <Badge tone="sky">{item.allyTypes.length} tipos de aliado</Badge> : null}
                {item.documentIds?.length ? <Badge tone="muted">{item.documentIds.length} documentos</Badge> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {section.slug === "soluciones" && (
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-seal">Todo conectado</p>
            <h2 className="display mt-3 text-3xl">Cada módulo del proceso de internacionalización</h2>
          </div>
          <div className="mt-12">
            <CoreCircuit />
          </div>
        </div>
      )}
    </section>
  );
}

/** Una subpágina muestra con qué aliados y documentos se cruza. */
function ChildContent({ section, child }: { section: NavSection; child: NavChild }) {
  const relatedAllies = child.allyTypes?.length
    ? allies
        .filter((ally) => child.allyTypes?.includes(ally.type))
        .sort((a, b) => Number(a.isDemo ?? false) - Number(b.isDemo ?? false) || Number(b.sponsored) - Number(a.sponsored))
        .slice(0, 6)
    : [];
  const relatedDocuments = (child.documentIds ?? []).map(getDocument).filter((doc) => doc !== undefined);

  const siblings = section.children;
  const index = siblings.findIndex((item) => item.slug === child.slug);
  const previous = index > 0 ? siblings[index - 1] : undefined;
  const next = index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {relatedAllies.length > 0 && (
        <div>
          <div className="flex items-center gap-3">
            <IconTile icon={Handshake} size="sm" />
            <div>
              <h2 className="display text-xl">Quién lo resuelve</h2>
              <p className="text-sm text-muted">Aliados del ecosistema que trabajan este frente.</p>
            </div>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedAllies.map((ally) => {
              const TypeIcon = allyTypeIcons[ally.type];
              return (
                <li key={ally.id}>
                  <Link
                    href={`/aliados/${ally.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-rule bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-float"
                  >
                    <span className="flex items-center gap-3">
                      <Avatar name={ally.name} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{ally.name}</span>
                        <span className="flex items-center gap-1 text-xs text-seal">
                          <TypeIcon className="size-3.5" aria-hidden />
                          {getAllyType(ally.type).name}
                        </span>
                      </span>
                      {ally.isDemo && <span className="shrink-0 text-xs text-muted">Ejemplo</span>}
                    </span>
                    <span className="mt-3 line-clamp-2 text-sm text-muted">{ally.description}</span>
                    <span className="mt-3 flex items-center gap-1">
                      {ally.markets.slice(0, 5).map((market) => (
                        <Flag key={market} market={market} className="h-3 w-[18px]" />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {child.allyTypes?.map((type) => (
              <Link
                key={type}
                href={`/aliados?tipo=${type}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-3 py-1.5 text-sm text-muted transition hover:border-seal/40 hover:text-seal-strong"
              >
                Ver {getAllyType(type).plural.toLowerCase()}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedDocuments.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-3">
            <IconTile icon={FileText} size="sm" tone="sky" />
            <div>
              <h2 className="display text-xl">Documentos que aparecen aquí</h2>
              <p className="text-sm text-muted">Fichas de nuestra base documental, con quién los emite y cuándo aplican.</p>
            </div>
          </div>
          <ul className="mt-5 divide-y divide-rule rounded-2xl border border-rule bg-card">
            {relatedDocuments.map((doc) => (
              <li key={doc.id}>
                <Link href={`/documentos/${doc.id}`} className="group flex items-start justify-between gap-4 p-4">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <RequirementBadge requirement={doc.requirement} />
                      <span className="font-medium group-hover:text-seal-strong">{doc.name}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{doc.summary}</span>
                  </span>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted group-hover:text-seal" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/documentos" className={`${buttonStyles("secondary", "sm")} mt-5`}>
            Ver la ruta documental completa
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}

      {child.showMarkets && (
        <div className="mt-16">
          <h2 className="display text-xl">Mercados donde publicamos su oferta</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => (
              <li key={market.id} className="rounded-2xl border border-rule bg-card p-5">
                <Flag market={market.id} className="h-6 w-9 rounded-md" />
                <p className="mt-3 font-semibold">{market.name}</p>
                <p className="mt-1 text-sm text-muted">{market.agreements}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Un empujón hacia el informe, que es la puerta de entrada a la plataforma */}
      <Card className="relative mt-16 overflow-hidden">
        <div className="relative bg-navy p-8 text-white sm:p-10">
          <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-[#6fd3a0]">Empiece por aquí</p>
              <h2 className="display mt-3 text-2xl sm:text-3xl">Vea qué necesita su producto para entrar a ese mercado</h2>
              <p className="mt-3 text-white/70">
                El agente clasifica su producto, le dice qué exige el país de destino y qué documentos debe reunir.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
                <CountryFlag code="co" />
                <span aria-hidden>→</span>
                <CountryFlag code="us" />
                Colombia, Venezuela, Perú y más orígenes
              </p>
            </div>
            <Link href="/" className={buttonStyles("dark", "lg")}>
              <Sparkles className="size-4" aria-hidden />
              Generar mi informe
            </Link>
          </div>
        </div>
      </Card>

      {/* Navegación entre las subpáginas de la sección */}
      {(previous || next) && (
        <nav aria-label={`Más en ${section.label}`} className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
          {previous ? (
            <Link
              href={previous.href ?? `/${section.slug}/${previous.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-rule bg-card p-4 transition hover:border-seal/40 sm:w-[48%]"
            >
              <ArrowLeft className="size-4 shrink-0 text-muted group-hover:text-seal" aria-hidden />
              <span className="min-w-0">
                <span className="block text-xs text-muted">Anterior en {section.label}</span>
                <span className="block truncate font-medium">{previous.label}</span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block sm:w-[48%]" />
          )}
          {next && (
            <Link
              href={next.href ?? `/${section.slug}/${next.slug}`}
              className="group flex items-center justify-end gap-3 rounded-2xl border border-rule bg-card p-4 text-right transition hover:border-seal/40 sm:w-[48%]"
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted">Siguiente en {section.label}</span>
                <span className="block truncate font-medium">{next.label}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted group-hover:text-seal" aria-hidden />
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
