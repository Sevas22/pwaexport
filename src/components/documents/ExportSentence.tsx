"use client";

import { ChevronDown } from "lucide-react";
import {
  categories,
  isCategoryId,
  isMarketId,
  isRouteId,
  markets,
  modeLabels,
  modesFor,
  routes,
} from "@/data/catalog";
import type { ExportSelection, TransportMode } from "@/lib/types";
import { cn } from "@/components/ui";

export const defaultSelection: ExportSelection = {
  route: "ordinaria",
  category: "alimentos-procesados",
  market: "us",
  mode: "maritimo",
};

/** Normaliza una selección (por ejemplo, desde la URL) a una combinación válida. */
export function normalizeSelection(input: {
  route?: string | null;
  category?: string | null;
  market?: string | null;
  mode?: string | null;
}): ExportSelection {
  const route = isRouteId(input.route) ? input.route : defaultSelection.route;
  const market = isMarketId(input.market) ? input.market : defaultSelection.market;
  const category = isCategoryId(input.category) ? input.category : defaultSelection.category;
  const modes = modesFor(route, market);
  const mode = modes.includes(input.mode as TransportMode) ? (input.mode as TransportMode) : modes[0];
  return { route, market, category, mode };
}

export function selectionToQuery(sel: ExportSelection) {
  return new URLSearchParams({
    ruta: sel.route,
    categoria: sel.category,
    mercado: sel.market,
    modo: sel.mode,
  }).toString();
}

interface ExportSentenceProps {
  value: ExportSelection;
  onChange: (value: ExportSelection) => void;
  size?: "hero" | "compact";
}

/** La pregunta central de la app, escrita como frase: “Exporto ___ a ___ vía ___”. */
export function ExportSentence({ value, onChange, size = "compact" }: ExportSentenceProps) {
  const hero = size === "hero";

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2.5 gap-y-2",
        hero ? "display text-[1.6rem] leading-snug sm:text-[2.1rem]" : "text-lg sm:text-xl",
      )}
    >
      <span>Exporto</span>
      <InlineSelect
        label="Categoría de producto"
        hero={hero}
        value={value.category}
        onChange={(category) => onChange(normalizeSelection({ ...value, category }))}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name.toLowerCase()}
          </option>
        ))}
      </InlineSelect>
      <span>a</span>
      <InlineSelect
        label="Mercado de destino"
        hero={hero}
        value={value.market}
        onChange={(market) => onChange(normalizeSelection({ ...value, market }))}
      >
        {markets.map((market) => (
          <option key={market.id} value={market.id}>
            {market.name}
          </option>
        ))}
      </InlineSelect>
      <span>vía</span>
      <InlineSelect
        label="Ruta y modo de envío"
        hero={hero}
        value={`${value.route}:${value.mode}`}
        onChange={(combined) => {
          const [route, mode] = combined.split(":");
          onChange(normalizeSelection({ ...value, route, mode }));
        }}
      >
        {routes.map((route) => (
          <optgroup key={route.id} label={route.name}>
            {modesFor(route.id, value.market).map((mode) => (
              <option key={mode} value={`${route.id}:${mode}`}>
                {modeLabels[mode].toLowerCase()}
              </option>
            ))}
          </optgroup>
        ))}
      </InlineSelect>
    </p>
  );
}

function InlineSelect({
  label,
  value,
  onChange,
  hero,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hero: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-flex max-w-full items-center">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "max-w-full cursor-pointer appearance-none truncate border-b-2 border-seal bg-transparent pr-7 text-seal [field-sizing:content] hover:border-seal-strong hover:text-seal-strong focus:outline-none focus-visible:rounded-sm",
          hero ? "pb-0.5" : "pb-0 font-medium",
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className={cn("pointer-events-none absolute right-0 text-seal", hero ? "size-6" : "size-4")}
      />
    </span>
  );
}
