import Link from "next/link";
import { ArrowRight, Check, Factory, ShoppingCart } from "lucide-react";
import { CtaButtons } from "@/components/site/CtaButtons";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { modeLabels, routes } from "@/data/catalog";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";

const routeIcons = { ordinaria: Factory, ecommerce: ShoppingCart } as const;

export default function HomePage() {
  return (
    <div className="min-h-dvh overflow-x-clip">
      <SiteHeader />

      <main>
        {/* Encuentre compradores */}
        <section className="relative">
          <div aria-hidden className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
          <div aria-hidden className="absolute top-0 right-0 h-[28rem] w-[36rem] rounded-full bg-trace/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24">
            <p className="eyebrow text-seal">{site.name}</p>
            <h1 className="display mt-4 text-balance text-[2.6rem] sm:text-[3.4rem]">Encuentre compradores</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              Escriba su producto o su partida arancelaria y le mostramos a dónde venderlo, qué exige ese mercado y con
              quién hacerlo.
            </p>
            <div className="mt-10 text-left">
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* Corte de la plataforma */}
        <section className="border-t border-rule bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow text-seal">La plataforma por dentro</p>
              <h2 className="display mt-3 text-balance text-3xl sm:text-4xl">
                Cada exportación, con sus documentos al día
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                El informe se convierte en una operación con su lista de documentos, etapa por etapa, y con los aliados
                que resuelven cada trámite.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {routes.map((route) => {
                  const Icon = routeIcons[route.id];
                  return (
                    <article key={route.id} className="rounded-2xl border border-rule bg-paper/60 p-5">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-seal-tint text-seal">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="display mt-4 text-lg">{route.name}</h3>
                      <p className="mt-2 text-sm text-muted">{route.description}</p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {route.modes.map((mode) => (
                          <li key={mode} className="inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs ring-1 ring-rule">
                            <Check className="size-3 text-seal" aria-hidden />
                            {modeLabels[mode]}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/documentos?ruta=${route.id}&modo=${route.modes[0]}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-seal hover:underline"
                      >
                        Ver documentos
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>

            <HeroMockup />
          </div>
        </section>

        {/* Secciones del servicio */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-seal">Todo el servicio</p>
            <h2 className="display mt-3 text-balance text-3xl sm:text-4xl">Lo que resolvemos con usted</h2>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {navigation.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/${section.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-rule bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-float"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="display text-xl">{section.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-seal" aria-hidden />
                  </span>
                  <span className="mt-2 text-sm text-muted">{section.summary}</span>
                  <span className="mt-4 text-xs text-muted">
                    {section.children.map((child) => child.label).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Llamados a la acción */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="display text-balance text-3xl sm:text-4xl">¿Por dónde quiere empezar?</h2>
            <p className="mt-4 text-lg text-muted">Hable con nuestro equipo por WhatsApp y le respondemos hoy mismo.</p>
          </div>
          <CtaButtons className="mt-10" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
