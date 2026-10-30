import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteCtas, whatsappLinkFor } from "@/data/site";
import { cn } from "@/components/ui";

/** Los tres llamados a la acción del home, cada uno hacia su WhatsApp. */
export function CtaButtons({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {siteCtas.map((cta) => {
        const href = whatsappLinkFor(cta);
        const content = (
          <>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-seal-tint text-seal">
              <MessageCircle className="size-5" aria-hidden />
            </span>
            <span className="mt-4 flex items-center gap-1.5 text-lg font-semibold">
              {cta.label}
              {href && <ArrowUpRight className="size-4 text-seal" aria-hidden />}
            </span>
            <span className="mt-1.5 text-sm text-muted">{cta.description}</span>
            {!href && <span className="mt-3 text-xs text-amber">Número de WhatsApp por confirmar</span>}
          </>
        );

        return (
          <li key={cta.id}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-2xl border border-rule bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-float"
              >
                {content}
              </a>
            ) : (
              <span className="flex h-full cursor-not-allowed flex-col rounded-2xl border border-dashed border-rule bg-card/60 p-6 opacity-80">
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
