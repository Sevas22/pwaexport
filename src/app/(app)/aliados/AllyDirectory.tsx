"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Clock, LayoutGrid, MapPin, Search, Send, Sparkles } from "lucide-react";
import { Flag } from "@/components/Flag";
import { allyTypeIcons } from "@/components/icons";
import { ReferDialog, type ReferContext } from "@/components/referrals/ReferDialog";
import { Avatar, EmptyState, Input, Select, buttonStyles, cn } from "@/components/ui";
import { allies } from "@/data/allies";
import { allyTypes, getAllyType, getMarket, isAllyTypeId, isMarketId, markets } from "@/data/catalog";

export function AllyDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [refer, setRefer] = useState<ReferContext | null>(null);

  const typeParam = params.get("tipo");
  const marketParam = params.get("mercado");
  const type = isAllyTypeId(typeParam) ? typeParam : undefined;
  const market = isMarketId(marketParam) ? marketParam : undefined;

  function setFilter(key: "tipo" | "mercado", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  const normalized = query.trim().toLowerCase();
  const results = allies
    .filter((ally) => !type || ally.type === type)
    .filter((ally) => !market || ally.markets.includes(market))
    .filter(
      (ally) =>
        !normalized ||
        [ally.name, ally.city, ally.description, ...ally.services].some((text) => text.toLowerCase().includes(normalized)),
    )
    .sort((a, b) => Number(b.sponsored) - Number(a.sponsored));

  const typesWithAllies = allyTypes.filter((item) => allies.some((ally) => ally.type === item.id));

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="relative">
          <span className="sr-only">Buscar aliados</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por servicio, ciudad o nombre"
            className="h-12 pl-10"
          />
        </label>
        <Select aria-label="Mercado" value={market ?? ""} onChange={(event) => setFilter("mercado", event.target.value)} className="h-12">
          <option value="">Todos los mercados</option>
          {markets.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 -mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2" role="group" aria-label="Tipo de aliado">
          <TypeChip active={!type} onClick={() => setFilter("tipo", "")} icon={LayoutGrid} label="Todos" />
          {typesWithAllies.map((item) => (
            <TypeChip
              key={item.id}
              active={type === item.id}
              onClick={() => setFilter("tipo", item.id)}
              icon={allyTypeIcons[item.id]}
              label={item.plural}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        <span className="font-medium text-ink">{results.length}</span> {results.length === 1 ? "aliado" : "aliados"}
        {type && ` · ${getAllyType(type).plural}`}
        {market && ` · ${getMarket(market).name}`}
      </p>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="Ningún aliado coincide con esos filtros" icon={Search}>
            <p>Quita un filtro o busca con otra palabra.</p>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((ally) => {
            const TypeIcon = allyTypeIcons[ally.type];
            return (
              <li
                key={ally.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-float",
                  ally.sponsored ? "border-amber/30" : "border-rule",
                )}
              >
                {ally.sponsored && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-amber-tint px-2 py-0.5 text-xs font-medium text-amber">
                    <Sparkles className="size-3" aria-hidden />
                    Patrocinado
                  </span>
                )}
                <div className="flex items-center gap-3 pr-24">
                  <Avatar name={ally.name} />
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-1.5 font-semibold leading-snug">
                      <Link href={`/aliados/${ally.id}`} className="hover:text-seal-strong">
                        {ally.name}
                      </Link>
                    </h2>
                    <p className="flex items-center gap-1 text-sm text-seal">
                      <TypeIcon className="size-3.5" aria-hidden />
                      {getAllyType(ally.type).name}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-muted">{ally.description}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {ally.services.slice(0, 3).map((service) => (
                    <li key={service} className="rounded-md bg-paper px-2 py-1 text-xs ring-1 ring-rule">
                      {service}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {ally.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden />
                    {ally.responseTime}
                  </span>
                  <span className="flex items-center gap-1" aria-label={`Mercados: ${ally.markets.map((id) => getMarket(id).name).join(", ")}`}>
                    {ally.markets.slice(0, 5).map((id) => (
                      <Flag key={id} market={id} className="h-3 w-[18px]" />
                    ))}
                    {ally.markets.length > 5 && <span>+{ally.markets.length - 5}</span>}
                  </span>
                </div>

                <div className="mt-auto flex gap-2 pt-5">
                  <button type="button" onClick={() => setRefer({ allyId: ally.id })} className={cn(buttonStyles("primary", "sm"), "flex-1")}>
                    <Send className="size-4" aria-hidden />
                    Referir
                  </button>
                  <Link href={`/aliados/${ally.id}`} className={cn(buttonStyles("secondary", "sm"), "flex-1")}>
                    Ver perfil
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ReferDialog context={refer} onClose={() => setRefer(null)} />
    </>
  );
}

function TypeChip({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition-colors",
        active ? "border-navy bg-navy text-white" : "border-rule bg-card text-muted shadow-card hover:border-seal/40 hover:text-ink",
      )}
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  );
}
