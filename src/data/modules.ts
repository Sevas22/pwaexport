import type { AllyTypeId } from "@/lib/types";

// Módulos del núcleo TM Core. Cada uno se resuelve de una de tres formas:
// - "app": funcionalidad propia de la aplicación.
// - "aliados": se atiende refiriendo al usuario a agencias aliadas.
// - "hoja-de-ruta": planeado, aún no disponible.

export type ModuleKind = "app" | "aliados" | "hoja-de-ruta";

export interface CoreModule {
  id: string;
  name: string;
  kind: ModuleKind;
  href?: string;
  allyTypes?: AllyTypeId[];
}

export const coreModules: CoreModule[] = [
  { id: "documentos", name: "Documentos de exportación", kind: "app", href: "/documentos" },
  { id: "operaciones", name: "Operaciones", kind: "app", href: "/operaciones" },
  { id: "referidos", name: "Referidos a aliados", kind: "app", href: "/referidos" },
  { id: "clasificacion", name: "Clasificación arancelaria", kind: "aliados", allyTypes: ["agente-aduanas"] },
  { id: "logistica", name: "Logística internacional", kind: "aliados", allyTypes: ["operador-logistico"] },
  { id: "seguros", name: "Seguros", kind: "aliados", allyTypes: ["aseguradora"] },
  { id: "factoring", name: "Factoring", kind: "aliados", allyTypes: ["factoring"] },
  { id: "financiacion", name: "Financiación", kind: "aliados", allyTypes: ["banco"] },
  { id: "medios-pago", name: "Medios de pago", kind: "aliados", allyTypes: ["pasarela-pago"] },
  { id: "investigacion", name: "Investigación de mercados", kind: "hoja-de-ruta" },
  { id: "marketing", name: "Marketing internacional", kind: "hoja-de-ruta" },
  { id: "prospeccion", name: "Prospección comercial", kind: "hoja-de-ruta" },
  { id: "crm", name: "CRM internacional", kind: "hoja-de-ruta" },
  { id: "cotizaciones", name: "Cotizaciones internacionales", kind: "hoja-de-ruta" },
  { id: "contratos", name: "Contratos internacionales", kind: "hoja-de-ruta" },
  { id: "tracking", name: "Tracking", kind: "hoja-de-ruta" },
  { id: "analitica", name: "Analítica IA", kind: "hoja-de-ruta" },
];
