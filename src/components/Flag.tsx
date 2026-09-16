import { Globe } from "lucide-react";
import type { MarketId } from "@/lib/types";
import { cn } from "@/components/ui";

// Banderas simplificadas en SVG (Windows no muestra emojis de banderas).
// Medio Oriente y Latinoamérica son regiones: se representan con un globo.

function star(cx: number, cy: number, r: number, rotation = -90) {
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = ((rotation + i * 36) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

const flags: Partial<Record<MarketId | "co", React.ReactNode>> = {
  co: (
    <>
      <rect width="30" height="10" fill="#FCD116" />
      <rect y="10" width="30" height="5" fill="#003893" />
      <rect y="15" width="30" height="5" fill="#CE1126" />
    </>
  ),
  us: (
    <>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="13" height={(20 / 13) * 7} fill="#3C3B6E" />
      {[2.5, 6.5, 10.5].flatMap((x) =>
        [2.5, 5.7, 8.9].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#fff" />),
      )}
    </>
  ),
  ca: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="7.5" height="20" fill="#D52B1E" />
      <rect x="22.5" width="7.5" height="20" fill="#D52B1E" />
      <polygon
        fill="#D52B1E"
        points="15,3.8 16.3,6.6 17.9,5.9 17.4,9.4 19.5,8.2 20,9.7 21.8,9.3 20.9,11.5 21.8,12.1 17.6,14.8 18.1,16.2 15.4,15.6 15.4,17.6 14.6,17.6 14.6,15.6 11.9,16.2 12.4,14.8 8.2,12.1 9.1,11.5 8.2,9.3 10,9.7 10.5,8.2 12.6,9.4 12.1,5.9 13.7,6.6"
      />
    </>
  ),
  eu: (
    <>
      <rect width="30" height="20" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        return (
          <polygon key={i} fill="#FFCC00" points={star(15 + 6 * Math.cos(angle), 10 + 6 * Math.sin(angle), 1.1)} />
        );
      })}
    </>
  ),
  cn: (
    <>
      <rect width="30" height="20" fill="#DE2910" />
      <polygon fill="#FFDE00" points={star(5.5, 5.5, 3.2)} />
      {[
        [10.5, 2.2],
        [12.5, 4.4],
        [12.5, 7.4],
        [10.5, 9.4],
      ].map(([x, y]) => (
        <polygon key={`${x}-${y}`} fill="#FFDE00" points={star(x, y, 1)} />
      ))}
    </>
  ),
};

export function Flag({ market, className }: { market: MarketId | "co"; className?: string }) {
  const flag = flags[market];
  if (!flag) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex h-4 w-6 shrink-0 items-center justify-center rounded-[3px] bg-sky-tint text-sky ring-1 ring-black/5",
          className,
        )}
      >
        <Globe className="size-3" />
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden
      className={cn("h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10", className)}
    >
      {flag}
    </svg>
  );
}
