import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { ReportClient } from "./ReportClient";

export const metadata: Metadata = {
  title: "Informe de exportación",
  description: "Informe generado por el agente de IA con los requisitos, documentos y costos de tu exportación.",
};

export default function ReportPage() {
  return (
    <main className="min-h-dvh">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
            <Loading />
          </div>
        }
      >
        <ReportClient />
      </Suspense>
    </main>
  );
}
