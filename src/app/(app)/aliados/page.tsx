import type { Metadata } from "next";
import { Suspense } from "react";
import { Handshake, Info } from "lucide-react";
import { Loading, PageHeader } from "@/components/ui";
import { AllyDirectory } from "./AllyDirectory";

export const metadata: Metadata = { title: "Aliados" };

export default function AlliesPage() {
  return (
    <>
      <PageHeader
        icon={Handshake}
        eyebrow="Aliados estratégicos"
        title="Agencias que resuelven tu exportación"
        description="Agentes de aduanas, logística, seguros, financiación y más. Refiere tu operación y la agencia te contacta."
      />
      <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber/25 bg-amber-tint px-3 py-2 text-sm text-amber">
        <Info className="size-4 shrink-0" aria-hidden />
        Directorio de demostración: los nombres y contactos son ficticios.
      </p>
      <Suspense fallback={<Loading />}>
        <AllyDirectory />
      </Suspense>
    </>
  );
}
