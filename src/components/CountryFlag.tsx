import { cn } from "@/components/ui";

// Banderas simplificadas en SVG: Windows no dibuja los emojis de bandera.
// Son representaciones esquemáticas, suficientes para identificar el país de
// un vistazo; los países que no están aquí usan su código de dos letras.

const stripesH = (colors: string[]) => (
  <>
    {colors.map((color, index) => (
      <rect key={index} y={(index * 20) / colors.length} width="30" height={20 / colors.length} fill={color} />
    ))}
  </>
);

const stripesV = (colors: string[]) => (
  <>
    {colors.map((color, index) => (
      <rect key={index} x={(index * 30) / colors.length} width={30 / colors.length} height="20" fill={color} />
    ))}
  </>
);

function star(cx: number, cy: number, r: number, rotation = -90) {
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = ((rotation + i * 36) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

const flags: Record<string, React.ReactNode> = {
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
  co: (
    <>
      <rect width="30" height="10" fill="#FCD116" />
      <rect y="10" width="30" height="5" fill="#003893" />
      <rect y="15" width="30" height="5" fill="#CE1126" />
    </>
  ),
  ve: stripesH(["#FFCC00", "#00247D", "#CF142B"]),
  ec: (
    <>
      <rect width="30" height="10" fill="#FFDD00" />
      <rect y="10" width="30" height="5" fill="#0033A0" />
      <rect y="15" width="30" height="5" fill="#CE1126" />
    </>
  ),
  pe: stripesV(["#D91023", "#FFFFFF", "#D91023"]),
  cl: (
    <>
      <rect width="30" height="10" fill="#FFFFFF" />
      <rect y="10" width="30" height="10" fill="#D52B1E" />
      <rect width="10" height="10" fill="#0039A6" />
      <polygon fill="#FFFFFF" points={star(5, 5, 3)} />
    </>
  ),
  mx: (
    <>
      {stripesV(["#006847", "#FFFFFF", "#CE1126"])}
      <circle cx="15" cy="10" r="2.5" fill="#8C6239" />
    </>
  ),
  br: (
    <>
      <rect width="30" height="20" fill="#009739" />
      <polygon fill="#FEDD00" points="15,2.5 27,10 15,17.5 3,10" />
      <circle cx="15" cy="10" r="4" fill="#012169" />
    </>
  ),
  ar: (
    <>
      {stripesH(["#75AADB", "#FFFFFF", "#75AADB"])}
      <circle cx="15" cy="10" r="2.2" fill="#FCBF49" />
    </>
  ),
  pa: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect x="15" width="15" height="10" fill="#D21034" />
      <rect y="10" width="15" height="10" fill="#005293" />
      <polygon fill="#005293" points={star(7.5, 5, 2.6)} />
      <polygon fill="#D21034" points={star(22.5, 15, 2.6)} />
    </>
  ),
  cr: (
    <>
      <rect width="30" height="20" fill="#002B7F" />
      <rect y="4" width="30" height="12" fill="#FFFFFF" />
      <rect y="7" width="30" height="6" fill="#CE1126" />
    </>
  ),
  do: (
    <>
      <rect width="30" height="20" fill="#002D62" />
      <rect y="10" width="15" height="10" fill="#CE1126" />
      <rect x="15" width="15" height="10" fill="#CE1126" />
      <rect x="12.5" width="5" height="20" fill="#FFFFFF" />
      <rect y="7.5" width="30" height="5" fill="#FFFFFF" />
    </>
  ),
  es: (
    <>
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </>
  ),
  de: stripesH(["#000000", "#DD0000", "#FFCE00"]),
  nl: stripesH(["#AE1C28", "#FFFFFF", "#21468B"]),
  fr: stripesV(["#002395", "#FFFFFF", "#ED2939"]),
  it: stripesV(["#008C45", "#F4F5F0", "#CD212A"]),
  pt: (
    <>
      <rect width="30" height="20" fill="#DA291C" />
      <rect width="12" height="20" fill="#006600" />
      <circle cx="12" cy="10" r="3.2" fill="#FFE900" />
    </>
  ),
  be: stripesV(["#000000", "#FDDA24", "#EF3340"]),
  gb: (
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M15 0V20M0 10H30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="3.5" />
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
  jp: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="5" fill="#BC002D" />
    </>
  ),
  kr: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="4.5" fill="#CD2E3A" />
      <path d="M10.5 10a4.5 4.5 0 019 0 2.25 2.25 0 01-4.5 0 2.25 2.25 0 00-4.5 0z" fill="#0047A0" />
    </>
  ),
  ae: (
    <>
      {stripesH(["#00732F", "#FFFFFF", "#000000"])}
      <rect width="7.5" height="20" fill="#FF0000" />
    </>
  ),
  sa: (
    <>
      <rect width="30" height="20" fill="#006C35" />
      <rect x="6" y="8.5" width="18" height="1.6" fill="#FFFFFF" />
      <rect x="6" y="12" width="14" height="1.2" fill="#FFFFFF" />
    </>
  ),
  il: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect y="2.5" width="30" height="2.6" fill="#0038B8" />
      <rect y="14.9" width="30" height="2.6" fill="#0038B8" />
      <path d="M15 6.5l3.5 6h-7zM15 13.5l-3.5-6h7z" fill="none" stroke="#0038B8" strokeWidth="1" />
    </>
  ),
  tr: (
    <>
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="12" cy="10" r="4" fill="#FFFFFF" />
      <circle cx="13.6" cy="10" r="3.2" fill="#E30A17" />
      <polygon fill="#FFFFFF" points={star(18.5, 10, 2)} />
    </>
  ),
};

export function CountryFlag({ code, className }: { code: string; className?: string }) {
  const flag = flags[code.toLowerCase()];

  if (!flag) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex h-4 w-6 shrink-0 items-center justify-center rounded-[3px] bg-paper text-[0.6rem] font-semibold text-muted uppercase ring-1 ring-rule",
          className,
        )}
      >
        {code.slice(0, 2)}
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
