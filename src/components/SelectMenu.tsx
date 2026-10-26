"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/components/ui";

// Desplegable propio. El <select> nativo abre una lista del sistema operativo
// que ignora el tema de la app (en oscuro sale blanca y casi ilegible) y no
// admite banderas ni descripciones.

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  group?: string;
}

interface SelectMenuProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Texto para lectores de pantalla. */
  label: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "start" | "end";
  /** Contenido del botón; por defecto, el icono y la etiqueta de la opción. */
  children?: (selected: SelectOption | undefined) => React.ReactNode;
}

export function SelectMenu({
  value,
  options,
  onChange,
  label,
  className,
  buttonClassName,
  menuClassName,
  align = "start",
  children,
}: SelectMenuProps) {
  const listId = useId();
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)));

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setActive(Math.max(0, options.findIndex((option) => option.value === value)));
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (current + delta + options.length) % options.length);
    }
    if (event.key === "Home") setActive(0);
    if (event.key === "End") setActive(options.length - 1);
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    }
  }

  // La cabecera de grupo se calcula antes de pintar, sin mutar nada en el render.
  const items = options.map((option, index) => ({
    option,
    index,
    showGroup: Boolean(option.group) && option.group !== options[index - 1]?.group,
  }));

  return (
    <div ref={container} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setActive(Math.max(0, options.findIndex((option) => option.value === value)));
          setOpen((current) => !current);
        }}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        className={cn("flex items-center gap-2", buttonClassName)}
      >
        {children ? (
          children(selected)
        ) : (
          <>
            {selected?.icon}
            <span className="truncate">{selected?.label ?? label}</span>
          </>
        )}
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute top-full z-50 mt-2 max-h-72 min-w-full overflow-y-auto overscroll-contain rounded-2xl border border-rule bg-card py-1.5 text-left shadow-float",
            align === "end" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {items.map(({ option, index, showGroup }) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                {showGroup && <p className="eyebrow px-3 pt-2.5 pb-1 text-muted">{option.group}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => choose(index)}
                  onMouseEnter={() => setActive(index)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.95rem] whitespace-nowrap transition-colors",
                    index === active && "bg-paper",
                    isSelected && "font-medium text-seal-strong",
                  )}
                >
                  {option.icon}
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.hint && <span className="text-xs text-muted">{option.hint}</span>}
                  {isSelected && <Check className="size-4 shrink-0 text-seal" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
