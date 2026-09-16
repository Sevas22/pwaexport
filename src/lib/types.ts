// Modelo de dominio de Trader Marketer.
// Los datos de referencia (documentos, mercados, aliados) viven en src/data;
// los datos del usuario (operaciones, referidos, perfil) en src/lib/store.ts.

export type RouteId = "ordinaria" | "ecommerce";

export type TransportMode =
  | "maritimo"
  | "aereo"
  | "terrestre"
  | "courier"
  | "fulfillment";

export type MarketId = "us" | "ca" | "eu" | "cn" | "me" | "latam";

export type CategoryId =
  | "alimentos-procesados"
  | "agro-fresco"
  | "cosmeticos"
  | "textil-moda"
  | "manufacturas"
  | "artesanias";

/** Etapas del proceso de exportación, en el orden en que ocurren. */
export type StageId = "preparacion" | "origen" | "transporte" | "destino" | "cobro";

export type AllyTypeId =
  | "agente-aduanas"
  | "operador-logistico"
  | "naviera"
  | "aerolinea"
  | "courier"
  | "banco"
  | "factoring"
  | "aseguradora"
  | "inspeccion"
  | "certificadora"
  | "marketplace"
  | "pasarela-pago"
  | "3pl"
  | "fulfillment"
  | "broker";

export interface ExportRoute {
  id: RouteId;
  name: string;
  tagline: string;
  description: string;
  modes: TransportMode[];
}

export interface Market {
  id: MarketId;
  name: string;
  code: string;
  agreements: string;
  labelLanguage: string;
  /** Modos de transporte posibles desde Colombia. */
  modes: TransportMode[];
}

export interface ProductCategory {
  id: CategoryId;
  name: string;
  examples: string;
}

export interface ExportDocument {
  id: string;
  name: string;
  short?: string;
  summary: string;
  issuer: string;
  where: string;
  stage: StageId;
  requirement: "obligatorio" | "condicional";
  /** Cuándo aplica, si es condicional. */
  condition?: string;
  /** Filtros: si un filtro se omite, el documento aplica a todos los valores. */
  appliesTo: {
    modes?: TransportMode[];
    markets?: MarketId[];
    categories?: CategoryId[];
  };
  marketNotes?: Partial<Record<MarketId, string>>;
  tips?: string[];
  helpers: AllyTypeId[];
  source?: { label: string; url: string };
}

export interface AllyType {
  id: AllyTypeId;
  name: string;
  plural: string;
  description: string;
}

export interface Ally {
  id: string;
  name: string;
  type: AllyTypeId;
  city: string;
  country: string;
  markets: MarketId[];
  services: string[];
  description: string;
  email: string;
  responseTime: string;
  /** Aliados con espacio publicitario contratado. */
  sponsored: boolean;
}

export interface ExportSelection {
  route: RouteId;
  category: CategoryId;
  market: MarketId;
  mode: TransportMode;
}

export type ChecklistStatus = "pendiente" | "en-tramite" | "listo" | "no-aplica";

export interface Operation extends ExportSelection {
  id: string;
  code: string;
  product: string;
  hsCode: string;
  destinationCountry: string;
  incoterm: string;
  createdAt: string;
  checklist: Record<string, ChecklistStatus>;
}

export type ReferralStatus =
  | "enviado"
  | "contactado"
  | "en-proceso"
  | "cerrado"
  | "descartado";

export interface Referral {
  id: string;
  code: string;
  allyId: string;
  operationId?: string;
  documentIds: string[];
  note: string;
  status: ReferralStatus;
  createdAt: string;
  history: { status: ReferralStatus; at: string }[];
}

export interface CompanyProfile {
  company: string;
  taxId: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
}
