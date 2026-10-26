import "server-only";
import Groq from "groq-sdk";
import { groqApiKey, groqModel, groqModelFast, isGroqConfigured } from "@/lib/env";
import { categoryOptions, hsReference, knowledgeContext, selectionFor } from "@/lib/agent/knowledge";
import { getCategory, getMarket } from "@/data/catalog";
import { getOrigin } from "@/data/countries";
import type { ExportReport, HsClassification, ReportInput } from "@/lib/agent/types";
import type { AllyTypeId, CategoryId } from "@/lib/types";
import { allyTypes } from "@/data/catalog";

// Agente de informes sobre Groq. Se le entrega nuestra base documental como
// contexto para que redacte sobre datos reales en vez de inventarlos.

const client = () => new Groq({ apiKey: groqApiKey });

const SYSTEM = `Eres analista de comercio exterior especializado en exportaciones desde Colombia hacia mercados internacionales.
Escribes para dueños de pymes que exportan por primera vez: español claro, frases cortas, sin jerga innecesaria.
Reglas:
- Usa el contexto documental que te entregan: es la base oficial de la plataforma. No inventes documentos que no existan.
- Puedes añadir requisitos del mercado de destino que conozcas, pero escribe "verificar vigencia" cuando no estés seguro.
- Nunca inventes porcentajes de arancel, precios ni cifras de mercado exactas. Si hablas de aranceles, explica de qué dependen.
- No prometas resultados ni des asesoría legal definitiva: recomienda validar con un agente de aduanas.
- Responde SIEMPRE en JSON válido, sin texto adicional.`;

function parseJson<T>(raw: string | null | undefined): T {
  if (!raw) throw new Error("El agente no devolvió contenido");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("El agente no devolvió JSON");
  return JSON.parse(raw.slice(start, end + 1)) as T;
}

const asArray = (value: unknown, limit = 12): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "").slice(0, limit) : [];

const asSections = (value: unknown, limit = 8) =>
  Array.isArray(value)
    ? value
        .filter((item): item is { title?: string; detail?: string } => typeof item === "object" && item !== null)
        .map((item) => ({ title: String(item.title ?? "").trim(), detail: String(item.detail ?? "").trim() }))
        .filter((item) => item.title && item.detail)
        .slice(0, limit)
    : [];

/** Paso 1: clasificar el producto o interpretar la partida escrita. */
export async function classifyWithAgent(input: ReportInput): Promise<HsClassification> {
  const completion = await client().chat.completions.create({
    model: groqModelFast,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `El usuario quiere exportar esto: "${input.query}".
Destino: ${getMarket(input.market).name}.

Clasifícalo en el Sistema Armonizado. Si el usuario escribió una partida arancelaria, interprétala y descríbela.

Categorías internas disponibles (usa el id exacto):
${JSON.stringify(categoryOptions)}

Partidas de referencia que maneja la plataforma:
${JSON.stringify(hsReference)}

Devuelve JSON con esta forma exacta:
{
  "code": "6 dígitos con punto, ej. 0901.21",
  "description": "descripción oficial corta de la subpartida",
  "product": "nombre comercial del producto en palabras del usuario",
  "category": "id de categoría interna",
  "confidence": "alta | media | baja",
  "alternatives": [{ "code": "....", "description": "..." }],
  "note": "una frase sobre qué validar con el agente de aduanas"
}`,
      },
    ],
  });

  const raw = parseJson<Partial<HsClassification>>(completion.choices[0]?.message?.content);
  const category = (categoryOptions.find((item) => item.id === raw.category)?.id ?? "manufacturas") as CategoryId;

  return {
    code: String(raw.code ?? "0000.00").slice(0, 12),
    description: String(raw.description ?? "Sin descripción"),
    product: String(raw.product ?? input.query).slice(0, 160),
    category,
    confidence: raw.confidence === "alta" || raw.confidence === "baja" ? raw.confidence : "media",
    alternatives: Array.isArray(raw.alternatives)
      ? raw.alternatives
          .filter((item): item is { code: string; description: string } => Boolean(item?.code))
          .slice(0, 3)
          .map((item) => ({ code: String(item.code), description: String(item.description ?? "") }))
      : [],
    note: String(raw.note ?? "Confirma la subpartida con tu agente de aduanas antes de declarar."),
  };
}

/** Paso 2: redactar el informe completo sobre el contexto documental. */
export async function writeReportWithAgent(
  input: ReportInput,
  classification: HsClassification,
  id: string,
): Promise<ExportReport> {
  const selection = selectionFor(input, classification.category);
  const partialOrigin = getOrigin(input.origin)?.coverage === "parcial";
  const context = knowledgeContext(selection, { onlyOriginAgnostic: partialOrigin });
  const destination = input.destinationCountry?.trim() || getMarket(input.market).name;
  const originCountry = getOrigin(input.origin);
  const originName = originCountry?.name ?? "Colombia";
  const originNote =
    originCountry?.coverage === "parcial"
      ? `
REGLAS ADICIONALES PORQUE LA EXPORTACIÓN SALE DE ${originName.toUpperCase()}, NO DE COLOMBIA:
- Jamás menciones entidades colombianas (DIAN, ICA, INVIMA, VUCE, Banco de la República) ni documentos colombianos (SAE, DEX, declaración de cambio). No existen en ${originName}.
- No digas que aplica un acuerdo comercial firmado por Colombia. Si no estás seguro de qué acuerdo cubre a ${originName}, escribe que debe verificarse.
- Para los trámites de salida escribe "la autoridad aduanera de ${originName}" salvo que estés seguro de su nombre, y añade "verificar con un agente de aduanas local".
- El contexto documental que te entregamos solo cubre el transporte y el ingreso al destino: no inventes trámites de salida detallados.`
      : "";

  const completion = await client().chat.completions.create({
    model: groqModel,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Redacta un informe de exportación.

Producto: ${classification.product} (subpartida sugerida ${classification.code} – ${classification.description})
Categoría: ${getCategory(classification.category).name}
Origen: ${originName} · Destino: ${destination} (mercado ${context.mercado.nombre})
Modalidad: ${context.modo}
Acuerdos vigentes del destino: ${context.mercado.acuerdos}
Idioma de etiquetado: ${context.mercado.idiomaEtiquetado}

${originNote}

Documentos de la base de la plataforma para este caso (usa estos ids en "documents"):
${JSON.stringify(context.documentos)}

Tipos de aliados disponibles (usa estos ids en "allyTypes"):
${JSON.stringify(allyTypes.map((type) => type.id))}

Devuelve JSON con esta forma exacta:
{
  "summary": ["4 hallazgos clave, concretos, una frase cada uno"],
  "marketOverview": {
    "opportunity": "párrafo corto sobre el mercado para este producto",
    "agreement": "qué acuerdo aplica y qué implica para el arancel",
    "tariffNote": "de qué depende el arancel y qué verificar",
    "entryRequirements": ["requisitos de ingreso del país destino"]
  },
  "requirements": [{ "title": "...", "detail": "..." }],
  "documents": [{ "id": "id del contexto si corresponde", "name": "...", "why": "por qué lo necesita" }],
  "logistics": { "recommendation": "...", "transitTime": "...", "incotermTip": "..." },
  "costs": [{ "title": "...", "detail": "..." }],
  "risks": ["riesgos concretos de esta operación"],
  "nextSteps": ["acciones en orden"],
  "allyTypes": ["ids de aliados que más le sirven"]
}`,
      },
    ],
  });

  const raw = parseJson<Record<string, unknown>>(completion.choices[0]?.message?.content);
  const overview = (raw.marketOverview ?? {}) as Record<string, unknown>;
  const logistics = (raw.logistics ?? {}) as Record<string, unknown>;
  const validAllyTypes = new Set(allyTypes.map((type) => type.id));

  const documents = Array.isArray(raw.documents)
    ? (raw.documents as Record<string, unknown>[])
        .filter((item) => item && (item.name || item.id))
        .slice(0, 40)
        .map((item) => ({
          id: typeof item.id === "string" ? item.id : undefined,
          name: String(item.name ?? context.documentos.find((doc) => doc.id === item.id)?.nombre ?? "Documento"),
          why: String(item.why ?? ""),
        }))
    : [];

  return {
    id,
    createdAt: new Date().toISOString(),
    input,
    selection,
    classification,
    summary: asArray(raw.summary, 5),
    marketOverview: {
      opportunity: String(overview.opportunity ?? ""),
      agreement: String(overview.agreement ?? context.mercado.acuerdos),
      tariffNote: String(overview.tariffNote ?? ""),
      entryRequirements: asArray(overview.entryRequirements, 8),
    },
    requirements: asSections(raw.requirements),
    documents: documents.length ? documents : context.documentos.map((doc) => ({ id: doc.id, name: doc.nombre, why: doc.resumen })),
    logistics: {
      recommendation: String(logistics.recommendation ?? ""),
      transitTime: String(logistics.transitTime ?? ""),
      incotermTip: String(logistics.incotermTip ?? ""),
    },
    costs: asSections(raw.costs),
    risks: asArray(raw.risks, 6),
    nextSteps: asArray(raw.nextSteps, 6),
    allyTypes: (Array.isArray(raw.allyTypes) ? raw.allyTypes : [])
      .filter((item): item is AllyTypeId => typeof item === "string" && validAllyTypes.has(item as AllyTypeId))
      .slice(0, 6),
    generatedBy: "groq",
    model: groqModel,
  };
}

export const agentAvailable = isGroqConfigured;
export const agentModels = { report: groqModel, fast: groqModelFast };
