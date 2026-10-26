"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Flag } from "@/components/Flag";
import { SelectMenu } from "@/components/SelectMenu";
import { markets } from "@/data/catalog";
import { filterSuggestions, searchExamples } from "@/data/suggestions";
import { cn } from "@/components/ui";
import type { MarketId } from "@/lib/types";

/** Buscador principal: producto o partida arancelaria + mercado de destino. */
export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState<MarketId>("us");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const suggestions = open ? filterSuggestions(query) : [];

  function generate(nextQuery = query, nextMarket = market) {
    const clean = nextQuery.trim();
    if (clean.length < 3) return;
    setOpen(false);
    router.push(`/informe?q=${encodeURIComponent(clean)}&mercado=${nextMarket}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setHighlighted((current) => (current + delta + suggestions.length) % suggestions.length);
    }
    if (event.key === "Enter" && highlighted >= 0) {
      event.preventDefault();
      generate(suggestions[highlighted].label);
    }
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          generate();
        }}
        className="relative rounded-2xl border border-rule bg-card p-2 shadow-float sm:rounded-full"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label className="relative block">
              <span className="sr-only">Producto o partida arancelaria</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                  setHighlighted(-1);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => window.setTimeout(() => setOpen(false), 150)}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded={suggestions.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                autoComplete="off"
                placeholder="¿Qué quieres exportar? Ej.: café tostado o 0901.21"
                className="h-12 w-full min-w-0 rounded-xl bg-transparent pr-3 pl-12 text-[1.05rem] placeholder:text-muted/70 focus:outline-none sm:h-14"
              />
            </label>

            {suggestions.length > 0 && (
              <ul
                id={listId}
                role="listbox"
                aria-label="Sugerencias de producto"
                className="absolute top-full left-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-rule bg-card py-1 text-left shadow-float"
              >
                {suggestions.map((item, index) => (
                  <li key={item.code + item.label}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === highlighted}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => generate(item.label)}
                      onMouseEnter={() => setHighlighted(index)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        index === highlighted ? "bg-seal-tint text-seal-strong" : "hover:bg-paper",
                      )}
                    >
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="shrink-0 text-xs text-muted">{item.hint}</span>
                      <span className="shrink-0 font-mono text-xs text-seal">{item.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SelectMenu
            label="Mercado de destino"
            value={market}
            onChange={(next) => setMarket(next as MarketId)}
            options={markets.map((item) => ({
              value: item.id,
              label: item.name,
              icon: <Flag market={item.id} className="h-4 w-6" />,
            }))}
            align="end"
            className="sm:before:mr-2 sm:before:block sm:before:h-7 sm:before:w-px sm:before:bg-rule sm:flex sm:items-center"
            buttonClassName="w-full justify-between rounded-xl px-3 py-2.5 font-medium ring-1 ring-rule hover:bg-paper sm:w-auto sm:rounded-full sm:py-2 sm:ring-0"
            menuClassName="w-60"
          />

          <button
            type="submit"
            disabled={query.trim().length < 3}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-seal to-seal-strong px-5 font-medium text-on-seal transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-full sm:px-6"
          >
            <Sparkles className="size-4" aria-hidden />
            Generar informe
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted">Prueba con:</span>
        {searchExamples.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => {
              setQuery(example.query);
              setMarket(example.market);
              generate(example.query, example.market);
            }}
            className="rounded-full border border-rule bg-card px-3 py-1.5 text-sm text-muted transition hover:border-seal/40 hover:text-seal-strong"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
