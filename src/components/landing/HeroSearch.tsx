"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { CountryFlag } from "@/components/CountryFlag";
import { SelectMenu } from "@/components/SelectMenu";
import { cn } from "@/components/ui";
import { defaultDestination, defaultOrigin, destinationCountries, getOrigin, originCountries } from "@/data/countries";
import { filterSuggestions, searchExamples } from "@/data/suggestions";

/** Buscador principal: qué exporta, desde dónde y hacia dónde. */
export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const suggestions = open ? filterSuggestions(query) : [];
  const originCoverage = getOrigin(origin)?.coverage;

  function generate(nextQuery = query, nextDestination = destination) {
    const clean = nextQuery.trim();
    if (clean.length < 3) return;
    setOpen(false);
    router.push(`/informe?q=${encodeURIComponent(clean)}&desde=${origin}&pais=${nextDestination}`);
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
        className="rounded-3xl border border-rule bg-card p-2.5 shadow-float"
      >
        <div className="relative">
          <label className="relative block">
            <span className="sr-only">Producto o partida arancelaria</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden />
            <input
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
              className="h-12 w-full rounded-2xl bg-transparent pr-3 pl-12 text-[1.05rem] placeholder:text-muted/70 focus:outline-none"
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
                    <span className="hidden shrink-0 text-xs text-muted sm:block">{item.hint}</span>
                    <span className="shrink-0 font-mono text-xs text-seal">{item.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-rule pt-2.5 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center">
            <SelectMenu
              label="País desde donde exportas"
              value={origin}
              onChange={setOrigin}
              options={originCountries.map((country) => ({
                value: country.code,
                label: country.name,
                hint: country.coverage === "parcial" ? "cobertura parcial" : undefined,
                icon: <CountryFlag code={country.code} />,
              }))}
              className="min-w-0 flex-1"
              buttonClassName="w-full justify-between rounded-xl px-3 py-2.5 hover:bg-paper"
              menuClassName="w-64"
            >
              {(selected) => (
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-sm text-muted">Desde</span>
                  <CountryFlag code={origin} />
                  <span className="truncate font-medium">{selected?.label}</span>
                </span>
              )}
            </SelectMenu>

            <ArrowRight className="hidden size-4 shrink-0 text-muted sm:block" aria-hidden />

            <SelectMenu
              label="País a donde exportas"
              value={destination}
              onChange={setDestination}
              options={destinationCountries.map((country) => ({
                value: country.code,
                label: country.name,
                icon: <CountryFlag code={country.code} />,
              }))}
              align="end"
              className="min-w-0 flex-1"
              buttonClassName="w-full justify-between rounded-xl px-3 py-2.5 hover:bg-paper"
              menuClassName="w-64"
            >
              {(selected) => (
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-sm text-muted">Hacia</span>
                  <CountryFlag code={destination} />
                  <span className="truncate font-medium">{selected?.label}</span>
                </span>
              )}
            </SelectMenu>
          </div>

          <button
            type="submit"
            disabled={query.trim().length < 3}
            className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl sm:w-auto bg-gradient-to-b from-seal to-seal-strong px-5 font-medium text-on-seal transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="size-4" aria-hidden />
            Generar informe
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </form>

      {originCoverage === "parcial" && (
        <p className="mt-3 text-center text-sm text-amber">
          Para {getOrigin(origin)?.name} cubrimos los requisitos del país de destino. El checklist de trámites de salida,
          por ahora, está completo solo para Colombia.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted">Prueba con:</span>
        {searchExamples.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => {
              setQuery(example.query);
              setDestination(example.destination);
              generate(example.query, example.destination);
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
