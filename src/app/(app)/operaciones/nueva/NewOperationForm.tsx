"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Route, Ship } from "lucide-react";
import { ExportSentence, normalizeSelection } from "@/components/documents/ExportSentence";
import { ManifestStrip } from "@/components/documents/ManifestStrip";
import { stageIcons } from "@/components/icons";
import { Card, Field, IconTile, Input, Select, buttonStyles } from "@/components/ui";
import { getMarket } from "@/data/catalog";
import { documentsFor, groupByStage } from "@/lib/requirements";
import { useAppStore } from "@/lib/store";

const incoterms = [
  { id: "EXW", label: "EXW · En fábrica" },
  { id: "FCA", label: "FCA · Franco transportista" },
  { id: "FAS", label: "FAS · Franco al costado del buque" },
  { id: "FOB", label: "FOB · Franco a bordo" },
  { id: "CFR", label: "CFR · Costo y flete" },
  { id: "CIF", label: "CIF · Costo, seguro y flete" },
  { id: "CPT", label: "CPT · Transporte pagado hasta" },
  { id: "CIP", label: "CIP · Transporte y seguro pagados hasta" },
  { id: "DAP", label: "DAP · Entregado en un lugar" },
  { id: "DPU", label: "DPU · Entregado y descargado" },
  { id: "DDP", label: "DDP · Entregado con derechos pagados" },
];

export function NewOperationForm() {
  const router = useRouter();
  const params = useSearchParams();
  const createOperation = useAppStore((state) => state.createOperation);

  const [selection, setSelection] = useState(() =>
    normalizeSelection({
      route: params.get("ruta"),
      category: params.get("categoria"),
      market: params.get("mercado"),
      mode: params.get("modo"),
    }),
  );
  const [product, setProduct] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [incoterm, setIncoterm] = useState("FOB");

  const docs = documentsFor(selection);
  const groups = groupByStage(docs);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const operation = createOperation({
      ...selection,
      product: product.trim(),
      hsCode: hsCode.trim(),
      destinationCountry: destinationCountry.trim() || getMarket(selection.market).name,
      incoterm,
    });
    router.push(`/operaciones/${operation.id}`);
  }

  return (
    <form onSubmit={submit} className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-6">
        <Card className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <IconTile icon={Route} size="sm" />
            <div>
              <p className="eyebrow text-muted">Paso 1</p>
              <h2 className="font-semibold">Ruta de exportación</h2>
            </div>
          </div>
          <div className="mt-5">
            <ExportSentence value={selection} onChange={setSelection} />
          </div>
        </Card>

        <Card className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <IconTile icon={Ship} size="sm" />
            <div>
              <p className="eyebrow text-muted">Paso 2</p>
              <h2 className="font-semibold">Detalles del embarque</h2>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Producto" className="sm:col-span-2">
              <Input
                required
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                placeholder="Ej.: Café tostado en grano, bolsas de 340 g"
              />
            </Field>
            <Field label="País de destino" hint={`Dentro de ${getMarket(selection.market).name}`}>
              <Input
                value={destinationCountry}
                onChange={(event) => setDestinationCountry(event.target.value)}
                placeholder="Ej.: Países Bajos"
              />
            </Field>
            <Field label="Subpartida arancelaria" hint="Opcional. Un agente de aduanas te ayuda a definirla.">
              <Input
                inputMode="numeric"
                value={hsCode}
                onChange={(event) => setHsCode(event.target.value)}
                placeholder="Ej.: 0901.21.10.00"
                className="font-mono"
              />
            </Field>
            <Field label="Incoterm" hint="Define hasta dónde respondes por la mercancía." className="sm:col-span-2">
              <Select value={incoterm} onChange={(event) => setIncoterm(event.target.value)}>
                {incoterms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <Card className="overflow-hidden">
          <div className="relative bg-navy px-5 py-5 text-white">
            <div aria-hidden className="bg-blueprint-dark absolute inset-0" />
            <p className="eyebrow relative text-[#6fd3a0]">Checklist que se generará</p>
            <p className="display relative mt-2 text-4xl tabular-nums">{docs.length}</p>
            <p className="relative text-sm text-white/70">documentos en {groups.length} etapas</p>
          </div>
          <div className="p-5">
            <ul className="flex flex-col gap-2.5">
              {groups.map((group) => {
                const Icon = stageIcons[group.id];
                return (
                  <li key={group.id} className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-seal-tint text-seal">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="flex-1">{group.name}</span>
                    <span className="tabular-nums text-muted">{group.documents.length}</span>
                  </li>
                );
              })}
            </ul>
            <ManifestStrip selection={selection} className="mt-5" />
            <button type="submit" className={`${buttonStyles("primary", "lg")} mt-5 w-full`}>
              Crear operación
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </Card>
      </aside>
    </form>
  );
}
