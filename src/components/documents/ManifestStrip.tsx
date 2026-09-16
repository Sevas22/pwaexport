import { ORIGIN, getMarket, getRoute, modeLabels } from "@/data/catalog";
import type { ExportSelection } from "@/lib/types";
import { cn } from "@/components/ui";

/** Línea de datos tipo manifiesto: origen ▸ destino · modo · ruta. */
export function ManifestStrip({
  selection,
  extra = [],
  className,
}: {
  selection: ExportSelection;
  extra?: string[];
  className?: string;
}) {
  const market = getMarket(selection.market);
  const items = [
    `${ORIGIN.code} ▸ ${market.code}`,
    modeLabels[selection.mode],
    getRoute(selection.route).tagline,
    ...extra,
  ];

  return (
    <ul className={cn("flex flex-wrap gap-1.5 font-mono text-[0.7rem] uppercase tracking-wide text-muted", className)}>
      {items.map((item) => (
        <li key={item} className="rounded border border-rule px-1.5 py-0.5">
          {item}
        </li>
      ))}
    </ul>
  );
}
