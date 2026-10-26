// Glosario de comercio exterior en palabras sencillas.
// Cada término aparece en la interfaz con el componente <Term>.

export interface GlossaryEntry {
  term: string;
  short: string;
  detail: string;
}

export const glossary = {
  partida: {
    term: "Partida arancelaria",
    short: "El código que identifica tu producto en la aduana.",
    detail:
      "Es un número internacional (los primeros 6 dígitos son iguales en casi todo el mundo). De él dependen el arancel que paga tu comprador, los permisos que te piden y si aplicas a un acuerdo comercial. Un agente de aduanas la confirma.",
  },
  incoterm: {
    term: "Incoterm",
    short: "Hasta dónde llega tu responsabilidad en el envío.",
    detail:
      "Regla internacional que define quién paga el transporte y el seguro, y en qué punto el riesgo pasa del vendedor al comprador. Por ejemplo, en FOB respondes hasta cargar la mercancía en el barco; en CIF además pagas flete y seguro hasta el puerto de destino.",
  },
  arancel: {
    term: "Arancel",
    short: "El impuesto que se paga al entrar la mercancía a otro país.",
    detail:
      "Lo cobra la aduana del país de destino y normalmente lo paga el importador. Depende de la partida arancelaria y del origen del producto: con un certificado de origen válido puedes acceder a la tarifa preferencial de un acuerdo comercial.",
  },
  origen: {
    term: "Certificado de origen",
    short: "El documento que prueba que tu producto es colombiano.",
    detail:
      "Acredita que el bien cumple las reglas de origen de un acuerdo comercial, para pagar menos arancel o ninguno en el destino. Según el acuerdo lo emite la DIAN o lo declara el propio exportador.",
  },
  rut: {
    term: "RUT",
    short: "Tu registro tributario, con la marca de exportador.",
    detail:
      "El Registro Único Tributario debe incluir la responsabilidad de usuario aduanero exportador antes de presentar cualquier trámite de exportación ante la DIAN.",
  },
  dex: {
    term: "Declaración de exportación",
    short: "La constancia oficial de que exportaste.",
    detail:
      "Se consolida después del embarque con los datos reales de la carga. Es la prueba ante la DIAN y respalda la exención de IVA y la devolución de saldos a favor.",
  },
  fob: {
    term: "FOB",
    short: "Entregas la mercancía cargada en el barco.",
    detail:
      "Franco a bordo: pagas el transporte interno y los trámites de exportación. Desde que la carga está a bordo, el flete, el seguro y el riesgo son del comprador.",
  },
  subpartida: {
    term: "Subpartida",
    short: "La partida arancelaria con más detalle.",
    detail:
      "En Colombia el arancel llega a 10 dígitos: los 6 primeros son internacionales y el resto los agrega el país. Es el nivel con el que se declara la mercancía.",
  },
} as const;

export type GlossaryKey = keyof typeof glossary;
