"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { glossary, type GlossaryKey } from "@/data/glossary";
import { cn } from "@/components/ui";

/** Término de comercio exterior con su explicación en palabras sencillas. */
export function Term({ name, children, className }: { name: GlossaryKey; children?: React.ReactNode; className?: string }) {
  const entry = glossary[name];
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
        return;
      }
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <span ref={container} className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded underline decoration-dotted decoration-from-font underline-offset-4 hover:text-seal-strong"
      >
        {children ?? entry.term}
        <HelpCircle className="size-3.5 shrink-0 opacity-60" aria-hidden />
        <span className="sr-only">Ver qué significa</span>
      </button>

      {open && (
        <span
          role="dialog"
          aria-label={entry.term}
          // normal-case y font-sans evitan heredar estilos de etiquetas en versalitas.
          className="absolute bottom-full left-1/2 z-40 mb-2 w-72 -translate-x-1/2 rounded-2xl border border-rule bg-card p-4 text-left font-sans text-base tracking-normal text-ink normal-case shadow-float"
        >
          <span className="flex items-start justify-between gap-2">
            <span className="font-semibold">{entry.term}</span>
            <button type="button" onClick={() => setOpen(false)} className="-mt-1 -mr-1 p-1 text-muted hover:text-ink" aria-label="Cerrar">
              <X className="size-4" aria-hidden />
            </button>
          </span>
          <span className="mt-1 block text-sm font-medium text-seal-strong">{entry.short}</span>
          <span className="mt-2 block text-sm leading-relaxed text-muted">{entry.detail}</span>
        </span>
      )}
    </span>
  );
}
