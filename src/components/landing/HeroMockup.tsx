import { Check, CircleDashed, LoaderCircle, Send } from "lucide-react";
import { Flag } from "@/components/Flag";
import { stageIcons } from "@/components/icons";
import { Avatar, ProgressRing, cn } from "@/components/ui";
import type { StageId } from "@/lib/types";

// Vista previa ilustrativa del producto para el hero de la landing.

const stages: { id: StageId; name: string; done: number; total: number }[] = [
  { id: "preparacion", name: "Preparación", done: 9, total: 9 },
  { id: "origen", name: "Aduana de salida", done: 2, total: 4 },
  { id: "transporte", name: "Transporte", done: 0, total: 2 },
  { id: "destino", name: "Ingreso al destino", done: 0, total: 1 },
  { id: "cobro", name: "Cobro y divisas", done: 0, total: 2 },
];

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] pt-6 pb-10 lg:pt-0">
      <div aria-hidden className="absolute inset-x-6 top-16 bottom-4 rounded-full bg-trace/25 blur-3xl" />

      {/* Teléfono */}
      <div className="relative mx-auto w-[17.5rem] rounded-[2.6rem] bg-navy p-2.5 shadow-[0_40px_80px_-30px_rgb(11_34_57/0.55)] ring-1 ring-white/10 sm:w-[19rem]">
        <div className="overflow-hidden rounded-[2.1rem] bg-paper">
          <div className="flex items-center justify-between bg-navy px-6 pt-3 pb-4 text-[0.65rem] text-white/80">
            <span>9:41</span>
            <span className="h-4 w-16 rounded-full bg-black/60" />
            <span>5G</span>
          </div>
          <div className="bg-navy px-5 pb-5 text-white">
            <p className="font-mono text-[0.65rem] text-[#6fd3a0]">EXP-2026-0002</p>
            <p className="mt-0.5 text-[0.95rem] font-semibold">Cacao en grano fino de aroma</p>
            <div className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-white/70">
              <Flag market="co" className="h-2.5 w-4" />
              <span>→</span>
              <Flag market="eu" className="h-2.5 w-4" />
              <span>Países Bajos · Marítimo · CIF</span>
            </div>
          </div>

          <div className="-mt-3 rounded-t-2xl bg-paper px-4 pt-4 pb-5">
            <div className="flex items-center gap-3 rounded-2xl border border-rule bg-card p-3 shadow-card">
              <ProgressRing ratio={11 / 18} size={46} stroke={5} />
              <div>
                <p className="text-[0.8rem] font-semibold">11 de 18 documentos</p>
                <p className="text-[0.68rem] text-muted">Siguiente: Declaración de exportación</p>
              </div>
            </div>

            <ol className="relative mt-4 flex flex-col gap-2.5 pl-1">
              <span aria-hidden className="absolute top-3 bottom-3 left-[15px] w-0.5 bg-trace/40" />
              {stages.map((stage) => {
                const Icon = stageIcons[stage.id];
                const complete = stage.done === stage.total;
                const started = stage.done > 0 && !complete;
                return (
                  <li key={stage.id} className="relative flex items-center gap-3">
                    <span
                      className={cn(
                        "relative z-10 flex size-6 items-center justify-center rounded-full border-2",
                        complete && "border-trace bg-trace text-white",
                        started && "border-trace bg-card text-seal",
                        !complete && !started && "border-rule bg-card text-muted",
                      )}
                    >
                      {complete ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : started ? (
                        <LoaderCircle className="size-3.5" />
                      ) : (
                        <CircleDashed className="size-3" />
                      )}
                    </span>
                    <span className="flex flex-1 items-center justify-between rounded-xl bg-card px-2.5 py-1.5 text-[0.72rem] shadow-card">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Icon className="size-3.5 text-muted" />
                        {stage.name}
                      </span>
                      <span className="tabular-nums text-muted">
                        {stage.done}/{stage.total}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-seal to-seal-strong text-[0.75rem] font-medium text-white">
              <Send className="size-3.5" />
              Pedir ayuda a un aliado
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas flotantes */}
      <div className="animate-float absolute top-24 -left-2 flex items-center gap-2.5 rounded-2xl border border-rule bg-card/95 p-3 shadow-float backdrop-blur sm:-left-10">
        <span className="flex size-8 items-center justify-center rounded-full bg-seal-tint text-seal">
          <Check className="size-4" strokeWidth={3} />
        </span>
        <span className="text-xs">
          <span className="block font-semibold">Certificado fitosanitario</span>
          <span className="text-muted">Aprobado por el ICA</span>
        </span>
      </div>

      <div
        className="animate-float absolute -right-2 bottom-16 w-64 rounded-2xl border border-rule bg-card/95 p-3 shadow-float backdrop-blur sm:-right-12"
        style={{ animationDelay: "1.5s" }}
      >
        <p className="eyebrow text-seal">Referido enviado</p>
        <div className="mt-2 flex items-center gap-2.5">
          <Avatar name="Sello Verde Certificaciones" size="sm" />
          <span className="min-w-0 text-xs">
            <span className="block truncate font-semibold">Sello Verde Certificaciones</span>
            <span className="block text-muted">Trazabilidad EUDR</span>
            <span className="block font-mono text-[0.68rem] text-seal">PZ-8K2P4Q</span>
          </span>
        </div>
      </div>
    </div>
  );
}
