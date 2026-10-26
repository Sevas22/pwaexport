"use client";

import { Flag } from "@/components/Flag";
import { SelectMenu, type SelectOption } from "@/components/SelectMenu";
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
        options={categories.map((category) => ({
          value: category.id,
          label: category.name.toLowerCase(),
          hint: category.examples.split(",")[0],
        }))}
      />
      <span>a</span>
      <InlineSelect
        label="Mercado de destino"
        hero={hero}
        value={value.market}
        onChange={(market) => onChange(normalizeSelection({ ...value, market }))}
        options={markets.map((market) => ({
          value: market.id,
          label: market.name,
          icon: <Flag market={market.id} className="h-3.5 w-5" />,
        }))}
      />
      <span>vía</span>
      <InlineSelect
        label="Ruta y modo de envío"
        hero={hero}
        value={`${value.route}:${value.mode}`}
        onChange={(combined) => {
          const [route, mode] = combined.split(":");
          onChange(normalizeSelection({ ...value, route, mode }));
        }}
        options={routes.flatMap((route) =>
          modesFor(route.id, value.market).map((mode) => ({
            value: `${route.id}:${mode}`,
            label: modeLabels[mode].toLowerCase(),
            group: route.name,
          })),
        )}
      />
    </p>
  );
}

function InlineSelect({
  label,
  value,
  onChange,
  hero,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hero: boolean;
  options: SelectOption[];
}) {
  return (
    <SelectMenu
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className="inline-flex max-w-full align-baseline"
      buttonClassName={cn(
        "max-w-full border-b-2 border-seal text-seal hover:border-seal-strong hover:text-seal-strong focus-visible:rounded-sm",
        hero ? "pb-0.5" : "pb-0 font-medium",
      )}
      menuClassName="min-w-56 text-base font-normal tracking-normal text-ink"
    />
  );
}
