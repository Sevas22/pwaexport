import { documentsFor } from "@/lib/requirements";
import type { ChecklistStatus, CompanyProfile, ExportSelection, Operation, Referral, ReferralStatus } from "@/lib/types";

// Datos de demostración: empresa, operaciones y referidos ficticios para que
// el demo se vea con actividad real. Se cargan la primera vez que se abre la app.

export const demoProfile: CompanyProfile = {
  company: "Andina Cacao & Café SAS",
  taxId: "900.123.456-7",
  contactName: "Valentina Ríos",
  email: "comercio@andinacacao.example",
  phone: "+57 300 000 0000",
  city: "Medellín",
};

const daysAgo = (days: number, hours = 0) => new Date(Date.now() - (days * 24 + hours) * 3_600_000).toISOString();

/** Marca los primeros documentos como listos y los siguientes como en trámite. */
function checklist(sel: ExportSelection, done: number, inProgress: number, notApplicable: string[] = []) {
  const docs = documentsFor(sel);
  return Object.fromEntries(
    docs.map((doc, index) => {
      let status: ChecklistStatus = "pendiente";
      if (notApplicable.includes(doc.id)) status = "no-aplica";
      else if (index < done) status = "listo";
      else if (index < done + inProgress) status = "en-tramite";
      return [doc.id, status];
    }),
  );
}

export function buildDemoData() {
  const year = new Date().getFullYear();

  const cafe: ExportSelection = { route: "ordinaria", category: "alimentos-procesados", market: "us", mode: "maritimo" };
  const cacao: ExportSelection = { route: "ordinaria", category: "agro-fresco", market: "eu", mode: "maritimo" };
  const mochilas: ExportSelection = { route: "ecommerce", category: "artesanias", market: "us", mode: "fulfillment" };

  const operations: Operation[] = [
    {
      ...cafe,
      id: "demo-op-cafe",
      code: `EXP-${year}-0003`,
      product: "Café tostado en grano, bolsas de 340 g",
      hsCode: "0901.21.10.00",
      destinationCountry: "Estados Unidos",
      incoterm: "FOB",
      createdAt: daysAgo(6),
      checklist: checklist(cafe, 11, 3, ["venta-libre"]),
    },
    {
      ...cacao,
      id: "demo-op-cacao",
      code: `EXP-${year}-0002`,
      product: "Cacao en grano fino de aroma",
      hsCode: "1801.00.19.00",
      destinationCountry: "Países Bajos",
      incoterm: "CIF",
      createdAt: daysAgo(14),
      checklist: checklist(cacao, 6, 4),
    },
    {
      ...mochilas,
      id: "demo-op-mochilas",
      code: `EXP-${year}-0001`,
      product: "Mochilas tejidas a mano",
      hsCode: "4202.22.00.00",
      destinationCountry: "Estados Unidos",
      incoterm: "DAP",
      createdAt: daysAgo(21),
      checklist: checklist(mochilas, 3, 2, ["cites"]),
    },
  ];

  const history = (...steps: [ReferralStatus, number][]) => steps.map(([status, days]) => ({ status, at: daysAgo(days) }));

  const referrals: Referral[] = [
    {
      id: "demo-ref-1",
      code: "TM-8K2P4Q",
      allyId: "sello-verde",
      operationId: "demo-op-cacao",
      documentIds: ["eudr"],
      note: "Necesitamos organizar la geolocalización de 12 fincas proveedoras.",
      status: "en-proceso",
      createdAt: daysAgo(12),
      history: history(["enviado", 12], ["contactado", 11], ["en-proceso", 8]),
    },
    {
      id: "demo-ref-2",
      code: "TM-R7W3JD",
      allyId: "rumbo-carga",
      operationId: "demo-op-cafe",
      documentIds: ["bl", "poliza-transporte"],
      note: "Consolidado LCL a Miami para la primera semana del próximo mes.",
      status: "contactado",
      createdAt: daysAgo(4),
      history: history(["enviado", 4], ["contactado", 3]),
    },
    {
      id: "demo-ref-3",
      code: "TM-5NHX2C",
      allyId: "cordillera-aduanas",
      operationId: "demo-op-cafe",
      documentIds: ["sae", "dex"],
      note: "",
      status: "cerrado",
      createdAt: daysAgo(6),
      history: history(["enviado", 6], ["contactado", 6], ["en-proceso", 5], ["cerrado", 2]),
    },
    {
      id: "demo-ref-4",
      code: "TM-Q4LM9T",
      allyId: "bahia-fulfillment",
      operationId: "demo-op-mochilas",
      documentIds: ["importador-registro"],
      note: "Buscamos importador de registro y bodega para 400 unidades.",
      status: "enviado",
      createdAt: daysAgo(0, 5),
      history: history(["enviado", 0]),
    },
  ];

  return { profile: demoProfile, operations, referrals };
}
