import type { Metadata } from "next";
import { Suspense } from "react";
import { PackagePlus } from "lucide-react";
import { Loading, PageHeader } from "@/components/ui";
import { NewOperationForm } from "./NewOperationForm";

export const metadata: Metadata = { title: "Nueva operación" };

export default function NewOperationPage() {
  return (
    <>
      <PageHeader
        icon={PackagePlus}
        eyebrow="Operaciones"
        title="Nueva operación"
        description="Describe tu embarque y generamos el checklist de documentos que debes reunir."
      />
      <Suspense fallback={<Loading />}>
        <NewOperationForm />
      </Suspense>
    </>
  );
}
