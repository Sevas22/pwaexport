import Link from "next/link";
import { ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import { allies } from "@/data/allies";
import { getAllyType } from "@/data/catalog";
import type { AllyTypeId, MarketId } from "@/lib/types";
import { Avatar, cn } from "@/components/ui";

// Espacio publicitario contextual: muestra un aliado patrocinado relevante para
// lo que el usuario está haciendo (tipo de servicio y mercado). Es el inventario
// que se vende a los anunciantes.

export function SponsoredAlly({
  types,
  market,
  className,
}: {
  types?: AllyTypeId[];
  market?: MarketId;
  className?: string;
}) {
  const sponsored = allies.filter((ally) => ally.sponsored);
  const matches = (strict: boolean) =>
    sponsored.find(
      (ally) =>
        (!types?.length || types.includes(ally.type)) && (!strict || !market || ally.markets.includes(market)),
    );
  const ally = matches(true) ?? matches(false) ?? sponsored[0];
  if (!ally) return null;

  return (
    <aside
      className={cn("relative overflow-hidden rounded-2xl border border-amber/25 bg-card shadow-card print:hidden", className)}
      aria-label="Aliado patrocinado"
    >
      <div aria-hidden className="absolute -top-10 -right-10 size-32 rounded-full bg-amber/10 blur-2xl" />
      <div className="relative p-5">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-tint px-2.5 py-1 text-xs font-medium text-amber">
          <Sparkles className="size-3.5" aria-hidden />
          Patrocinado
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Avatar name={ally.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{ally.name}</p>
            <p className="text-sm text-muted">
              {getAllyType(ally.type).name} · {ally.city}
            </p>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-1.5 text-sm">
          {ally.services.slice(0, 3).map((service) => (
            <li key={service} className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-seal" aria-hidden />
              {service}
            </li>
          ))}
        </ul>
        {ally.responseTime && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden />
            {ally.responseTime}
          </p>
        )}
        <Link
          href={`/aliados/${ally.id}`}
          className="mt-4 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-navy text-sm font-medium text-white transition hover:bg-navy-2"
        >
          Conocer aliado
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
