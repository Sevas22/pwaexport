"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useAppStore, useHydrated } from "@/lib/store";

const today = () =>
  new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

/** Barra superior de escritorio: fecha, aviso de demostración y usuario. */
export function TopBar() {
  const hydrated = useHydrated();
  const profile = useAppStore((state) => state.profile);

  return (
    <div className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-rule bg-paper/85 px-10 backdrop-blur lg:flex print:hidden">
      <p className="text-sm text-muted first-letter:uppercase">{hydrated ? today() : " "}</p>
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber-tint px-3 py-1 text-xs font-medium text-amber">
          <Sparkles className="size-3.5" aria-hidden />
          Modo demostración
        </span>
        {hydrated && profile.company && (
          <Link href="/perfil" className="flex items-center gap-3 rounded-xl py-1 pr-1 pl-3 hover:bg-card">
            <span className="text-right leading-tight">
              <span className="block text-sm font-medium">{profile.contactName}</span>
              <span className="block text-xs text-muted">{profile.company}</span>
            </span>
            <Avatar name={profile.contactName || profile.company} size="sm" />
          </Link>
        )}
      </div>
    </div>
  );
}
