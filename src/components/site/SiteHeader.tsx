"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { navigation } from "@/data/navigation";
import { buttonStyles, cn } from "@/components/ui";

/** Cabecera del sitio público: secciones con sus subpáginas. */
export function SiteHeader() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openSection) return;
    const close = (event: MouseEvent) => {
      if (!nav.current?.contains(event.target as Node)) setOpenSection(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openSection]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>

        <nav ref={nav} className="hidden items-center lg:flex" aria-label="Principal">
          {navigation.map((section) => {
            const active = pathname.startsWith(`/${section.slug}`);
            return (
              <div key={section.slug} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenSection((current) => (current === section.slug ? null : section.slug))}
                  aria-expanded={openSection === section.slug}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "font-medium text-seal-strong" : "text-muted hover:text-ink",
                  )}
                >
                  {section.label}
                  <ChevronDown
                    className={cn("size-3.5 transition-transform", openSection === section.slug && "rotate-180")}
                    aria-hidden
                  />
                </button>

                {openSection === section.slug && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-80 rounded-2xl border border-rule bg-card p-2 shadow-float">
                    <Link
                      href={`/${section.slug}`}
                      className="block rounded-xl px-3 py-2.5 hover:bg-paper"
                      onClick={() => setOpenSection(null)}
                    >
                      <span className="font-medium">Ver {section.label}</span>
                      <span className="mt-0.5 block text-sm text-muted">{section.summary}</span>
                    </Link>
                    <ul className="mt-1 border-t border-rule pt-1">
                      {section.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={child.href ?? `/${section.slug}/${child.slug}`}
                            className="block rounded-xl px-3 py-2 text-sm hover:bg-paper hover:text-seal-strong"
                            onClick={() => setOpenSection(null)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/panel" className={cn(buttonStyles("primary", "sm"), "hidden sm:inline-flex")}>
            Entrar
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-label="Menú"
            className="flex size-10 items-center justify-center rounded-xl text-muted hover:bg-card hover:text-ink lg:hidden"
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[70dvh] overflow-y-auto border-t border-rule bg-card px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {navigation.map((section) => (
              <li key={section.slug}>
                <Link href={`/${section.slug}`} onClick={() => setMobileOpen(false)} className="font-medium">
                  {section.label}
                </Link>
                <ul className="mt-1.5 flex flex-col border-l border-rule pl-3">
                  {section.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={child.href ?? `/${section.slug}/${child.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-sm text-muted hover:text-seal-strong"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <Link href="/panel" onClick={() => setMobileOpen(false)} className={cn(buttonStyles("primary"), "mt-5 w-full")}>
            Entrar a la plataforma
          </Link>
        </div>
      )}
    </header>
  );
}
