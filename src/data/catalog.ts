import type {
  AllyType,
  AllyTypeId,
  CategoryId,
  ExportRoute,
  Market,
  MarketId,
  ProductCategory,
  RouteId,
  StageId,
  TransportMode,
} from "@/lib/types";

export const ORIGIN = { country: "Colombia", code: "CO" } as const;

export const routes: ExportRoute[] = [
  {
    id: "ordinaria",
    name: "De tu fábrica al mundo",
    tagline: "Exportación ordinaria",
    description:
      "Carga comercial B2B por mar, aire o carretera, con declaración de exportación ante la DIAN.",
    modes: ["maritimo", "aereo", "terrestre"],
  },
  {
    id: "ecommerce",
    name: "eCommerce sin fronteras",
    tagline: "Comercio electrónico transfronterizo",
    description:
      "Ventas al consumidor final por courier o inventario enviado a una bodega de fulfillment en destino.",
    modes: ["courier", "fulfillment"],
  },
];

export const modeLabels: Record<TransportMode, string> = {
  maritimo: "Marítimo",
  aereo: "Aéreo",
  terrestre: "Terrestre",
  courier: "Courier (envío directo)",
  fulfillment: "Inventario a fulfillment",
};

export const markets: Market[] = [
  {
    id: "us",
    name: "Estados Unidos",
    code: "US",
    agreements: "TLC Colombia–EE. UU. (Acuerdo de Promoción Comercial)",
    labelLanguage: "Inglés",
    modes: ["maritimo", "aereo", "courier", "fulfillment"],
  },
  {
    id: "ca",
    name: "Canadá",
    code: "CA",
    agreements: "TLC Colombia–Canadá",
    labelLanguage: "Inglés y francés",
    modes: ["maritimo", "aereo", "courier", "fulfillment"],
  },
  {
    id: "eu",
    name: "Unión Europea",
    code: "EU",
    agreements: "Acuerdo Comercial UE–Colombia, Perú y Ecuador",
    labelLanguage: "Idioma oficial de cada país miembro",
    modes: ["maritimo", "aereo", "courier", "fulfillment"],
  },
  {
    id: "cn",
    name: "China",
    code: "CN",
    agreements: "Sin acuerdo comercial vigente con Colombia",
    labelLanguage: "Chino simplificado",
    modes: ["maritimo", "aereo", "courier", "fulfillment"],
  },
  {
    id: "me",
    name: "Medio Oriente",
    code: "ME",
    agreements: "TLC Colombia–Israel; resto de países según acuerdos vigentes",
    labelLanguage: "Árabe (e inglés según el país)",
    modes: ["maritimo", "aereo", "courier", "fulfillment"],
  },
  {
    id: "latam",
    name: "Latinoamérica",
    code: "LA",
    agreements: "CAN, Alianza del Pacífico, Mercosur (ACE 72) y acuerdos bilaterales",
    labelLanguage: "Español o portugués",
    modes: ["maritimo", "aereo", "terrestre", "courier", "fulfillment"],
  },
];

export const categories: ProductCategory[] = [
  {
    id: "alimentos-procesados",
    name: "Alimentos procesados",
    examples: "Café tostado, chocolates, snacks, salsas",
  },
  {
    id: "agro-fresco",
    name: "Agro y productos frescos",
    examples: "Frutas, flores, café verde, cacao en grano",
  },
  {
    id: "cosmeticos",
    name: "Cosméticos y cuidado personal",
    examples: "Cremas, aceites, maquillaje, jabones",
  },
  {
    id: "textil-moda",
    name: "Textil, moda y calzado",
    examples: "Ropa, vestidos de baño, bolsos, zapatos",
  },
  {
    id: "manufacturas",
    name: "Manufacturas e industria",
    examples: "Autopartes, empaques, electrodomésticos",
  },
  {
    id: "artesanias",
    name: "Artesanías y decoración",
    examples: "Mochilas, cerámica, muebles, sombreros",
  },
];

export const stages: { id: StageId; name: string; description: string }[] = [
  {
    id: "preparacion",
    name: "Preparación",
    description: "Registros, permisos y documentos comerciales antes del despacho.",
  },
  {
    id: "origen",
    name: "Aduana de salida",
    description: "Trámites ante la DIAN y autoridades en Colombia.",
  },
  {
    id: "transporte",
    name: "Transporte internacional",
    description: "Documentos que acompañan la carga en tránsito.",
  },
  {
    id: "destino",
    name: "Ingreso al destino",
    description: "Requisitos del país importador y del canal de venta.",
  },
  {
    id: "cobro",
    name: "Cobro y divisas",
    description: "Recaudo del pago y reintegro de divisas a Colombia.",
  },
];

export const allyTypes: AllyType[] = [
  { id: "agente-aduanas", name: "Agente de aduanas", plural: "Agentes de aduanas", description: "Declaran ante la DIAN y gestionan vistos buenos." },
  { id: "operador-logistico", name: "Operador logístico", plural: "Operadores logísticos", description: "Coordinan transporte puerta a puerta y consolidación." },
  { id: "naviera", name: "Naviera", plural: "Navieras", description: "Transporte marítimo y emisión de BL." },
  { id: "aerolinea", name: "Aerolínea de carga", plural: "Aerolíneas", description: "Transporte aéreo y emisión de guía aérea." },
  { id: "courier", name: "Courier internacional", plural: "Courier", description: "Envíos urgentes y paquetes al consumidor final." },
  { id: "banco", name: "Banco", plural: "Bancos", description: "Canalización de divisas, cartas de crédito y financiación." },
  { id: "factoring", name: "Factoring", plural: "Factoring", description: "Liquidez anticipando facturas de exportación." },
  { id: "aseguradora", name: "Aseguradora", plural: "Aseguradoras", description: "Pólizas de transporte y crédito a la exportación." },
  { id: "inspeccion", name: "Inspección", plural: "Inspección", description: "Verificación de carga, calidad y cantidades." },
  { id: "certificadora", name: "Certificadora", plural: "Certificadoras", description: "Certificaciones de producto, calidad y halal." },
  { id: "marketplace", name: "Marketplace", plural: "Marketplaces", description: "Canales de venta en línea internacionales." },
  { id: "pasarela-pago", name: "Pasarela de pago", plural: "Pasarelas de pago", description: "Cobros internacionales en línea." },
  { id: "3pl", name: "3PL", plural: "3PL", description: "Almacenamiento y distribución tercerizada." },
  { id: "fulfillment", name: "Fulfillment", plural: "Fulfillment", description: "Bodega, alistamiento y despacho en destino." },
  { id: "broker", name: "Broker internacional", plural: "Brokers", description: "Agente de aduanas en el país de destino." },
  {
    id: "comercializadora",
    name: "Comercializadora internacional",
    plural: "Comercializadoras",
    description: "Acompañan la operación completa: compradores, documentos, logística y estructuración del negocio.",
  },
];

const byId = <T extends { id: string }>(items: T[]) =>
  Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, T>;

const routeMap = byId(routes);
const marketMap = byId(markets);
const categoryMap = byId(categories);
const allyTypeMap = byId(allyTypes);

export const getRoute = (id: RouteId) => routeMap[id];
export const getMarket = (id: MarketId) => marketMap[id];
export const getCategory = (id: CategoryId) => categoryMap[id];
export const getAllyType = (id: AllyTypeId) => allyTypeMap[id];

export const isMarketId = (value: string | null | undefined): value is MarketId =>
  !!value && value in marketMap;
export const isCategoryId = (value: string | null | undefined): value is CategoryId =>
  !!value && value in categoryMap;
export const isRouteId = (value: string | null | undefined): value is RouteId =>
  !!value && value in routeMap;
export const isAllyTypeId = (value: string | null | undefined): value is AllyTypeId =>
  !!value && value in allyTypeMap;

/** Modos disponibles para una ruta en un mercado. */
export function modesFor(route: RouteId, market: MarketId): TransportMode[] {
  const allowed = getMarket(market).modes;
  return getRoute(route).modes.filter((mode) => allowed.includes(mode));
}
