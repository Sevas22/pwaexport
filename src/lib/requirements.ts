import { allies } from "@/data/allies";
import { documents } from "@/data/documents";
import { stages } from "@/data/catalog";
import type {
  Ally,
  AllyTypeId,
  ChecklistStatus,
  ExportDocument,
  ExportSelection,
  MarketId,
  StageId,
} from "@/lib/types";

const documentMap = Object.fromEntries(documents.map((doc) => [doc.id, doc]));

export const getDocument = (id: string): ExportDocument | undefined => documentMap[id];

function applies(doc: ExportDocument, sel: ExportSelection) {
  const { modes, markets, categories } = doc.appliesTo;
  return (
    (!modes || modes.includes(sel.mode)) &&
    (!markets || markets.includes(sel.market)) &&
    (!categories || categories.includes(sel.category))
  );
}

const stageOrder = Object.fromEntries(stages.map((stage, index) => [stage.id, index]));

/** Documentos que aplican a una exportación, ordenados por etapa y obligatoriedad. */
export function documentsFor(sel: ExportSelection): ExportDocument[] {
  return documents
    .filter((doc) => applies(doc, sel))
    .sort(
      (a, b) =>
        stageOrder[a.stage] - stageOrder[b.stage] ||
        Number(a.requirement === "condicional") - Number(b.requirement === "condicional"),
    );
}

export interface StageGroup {
  id: StageId;
  name: string;
  description: string;
  documents: ExportDocument[];
}

export function groupByStage(docs: ExportDocument[]): StageGroup[] {
  return stages
    .map((stage) => ({ ...stage, documents: docs.filter((doc) => doc.stage === stage.id) }))
    .filter((group) => group.documents.length > 0);
}

/** Aliados que pueden ayudar, con los patrocinados primero. */
export function alliesFor(types: AllyTypeId[], market?: MarketId): Ally[] {
  return allies
    .filter((ally) => types.includes(ally.type) && (!market || ally.markets.includes(market)))
    .sort((a, b) => Number(b.sponsored) - Number(a.sponsored));
}

export function initialChecklist(sel: ExportSelection): Record<string, ChecklistStatus> {
  return Object.fromEntries(documentsFor(sel).map((doc) => [doc.id, "pendiente" as const]));
}

export function checklistProgress(checklist: Record<string, ChecklistStatus>) {
  const values = Object.values(checklist).filter((status) => status !== "no-aplica");
  const done = values.filter((status) => status === "listo").length;
  return { done, total: values.length, ratio: values.length ? done / values.length : 0 };
}
