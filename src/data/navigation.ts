// Estructura del sitio público, según el documento "Retoques plataforma".
// Cada sección del menú agrupa sus subpáginas; el orden es el del documento.
// Cada subpágina declara con qué aliados y documentos se cruza, para que el
// sitio y la plataforma queden enlazados en vez de ser páginas sueltas.

import type { AllyTypeId } from "@/lib/types";

export interface NavChild {
  slug: string;
  label: string;
  /** Una línea que explica la subpágina mientras se define su contenido. */
  summary: string;
  /** Ruta interna cuando la subpágina ya existe en la aplicación. */
  href?: string;
  /** Aliados del ecosistema que resuelven este tema. */
  allyTypes?: AllyTypeId[];
  /** Documentos de la base que se cruzan con este tema. */
  documentIds?: string[];
  /** true para mostrar los mercados a los que llegamos. */
  showMarkets?: boolean;
}

export interface NavSection {
  slug: string;
  label: string;
  summary: string;
  children: NavChild[];
}

export const navigation: NavSection[] = [
  {
    slug: "compradores",
    label: "Compradores",
    summary: "Encuentre compradores para su producto y entienda qué exige cada mercado.",
    children: [
      {
        slug: "informes",
        label: "Informes",
        summary: "Informe de exportación generado por el agente de IA, con partida arancelaria, requisitos y documentos.",
        href: "/informes",
      },
    ],
  },
  {
    slug: "soluciones",
    label: "Soluciones",
    summary: "Todo lo que necesita una operación de comercio exterior, resuelto con nuestra red de aliados.",
    children: [
      {
        slug: "comisiones-tradicionales",
        label: "Comisiones tradicionales",
        summary: "Representación comercial a comisión para colocar su producto en el exterior.",
        allyTypes: ["comercializadora", "marketplace"],
      },
      {
        slug: "logistica",
        label: "Logística",
        summary: "Transporte internacional, consolidación de carga y coordinación puerta a puerta.",
        allyTypes: ["operador-logistico", "naviera", "aerolinea", "courier", "3pl", "fulfillment"],
        documentIds: ["bl", "awb", "cpic", "guia-courier", "transporte-fulfillment", "poliza-transporte", "nimf15"],
      },
      {
        slug: "importaciones",
        label: "Importaciones",
        summary: "Maquinaria, bienes de capital, materias primas e insumos industriales con logística hasta su planta.",
        allyTypes: ["comercializadora", "agente-aduanas", "operador-logistico"],
      },
      {
        slug: "legales",
        label: "Legales",
        summary: "Contratos internacionales, reglas de origen y cumplimiento normativo en destino.",
        allyTypes: ["agente-aduanas", "broker", "certificadora"],
        documentIds: ["certificado-origen", "declaracion-juramentada-origen", "legalizacion", "cites", "conformidad-producto"],
      },
      {
        slug: "financieras",
        label: "Financieras",
        summary: "Cartas de crédito, factoring, financiación a compradores y canalización de divisas.",
        allyTypes: ["banco", "factoring", "aseguradora", "pasarela-pago"],
        documentIds: ["carta-credito", "canalizacion-divisas", "poliza-transporte"],
      },
      {
        slug: "tramites",
        label: "Trámites",
        summary: "Documentos de exportación paso a paso, con los vistos buenos de cada entidad.",
        href: "/documentos",
      },
      {
        slug: "marketing-internacional",
        label: "Marketing internacional",
        summary: "Posicionamiento de marca, material comercial y prospección en mercados de destino.",
        allyTypes: ["comercializadora", "marketplace", "certificadora"],
        documentIds: ["etiquetado", "codigos-marketplace"],
      },
    ],
  },
  {
    slug: "integraciones",
    label: "Integraciones",
    summary: "Conecte la plataforma con sus tiendas, su CRM y sus canales de venta.",
    children: [
      {
        slug: "agentes-de-ventas-ia",
        label: "Agentes de ventas IA",
        summary: "Agentes que prospectan, responden y hacen seguimiento comercial por usted.",
        allyTypes: ["marketplace", "comercializadora"],
      },
      {
        slug: "dropshipping",
        label: "Dropshipping",
        summary: "Venda sin inventario propio: el pedido se despacha desde el proveedor al cliente final.",
        allyTypes: ["fulfillment", "3pl", "courier", "marketplace"],
        documentIds: ["exportacion-courier", "guia-courier", "us-entrada-courier", "ioss"],
      },
    ],
  },
  {
    slug: "trading",
    label: "Trading",
    summary: "El mercado abierto: lo que el planeta pide y lo que usted puede ofrecer.",
    children: [
      {
        slug: "solicitudes-de-compra",
        label: "Solicitudes de compra",
        summary: "Todo lo que pide el planeta: solicitudes de compradores internacionales buscando proveedor.",
        allyTypes: ["comercializadora", "marketplace"],
      },
      {
        slug: "publicar",
        label: "Publicar para todo el planeta",
        summary: "Publique su oferta hacia Estados Unidos, Venezuela, Medio Oriente y China.",
        allyTypes: ["comercializadora", "marketplace", "fulfillment"],
        documentIds: ["importador-registro", "eori", "codigos-marketplace"],
        showMarkets: true,
      },
    ],
  },
  {
    slug: "campus",
    label: "Campus",
    summary: "Formación para equipos que están empezando a exportar.",
    children: [
      {
        slug: "export-academy",
        label: "Export Academy",
        summary: "Ruta de formación en comercio exterior, de la primera exportación al embarque recurrente.",
        documentIds: ["rut-exportador", "subpartida", "factura-exportacion", "sae", "dex", "certificado-origen"],
      },
    ],
  },
  {
    slug: "club",
    label: "Club",
    summary: "La comunidad de exportadores de la plataforma, con capítulo en cada país.",
    children: [
      { slug: "colombia", label: "Colombia", summary: "Capítulo Colombia de la comunidad de exportadores.", allyTypes: ["comercializadora", "agente-aduanas", "operador-logistico"] },
      { slug: "brasil", label: "Brasil", summary: "Capítulo Brasil de la comunidad de exportadores.", allyTypes: ["comercializadora", "agente-aduanas", "operador-logistico"] },
      { slug: "chile", label: "Chile", summary: "Capítulo Chile de la comunidad de exportadores.", allyTypes: ["comercializadora", "agente-aduanas", "operador-logistico"] },
      { slug: "mexico", label: "México", summary: "Capítulo México de la comunidad de exportadores.", allyTypes: ["comercializadora", "agente-aduanas", "operador-logistico"] },
    ],
  },
];

const sectionMap = Object.fromEntries(navigation.map((section) => [section.slug, section]));

export const getSection = (slug: string): NavSection | undefined => sectionMap[slug];

export function getChild(sectionSlug: string, childSlug: string): NavChild | undefined {
  return sectionMap[sectionSlug]?.children.find((child) => child.slug === childSlug);
}

/** Todas las rutas del sitio público, para generarlas en el build. */
export function allNavPaths() {
  return navigation.flatMap((section) => [
    { ruta: [section.slug] },
    ...section.children.filter((child) => !child.href).map((child) => ({ ruta: [section.slug, child.slug] })),
  ]);
}
