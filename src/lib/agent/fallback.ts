import { getMarket, modeLabels } from "@/data/catalog";
import { getOrigin } from "@/data/countries";
import { documentsFor } from "@/lib/requirements";
import { classifyWithRules, selectionFor } from "@/lib/agent/knowledge";
import type { ExportReport, ReportInput } from "@/lib/agent/types";
import type { AllyTypeId } from "@/lib/types";

// Informe de respaldo: se arma con la base de conocimiento documental, sin IA.
// Se usa cuando no hay clave de Groq o cuando el agente falla.

export function buildBaseReport(input: ReportInput, id: string): ExportReport {
  const classification = classifyWithRules(input.query);
  const selection = selectionFor(input, classification.category);
  const market = getMarket(selection.market);
  const partialOrigin = getOrigin(input.origin)?.coverage === "parcial";
  const allDocs = documentsFor(selection);
  const docs = partialOrigin ? allDocs.filter((doc) => doc.stage === "transporte" || doc.stage === "destino") : allDocs;
  const required = docs.filter((doc) => doc.requirement === "obligatorio");
  const conditional = docs.filter((doc) => doc.requirement === "condicional");
  const destination = input.destinationCountry?.trim() || market.name;
  const originCountry = getOrigin(input.origin);
  const originName = originCountry?.name ?? "Colombia";
  const allyTypes = [...new Set(docs.flatMap((doc) => doc.helpers))] as AllyTypeId[];

  return {
    id,
    createdAt: new Date().toISOString(),
    input,
    selection,
    classification,
    summary: [
      partialOrigin
        ? `Para llevar ${classification.product} de ${originName} a ${destination} identificamos ${docs.length} documentos de transporte e ingreso al destino. Los trámites de salida de ${originName} los confirma un agente de aduanas local.`
        : `Para exportar ${classification.product} desde ${originName} a ${destination} necesitas ${docs.length} documentos: ${required.length} obligatorios y ${conditional.length} que dependen de tu caso.`,
      partialOrigin
        ? `Verifica qué acuerdo comercial cubre a ${originName} con ${destination}: los que aparecen en la plataforma son los de Colombia.`
        : `Acuerdo comercial aplicable: ${market.agreements}.`,
      `El etiquetado del producto debe ir en ${market.labelLanguage.toLowerCase()}.`,
      `Subpartida sugerida ${classification.code} (${classification.description}); confírmala con tu agente de aduanas.`,
    ],
    marketOverview: {
      opportunity: `${market.name} es uno de los destinos cubiertos por la plataforma. Esta versión del informe se arma con la base documental propia; con el agente de IA activo se amplía con contexto de mercado.`,
      agreement: market.agreements,
      tariffNote:
        "El arancel depende de la subpartida y del origen declarado. Con un certificado de origen válido puedes acceder a la preferencia del acuerdo vigente.",
      entryRequirements: docs
        .filter((doc) => doc.stage === "destino")
        .map((doc) => `${doc.name}: ${doc.summary}`)
        .slice(0, 5),
    },
    requirements: docs
      .filter((doc) => doc.stage === "preparacion" && doc.requirement === "obligatorio")
      .slice(0, 6)
      .map((doc) => ({ title: doc.name, detail: `${doc.summary} Lo emite ${doc.issuer}.` })),
    documents: docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      why: doc.condition ? `${doc.summary} Aplica si: ${doc.condition}` : doc.summary,
    })),
    logistics: {
      recommendation: `Envío ${modeLabels[selection.mode].toLowerCase()} hacia ${destination}. Un operador logístico puede cotizar puerta a puerta y consolidar la carga.`,
      transitTime: "Los tiempos de tránsito dependen del puerto de salida y de la naviera o aerolínea; pídelos en la cotización.",
      incotermTip:
        "Si vendes en CIF o CIP debes contratar el seguro de transporte. En FOB tu responsabilidad termina al cargar la mercancía.",
    },
    costs: [
      { title: "Trámites y documentos", detail: "Agencia de aduanas, certificados de origen, vistos buenos y certificaciones del producto." },
      { title: "Logística", detail: "Transporte interno, manejo en puerto o aeropuerto, flete internacional y seguro." },
      { title: "Ingreso al destino", detail: "Arancel, impuestos locales, despacho de importación y, en comercio electrónico, el importador de registro." },
      { title: "Financiero", detail: "Comisiones bancarias, diferencia cambiaria y, si lo necesitas, el costo del factoring." },
    ],
    risks: [
      ...(originCountry?.coverage === "parcial"
        ? [
            `El checklist documental de esta versión corresponde a exportaciones desde Colombia. Para salir de ${originName}, confirma los trámites con un agente de aduanas local.`,
          ]
        : []),
      "Clasificar mal la subpartida cambia aranceles y vistos buenos, y puede detener la carga.",
      "Documentos con datos distintos entre factura, lista de empaque y documento de transporte generan demoras en aduana.",
      "Requisitos sanitarios o de etiquetado del destino que se descubren tarde obligan a reempacar o reetiquetar.",
    ],
    nextSteps: [
      "Confirma la subpartida arancelaria con un agente de aduanas.",
      `Crea la operación en la plataforma para seguir los ${docs.length} documentos uno a uno.`,
      "Refiere a un aliado los trámites que no quieras hacer por tu cuenta.",
      "Pide cotización logística con el modo de envío y el Incoterm que elegiste.",
    ],
    allyTypes,
    generatedBy: "base",
  };
}
