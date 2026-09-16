import type { Metadata } from "next";
import { Suspense } from "react";
import { FileCheck } from "lucide-react";
import { Loading, PageHeader } from "@/components/ui";
import { DocumentWizard } from "./DocumentWizard";

export const metadata: Metadata = { title: "Documentos de exportación" };

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        icon={FileCheck}
        eyebrow="Asistente documental"
        title="Documentos de exportación"
        description="Elige qué exportas, a dónde y cómo lo envías. Te mostramos cada documento en el orden en que lo vas a necesitar."
      />
      <Suspense fallback={<Loading />}>
        <DocumentWizard />
      </Suspense>
    </>
  );
}
