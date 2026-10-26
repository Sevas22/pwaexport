import type { AllyTypeId, CategoryId, ExportSelection, MarketId, RouteId, TransportMode } from "@/lib/types";

/** Lo que el usuario escribe en el buscador del inicio. */
export interface ReportInput {
  /** Nombre del producto o partida arancelaria. */
  query: string;
  /** Código del país desde el que se exporta. */
  origin: string;
  /** Código del país de destino. */
  destination: string;
  /** Mercado al que pertenece el destino, para la base documental. */
  market: MarketId;
  route: RouteId;
  mode: TransportMode;
  /** Nombre del país de destino, para mostrar. */
  destinationCountry?: string;
}

export interface HsClassification {
  /** Subpartida del Sistema Armonizado, 6 dígitos con punto: "0901.21". */
  code: string;
  description: string;
  product: string;
  category: CategoryId;
  confidence: "alta" | "media" | "baja";
  alternatives: { code: string; description: string }[];
  note: string;
}

export interface ReportSection {
  title: string;
  detail: string;
}

export interface ExportReport {
  id: string;
  createdAt: string;
  input: ReportInput;
  selection: ExportSelection;
  classification: HsClassification;
  /** Hallazgos clave: es la parte que se muestra sin cuenta. */
  summary: string[];
  marketOverview: {
    opportunity: string;
    agreement: string;
    tariffNote: string;
    entryRequirements: string[];
  };
  requirements: ReportSection[];
  documents: { id?: string; name: string; why: string }[];
  logistics: { recommendation: string; transitTime: string; incotermTip: string };
  costs: ReportSection[];
  risks: string[];
  nextSteps: string[];
  allyTypes: AllyTypeId[];
  /** Transparencia sobre cómo se generó. */
  generatedBy: "groq" | "base";
  model?: string;
}

export const emptyAlternatives: HsClassification["alternatives"] = [];
