"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileCheck, Handshake, LayoutDashboard, Package, Plus, Send, Settings } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Avatar, cn } from "@/components/ui";
import { useAppStore, useHydrated } from "@/lib/store";

const groups = [
  {
    label: "Exportar",
    items: [
      { href: "/panel", label: "Panel", icon: LayoutDashboard },
      { href: "/documentos", label: "Documentos", icon: FileCheck },
      { href: "/operaciones", label: "Operaciones", icon: Package },
    ],
  },
  {
    label: "Red de aliados",
    items: [
      { href: "/aliados", label: "Aliados", icon: Handshake },
      { href: "/referidos", label: "Referidos", icon: Send },
    ],
  },
];

const mobileItems = [groups[0].items[0], groups[0].items[1], groups[0].items[2], ...groups[1].items];

export function AppNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const profile = useAppStore((state) => state.profile);
  const openReferrals = useAppStore(
    (state) => state.referrals.filter((ref) => ref.status !== "cerrado" && ref.status !== "descartado").length,
  );
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const company = hydrated && profile.company ? profile.company : "Mi empresa";

  return (
    <>
      {/* Escritorio: barra lateral */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-hidden bg-navy text-white lg:flex">
        <CircuitDecoration />
        <Link href="/" className="relative flex items-center gap-3 px-6 pt-7 pb-8">
          <LogoMark className="size-9 ring-1 ring-white/10" />
          <span className="display text-[1.05rem] leading-tight">
            Trader
            <br />
            Marketer
          </span>
        </Link>

        <div className="relative px-4">
          <Link
            href="/operaciones/nueva"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2fae6d] to-[#1e7a4e] text-sm font-medium shadow-[0_10px_24px_-12px_rgb(47_174_109/0.8)] transition hover:brightness-110"
          >
            <Plus className="size-4" aria-hidden />
            Nueva operación
          </Link>
        </div>

        <nav className="relative mt-6 flex flex-col gap-6 px-4" aria-label="Principal">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow px-3 pb-2 text-white/40">{group.label}</p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.93rem] transition-colors",
                        isActive(href) ? "bg-white/10 font-medium text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {isActive(href) && (
                        <span aria-hidden className="absolute top-2 bottom-2 -left-4 w-1 rounded-r-full bg-[#2fae6d]" />
                      )}
                      <Icon
                        className={cn("size-[1.1rem]", isActive(href) ? "text-[#4ccf8c]" : "text-white/50 group-hover:text-white/80")}
                        aria-hidden
                      />
                      {label}
                      {href === "/referidos" && hydrated && openReferrals > 0 && (
                        <span className="ml-auto rounded-full bg-[#2fae6d]/20 px-2 py-0.5 text-xs font-medium text-[#6fd3a0]">
                          {openReferrals}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative mt-auto p-4">
          <Link
            href="/perfil"
            aria-current={isActive("/perfil") ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10",
              isActive("/perfil") && "bg-white/10",
            )}
          >
            <Avatar name={company} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{company}</span>
              <span className="block text-xs text-white/50">Plan demostración</span>
            </span>
            <Settings className="size-4 text-white/50" aria-hidden />
          </Link>
        </div>
      </aside>

      {/* Móvil: cabecera y barra inferior */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-navy px-4 text-white lg:hidden">
        <Link href="/panel" className="flex items-center gap-2.5" aria-label="Ir al panel">
          <LogoMark className="size-8 ring-1 ring-white/10" />
          <span className="display text-base">Trader Marketer</span>
        </Link>
        <Link href="/perfil" aria-label="Mi empresa" className="rounded-lg">
          <Avatar name={company} size="sm" />
        </Link>
      </header>
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-rule bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(var(--shadow-color)/0.3)] backdrop-blur lg:hidden"
      >
        {mobileItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[0.66rem]",
              isActive(href) ? "font-medium text-seal-strong" : "text-muted",
            )}
          >
            {isActive(href) && <span aria-hidden className="absolute top-0 h-0.5 w-8 rounded-full bg-seal" />}
            <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", isActive(href) && "bg-seal-tint")}>
              <Icon className="size-5" aria-hidden />
            </span>
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}

/** Pistas de circuito decorativas, como en el diagrama TM Core. */
function CircuitDecoration() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-10 bottom-24 h-80 w-72 opacity-[0.18]"
      viewBox="0 0 280 320"
      fill="none"
      stroke="#4ccf8c"
      strokeWidth="1.5"
    >
      <path d="M280 40H200V120H120" />
      <path d="M280 80H220V180H80" />
      <path d="M280 140H240V240H140V300" />
      <path d="M280 200H260V270H40" />
      <circle cx="120" cy="120" r="4" fill="#4ccf8c" />
      <circle cx="80" cy="180" r="4" fill="#4ccf8c" />
      <circle cx="140" cy="300" r="4" fill="#4ccf8c" />
      <circle cx="40" cy="270" r="4" fill="#4ccf8c" />
    </svg>
  );
}
