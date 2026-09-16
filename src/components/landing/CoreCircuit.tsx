import { BrainCircuit } from "lucide-react";
import { moduleIcons } from "@/components/icons";
import { IconTile, cn } from "@/components/ui";
import { coreModules, type CoreModule, type ModuleKind } from "@/data/modules";

// Réplica interactiva del diagrama TM Core: el teléfono en el centro y los
// módulos conectados por pistas de circuito a cada lado.

const W = 1200;
const H = 600;
const PHONE = { x: 520, y: 110, w: 160, h: 380 };

const leftIds = ["investigacion", "clasificacion", "marketing", "prospeccion", "crm", "cotizaciones", "contratos", "analitica"];
const rightIds = ["documentos", "operaciones", "referidos", "medios-pago", "factoring", "financiacion", "seguros", "logistica", "tracking"];

const byId = (id: string) => coreModules.find((module) => module.id === id)!;

const kindStyles: Record<ModuleKind, { dot: string; label: string; tone: "seal" | "sky" | "muted" }> = {
  app: { dot: "bg-trace", label: "Disponible en la app", tone: "seal" },
  aliados: { dot: "bg-sky", label: "Con aliados", tone: "sky" },
  "hoja-de-ruta": { dot: "bg-muted/50", label: "Próximamente", tone: "muted" },
};

function layout(ids: string[], side: "left" | "right") {
  const n = ids.length;
  return ids.map((id, i) => {
    const y = 60 + (i * 480) / (n - 1);
    const ty = PHONE.y + 70 + (i * (PHONE.h - 140)) / (n - 1);
    const k = Math.min(i, n - 1 - i);
    const anchor = side === "left" ? 360 : 840;
    const turn = side === "left" ? 500 - k * 18 : 700 + k * 18;
    const edge = side === "left" ? PHONE.x : PHONE.x + PHONE.w;
    const d = Math.abs(y - ty) < 1 ? `M${anchor} ${y}H${edge}` : `M${anchor} ${y}H${turn}V${ty}H${edge}`;
    return { module: byId(id), y, ty, d, anchor, edge };
  });
}

const left = layout(leftIds, "left");
const right = layout(rightIds, "right");

export function CoreCircuit() {
  return (
    <div>
      {/* Escritorio */}
      <div className="relative mx-auto hidden aspect-[2/1] w-full max-w-5xl lg:block">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
          {[...left, ...right].map(({ module, d, anchor, y, edge, ty }, index) => (
            <g key={module.id}>
              <path d={d} fill="none" strokeWidth="2" className="stroke-trace/30" />
              <path
                d={d}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-trace stroke-trace"
                style={{ animationDelay: `${(index % 6) * 0.45}s` }}
              />
              <circle cx={anchor} cy={y} r="4" className="fill-card stroke-trace" strokeWidth="2" />
              <circle cx={edge} cy={ty} r="2.5" className="fill-trace" />
            </g>
          ))}
        </svg>

        {left.map(({ module, y }) => (
          <ModuleLabel key={module.id} module={module} side="left" style={{ right: `${((W - 360 + 14) / W) * 100}%`, top: `${(y / H) * 100}%` }} />
        ))}
        {right.map(({ module, y }) => (
          <ModuleLabel key={module.id} module={module} side="right" style={{ left: `${((840 + 14) / W) * 100}%`, top: `${(y / H) * 100}%` }} />
        ))}

        <div
          className="absolute"
          style={{
            left: `${(PHONE.x / W) * 100}%`,
            top: `${(PHONE.y / H) * 100}%`,
            width: `${(PHONE.w / W) * 100}%`,
            height: `${(PHONE.h / H) * 100}%`,
          }}
        >
          <PhoneCore />
        </div>
      </div>

      {/* Móvil y tableta */}
      <div className="lg:hidden">
        <div className="mx-auto h-72 w-40">
          <PhoneCore />
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[...right, ...left].map(({ module }) => (
            <li key={module.id}>
              <ModuleChip module={module} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
        {Object.entries(kindStyles).map(([kind, style]) => (
          <li key={kind} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", style.dot)} aria-hidden />
            {style.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhoneCore() {
  return (
    <div className="flex size-full flex-col rounded-[1.6rem] bg-navy p-1.5 shadow-[0_30px_60px_-24px_rgb(11_34_57/0.6)] ring-1 ring-white/10">
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.25rem] bg-card px-3 text-center">
        <span className="absolute top-2 h-2.5 w-10 rounded-full bg-navy/90" aria-hidden />
        <span className="flex size-14 items-center justify-center rounded-2xl bg-seal-tint text-seal shadow-glow">
          <BrainCircuit className="size-8" aria-hidden />
        </span>
        <p className="display mt-3 text-lg">
          TM Core <span className="text-seal">AI</span>
        </p>
        <p className="mt-1.5 text-[0.62rem] leading-snug text-muted">
          El cerebro que automatiza y coordina la internacionalización de tu pyme
        </p>
      </div>
    </div>
  );
}

function ModuleLabel({ module, side, style }: { module: CoreModule; side: "left" | "right"; style: React.CSSProperties }) {
  const kind = kindStyles[module.kind];
  return (
    <div
      className={cn("absolute flex -translate-y-1/2 items-center gap-2.5", side === "left" && "flex-row-reverse text-right")}
      style={style}
    >
      <IconTile icon={moduleIcons[module.id]} tone={kind.tone} size="sm" className="bg-card shadow-card ring-1 ring-rule" />
      <span className="flex items-center gap-1.5 text-[0.8rem] leading-tight font-medium whitespace-nowrap">
        {side === "right" && <span className={cn("size-1.5 rounded-full", kind.dot)} aria-hidden />}
        {module.name}
        {side === "left" && <span className={cn("size-1.5 rounded-full", kind.dot)} aria-hidden />}
      </span>
    </div>
  );
}

function ModuleChip({ module }: { module: CoreModule }) {
  const kind = kindStyles[module.kind];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-rule bg-card p-2.5 shadow-card">
      <IconTile icon={moduleIcons[module.id]} tone={kind.tone} size="sm" />
      <span className="flex-1 text-sm font-medium">{module.name}</span>
      <span className={cn("size-2 rounded-full", kind.dot)} aria-label={kind.label} />
    </div>
  );
}
