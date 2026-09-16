import Link from "next/link";
import {
  ArrowRight,
  Check,
  Factory,
  FileCheck,
  Globe,
  Handshake,
  MousePointerClick,
  Search,
  Send,
  ShoppingCart,
  Target,
  TrendingUp,
} from "lucide-react";
import { Flag } from "@/components/Flag";
import { allyTypeIcons } from "@/components/icons";
import { CoreCircuit } from "@/components/landing/CoreCircuit";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { Logo, LogoMark } from "@/components/Logo";
import { buttonStyles, cn } from "@/components/ui";
import { allyTypes, markets, modeLabels, routes } from "@/data/catalog";
import { documents } from "@/data/documents";
import { site } from "@/data/site";
import { LandingQuery } from "./LandingQuery";

const navLinks = [
  { href: "#consulta", label: "Consulta" },
  { href: "#plataforma", label: "Plataforma" },
  { href: "#rutas", label: "Rutas" },
  { href: "#mercados", label: "Mercados" },
  { href: "#aliados", label: "Aliados" },
];

const referralSteps = [
  {
    icon: Search,
    title: "Consulta tu ruta documental",
    body: "Ves cada documento según tu producto, el mercado y la forma de envío, en el orden en que lo necesitas.",
  },
  {
    icon: Send,
    title: "Refiere lo que no quieres tramitar",
    body: "Eliges una agencia aliada y le envías tu operación con un código de referido único.",
  },
  {
    icon: TrendingUp,
    title: "Sigue el avance hasta embarcar",
    body: "Actualizas el estado del referido y del checklist de documentos en un solo lugar.",
  },
];

const routeIcons = { ordinaria: Factory, ecommerce: ShoppingCart } as const;

export default function HomePage() {
  return (
    <div className="min-h-dvh overflow-x-clip">
      <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Trader Marketer, inicio">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-muted hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>
          <Link href="/panel" className={buttonStyles("primary", "sm")}>
            Probar el demo
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div aria-hidden className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
          <div aria-hidden className="absolute top-0 right-0 h-[32rem] w-[40rem] rounded-full bg-trace/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pt-20 lg:pb-28">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-seal/20 bg-card px-3 py-1 text-sm shadow-card">
                <span className="rounded-full bg-seal px-2 py-0.5 text-xs font-medium text-on-seal">TM Core AI</span>
                Para pymes exportadoras de Latinoamérica
              </span>
              <h1 className="display mt-6 text-balance text-[2.6rem] sm:text-[3.4rem] xl:text-[3.75rem]">
                Una sola plataforma para <span className="text-seal">todo tu proceso de exportación.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Consulta los documentos que exige cada mercado, controla cada embarque paso a paso y conecta con agencias
                aliadas de comercio exterior cuando lo necesites.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/panel" className={buttonStyles("primary", "lg")}>
                  Probar el demo
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href="/documentos" className={buttonStyles("secondary", "lg")}>
                  <FileCheck className="size-4" aria-hidden />
                  Consultar documentos
                </Link>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-rule border-t border-rule pt-6">
                {[
                  { value: documents.length, label: "documentos" },
                  { value: markets.length, label: "mercados" },
                  { value: allyTypes.length, label: "tipos de aliados" },
                ].map((stat) => (
                  <div key={stat.label} className="px-4 first:pl-0">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="display block text-3xl tabular-nums">{stat.value}</span>
                      <span className="text-sm text-muted">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <HeroMockup />
          </div>
        </section>

        {/* Consulta en vivo */}
        <section id="consulta" className="scroll-mt-20 px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Pruébalo ahora"
              title="¿Qué documentos necesita tu exportación?"
              body="Cambia el producto, el destino o la forma de envío y mira cómo cambia la ruta documental."
            />
            <div className="mt-10 rounded-[2rem] border border-rule bg-card p-6 shadow-float sm:p-10">
              <LandingQuery />
            </div>
          </div>
        </section>

        {/* Plataforma TM Core */}
        <section id="plataforma" className="relative scroll-mt-20 border-y border-rule bg-card px-4 py-24 sm:px-6">
          <div aria-hidden className="bg-blueprint absolute inset-0 opacity-70" />
          <div className="relative mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="TM Core AI"
              title="Todo el proceso de internacionalización, conectado"
              body="Cada módulo resuelve una parte de la exportación: en la app, con un aliado especializado o muy pronto con inteligencia artificial."
            />
            <div className="mt-14">
              <CoreCircuit />
            </div>
          </div>
        </section>

        {/* Rutas */}
        <section id="rutas" className="scroll-mt-20 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Dos rutas"
              title="Desde tu fábrica o desde tu tienda en línea"
              body="La ruta define los trámites: una exportación ordinaria y una venta por comercio electrónico no piden los mismos documentos."
            />
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {routes.map((route) => {
                const Icon = routeIcons[route.id];
                return (
                  <article
                    key={route.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-rule bg-card shadow-card transition hover:shadow-float"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-seal-strong via-seal to-trace px-8 py-8 text-white">
                      <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
                      <div className="relative flex items-center justify-between">
                        <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                          <Icon className="size-7" aria-hidden />
                        </span>
                        <span className="eyebrow rounded-full bg-white/15 px-3 py-1 text-white">{route.tagline}</span>
                      </div>
                      <h3 className="display relative mt-6 text-3xl sm:text-4xl">{route.name}</h3>
                    </div>
                    <div className="px-8 py-7">
                      <p className="text-muted">{route.description}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {route.modes.map((mode) => (
                          <li key={mode} className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-sm ring-1 ring-rule">
                            <Check className="size-3.5 text-seal" aria-hidden />
                            {modeLabels[mode]}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/documentos?ruta=${route.id}&modo=${route.modes[0]}`}
                        className="mt-7 inline-flex items-center gap-1.5 font-medium text-seal hover:underline"
                      >
                        Ver documentos de esta ruta
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mercados */}
        <section id="mercados" className="scroll-mt-20 bg-card px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Mercados internacionales"
              title="Requisitos de seis mercados, en un solo lugar"
              body="Acuerdos comerciales, idioma de etiquetado y requisitos de ingreso de cada destino."
            />
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {markets.map((market) => (
                <li key={market.id}>
                  <Link
                    href={`/documentos?mercado=${market.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-rule bg-paper/50 p-6 transition hover:-translate-y-0.5 hover:border-seal/40 hover:bg-card hover:shadow-float"
                  >
                    <div className="flex items-center justify-between">
                      <Flag market={market.id} className="h-7 w-10 rounded-md" />
                      <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-seal" aria-hidden />
                    </div>
                    <h3 className="display mt-5 text-xl">{market.name}</h3>
                    <p className="mt-2 text-sm text-muted">{market.agreements}</p>
                    <p className="mt-auto flex items-center gap-1.5 pt-4 text-sm">
                      <Globe className="size-4 text-seal" aria-hidden />
                      Etiquetado: {market.labelLanguage}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Aliados y referidos */}
        <section id="aliados" className="scroll-mt-20 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Aliados estratégicos"
              title="Cuando un trámite te supera, lo refieres"
              body="Trader Marketer conecta tu operación con agencias que ya conocen el trámite, en Colombia y en el país de destino."
            />
            <ol className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              <span aria-hidden className="absolute top-8 right-[16%] left-[16%] hidden h-0.5 bg-gradient-to-r from-trace/10 via-trace to-trace/10 md:block" />
              {referralSteps.map((step, index) => (
                <li key={step.title} className="relative flex flex-col items-center text-center">
                  <span className="relative flex size-16 items-center justify-center rounded-2xl bg-navy text-[#4ccf8c] shadow-float ring-8 ring-paper">
                    <step.icon className="size-7" aria-hidden />
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-seal text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-muted">{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-16 rounded-[2rem] border border-rule bg-card p-6 shadow-card sm:p-8">
              <p className="eyebrow text-center text-muted">Todos los aliados que forman parte del ecosistema</p>
              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {allyTypes.map((type) => {
                  const Icon = allyTypeIcons[type.id];
                  return (
                    <li key={type.id}>
                      <Link
                        href={`/aliados?tipo=${type.id}`}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition hover:bg-seal-tint hover:text-seal-strong"
                      >
                        <Icon className="size-4 shrink-0 text-seal" aria-hidden />
                        {type.plural}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* Anunciantes */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-white sm:px-12">
            <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
            <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-trace/25 blur-3xl" />
            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <p className="eyebrow text-[#6fd3a0]">Para agencias de comercio exterior</p>
                <h2 className="display mt-3 text-balance text-3xl sm:text-4xl">
                  Aparece justo cuando un exportador necesita tu servicio
                </h2>
                <p className="mt-4 max-w-xl text-white/70">
                  Espacios patrocinados dentro de la ruta documental, el directorio y cada operación, segmentados por producto,
                  mercado y tipo de trámite.
                </p>
                <a
                  href={`mailto:${site.advertiseEmail}?subject=${encodeURIComponent("Quiero anunciar mi agencia")}`}
                  className={cn(buttonStyles("dark", "lg"), "mt-8")}
                >
                  Anunciar mi agencia
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  { icon: Target, title: "Audiencia calificada", body: "Pymes que están preparando una exportación real." },
                  { icon: MousePointerClick, title: "Espacios contextuales", body: "Tu agencia aparece junto al documento que resuelves." },
                  { icon: Handshake, title: "Referidos rastreables", body: "Cada contacto llega con un código y los datos de la operación." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2fae6d]/20 text-[#6fd3a0]">
                      <item.icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{item.title}</span>
                      <span className="text-sm text-white/65">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="display text-lg">Trader Marketer</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">
              De tu fábrica al mundo. Documentos, operaciones y aliados de comercio exterior para pymes latinoamericanas.
            </p>
          </div>
          <FooterColumn
            title="Producto"
            links={[
              { href: "/panel", label: "Panel" },
              { href: "/documentos", label: "Documentos" },
              { href: "/operaciones", label: "Operaciones" },
            ]}
          />
          <FooterColumn
            title="Red"
            links={[
              { href: "/aliados", label: "Directorio de aliados" },
              { href: "/referidos", label: "Referidos" },
              { href: `mailto:${site.advertiseEmail}`, label: "Anunciantes" },
            ]}
          />
        </div>
        <div className="border-t border-rule">
          <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted sm:px-6">
            © {new Date().getFullYear()} {site.name}. Información de referencia para exportaciones desde Colombia: valida cada
            operación con un agente de aduanas. Directorio y datos de demostración.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-seal">{eyebrow}</p>
      <h2 className="display mt-3 text-balance text-3xl sm:text-[2.6rem]">{title}</h2>
      <p className="mt-4 text-lg text-muted">{body}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-seal">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
