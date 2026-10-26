import { ORIGIN, categories, getCategory, getMarket, modeLabels, modesFor } from "@/data/catalog";
import { documentsFor } from "@/lib/requirements";
import type { CategoryId, ExportSelection } from "@/lib/types";
import type { HsClassification, ReportInput } from "@/lib/agent/types";

// Contexto que se le entrega al agente para que redacte sobre datos reales
// (nuestra base documental) en vez de inventarlos.

export function selectionFor(input: ReportInput, category: CategoryId): ExportSelection {
  const modes = modesFor(input.route, input.market);
  return {
    route: input.route,
    market: input.market,
    category,
    mode: modes.includes(input.mode) ? input.mode : modes[0],
  };
}

/** Etapas que no dependen del país de salida: valen para cualquier origen. */
const originAgnosticStages = ["transporte", "destino"];

export function knowledgeContext(selection: ExportSelection, options?: { onlyOriginAgnostic?: boolean }) {
  const market = getMarket(selection.market);
  const all = documentsFor(selection);
  // Con otro origen, los trámites de salida colombianos no aplican y no se le
  // entregan al agente: si los ve, termina atribuyéndolos al país equivocado.
  const docs = options?.onlyOriginAgnostic ? all.filter((doc) => originAgnosticStages.includes(doc.stage)) : all;

  return {
    origen: ORIGIN.country,
    mercado: {
      nombre: market.name,
      acuerdos: market.agreements,
      idiomaEtiquetado: market.labelLanguage,
    },
    categoria: getCategory(selection.category).name,
    modo: modeLabels[selection.mode],
    documentos: docs.map((doc) => ({
      id: doc.id,
      nombre: doc.name,
      requisito: doc.requirement,
      etapa: doc.stage,
      emite: doc.issuer,
      resumen: doc.summary,
      condicion: doc.condition,
      notaMercado: doc.marketNotes?.[selection.market],
      aliados: doc.helpers,
    })),
  };
}

export const categoryOptions = categories.map((category) => ({
  id: category.id,
  nombre: category.name,
  ejemplos: category.examples,
}));

/** Partidas de referencia para clasificar sin IA y para orientar al agente. */
const hsHints: { keywords: string[]; code: string; description: string; category: CategoryId }[] = [
  { keywords: ["café tostado", "cafe tostado", "café molido", "tostión"], code: "0901.21", description: "Café tostado sin descafeinar", category: "alimentos-procesados" },
  { keywords: ["café", "cafe", "café verde", "café en grano"], code: "0901.11", description: "Café sin tostar, sin descafeinar", category: "agro-fresco" },
  { keywords: ["cacao en grano", "cacao"], code: "1801.00", description: "Cacao en grano, entero o partido", category: "agro-fresco" },
  { keywords: ["chocolate", "bombón", "cobertura"], code: "1806.90", description: "Chocolate y preparaciones con cacao", category: "alimentos-procesados" },
  { keywords: ["flores", "rosas", "clavel", "follaje"], code: "0603.11", description: "Rosas frescas cortadas", category: "agro-fresco" },
  { keywords: ["banano", "plátano", "platano"], code: "0803.90", description: "Bananas frescas o secas", category: "agro-fresco" },
  { keywords: ["aguacate", "palta", "hass"], code: "0804.40", description: "Aguacates frescos o secos", category: "agro-fresco" },
  { keywords: ["panela", "azúcar de caña", "azucar"], code: "1701.13", description: "Azúcar de caña en bruto", category: "alimentos-procesados" },
  { keywords: ["miel"], code: "0409.00", description: "Miel natural", category: "alimentos-procesados" },
  { keywords: ["snack", "galleta", "pasabocas", "pastelería"], code: "1905.90", description: "Productos de panadería y pastelería", category: "alimentos-procesados" },
  { keywords: ["salsa", "ají", "aderezo", "condimento"], code: "2103.90", description: "Preparaciones para salsas y condimentos", category: "alimentos-procesados" },
  { keywords: ["crema", "cosmético", "cosmetico", "maquillaje", "serum"], code: "3304.99", description: "Preparaciones de belleza y cuidado de la piel", category: "cosmeticos" },
  { keywords: ["jabón", "jabon"], code: "3401.11", description: "Jabón de tocador", category: "cosmeticos" },
  { keywords: ["aceite esencial", "esencia"], code: "3301.29", description: "Aceites esenciales", category: "cosmeticos" },
  { keywords: ["camisa", "camiseta", "blusa", "ropa", "confección"], code: "6109.10", description: "Camisetas de punto de algodón", category: "textil-moda" },
  { keywords: ["vestido de baño", "bikini", "traje de baño"], code: "6112.41", description: "Bañadores de punto para mujer", category: "textil-moda" },
  { keywords: ["jean", "pantalón", "pantalon"], code: "6203.42", description: "Pantalones de algodón para hombre", category: "textil-moda" },
  { keywords: ["mochila", "bolso", "cartera", "maleta"], code: "4202.22", description: "Bolsos de mano con superficie textil", category: "artesanias" },
  { keywords: ["calzado", "zapato", "botas"], code: "6403.99", description: "Calzado con suela de caucho y parte superior de cuero", category: "textil-moda" },
  { keywords: ["sombrero", "aguadeño", "vueltiao"], code: "6504.00", description: "Sombreros trenzados", category: "artesanias" },
  { keywords: ["cerámica", "ceramica", "artesanía", "artesania", "decoración"], code: "6913.90", description: "Artículos de cerámica para adorno", category: "artesanias" },
  { keywords: ["mueble", "madera", "silla", "mesa"], code: "9403.60", description: "Muebles de madera", category: "artesanias" },
  { keywords: ["autoparte", "repuesto", "vehículo"], code: "8708.99", description: "Partes y accesorios de vehículos", category: "manufacturas" },
  { keywords: ["empaque", "envase", "plástico", "plastico"], code: "3923.90", description: "Artículos de plástico para transporte o envasado", category: "manufacturas" },
  { keywords: ["maquinaria", "máquina", "equipo"], code: "8479.89", description: "Máquinas y aparatos mecánicos no expresados en otra parte", category: "manufacturas" },
];

export const hsReference = hsHints.map(({ code, description, category }) => ({ code, description, category }));

const digitsOnly = (value: string) => value.replace(/[^0-9]/g, "");

/** Minúsculas y sin tildes, para que "cafe" encuentre "café". */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

/** ¿La consulta es una partida arancelaria en vez de un nombre de producto? */
export function looksLikeHsCode(query: string) {
  return /^\d{4,10}$/.test(query.replace(/[\s.]/g, ""));
}

/** Clasificación sin IA: por partida escrita o por palabras clave del producto. */
export function classifyWithRules(query: string): HsClassification {
  const text = normalize(query);

  if (looksLikeHsCode(query)) {
    const digits = digitsOnly(query).padEnd(6, "0").slice(0, 6);
    const code = `${digits.slice(0, 4)}.${digits.slice(4, 6)}`;
    const known = hsHints.find((hint) => hint.code === code) ?? hsHints.find((hint) => hint.code.startsWith(digits.slice(0, 4)));
    return {
      code,
      description: known?.description ?? "Subpartida indicada por el usuario",
      product: known?.description ?? `Partida ${code}`,
      category: known?.category ?? "manufacturas",
      confidence: known ? "media" : "baja",
      alternatives: [],
      note: "Clasificación tomada de la partida que escribiste. Confírmala con tu agente de aduanas antes de declarar.",
    };
  }

  const match = hsHints.find((hint) => hint.keywords.some((keyword) => text.includes(normalize(keyword))));
  if (!match) {
    return {
      code: "0000.00",
      description: "Sin clasificar",
      product: query.trim() || "Producto por definir",
      category: "manufacturas",
      confidence: "baja",
      alternatives: [],
      note: "No pudimos sugerir una subpartida con la descripción recibida. Un agente de aduanas puede clasificarla.",
    };
  }

  return {
    code: match.code,
    description: match.description,
    product: query.trim(),
    category: match.category,
    confidence: "media",
    alternatives: hsHints
      .filter((hint) => hint !== match && hint.category === match.category)
      .slice(0, 2)
      .map(({ code, description }) => ({ code, description })),
    note: "Sugerencia basada en la descripción del producto. La subpartida definitiva la confirma tu agente de aduanas.",
  };
}
