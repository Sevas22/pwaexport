// Datos de la plataforma. Cambiar aquí el nombre y los contactos se refleja en todo el sitio.

export const site = {
  /** Nombre de la plataforma. */
  name: "Puzztraid",
  tagline: "Encuentre compradores para su producto",
  advertiseEmail: "anunciantes@puzztraid.example",
};

/**
 * Números de WhatsApp de los botones de llamado a la acción, solo dígitos con
 * indicativo de país. El de JIN Global Trading es el publicado en su sitio;
 * el de Trader Marketer, la empresa detrás de Puzztraid, está por confirmar.
 */
export const whatsapp = {
  jinGlobalTrading: "573173145264",
  traderMarketer: "",
};

export interface SiteCta {
  id: string;
  label: string;
  description: string;
  number: string;
  message: string;
}

export const siteCtas: SiteCta[] = [
  {
    id: "exporte",
    label: "Exporte",
    description: "Hable con JIN Global Trading y ponga su producto en mercados internacionales.",
    number: whatsapp.jinGlobalTrading,
    message: "Hola, quiero exportar mi producto y necesito acompañamiento.",
  },
  {
    id: "proveedor",
    label: "Conviértase en nuestro proveedor",
    description: "Sume su producción a la oferta que llevamos a compradores del exterior.",
    number: whatsapp.traderMarketer,
    message: "Hola, quiero ser proveedor de la plataforma.",
  },
  {
    id: "muestras",
    label: "Envíe muestras",
    description: "Haga llegar sus muestras a los compradores que están evaluando proveedores.",
    number: whatsapp.traderMarketer,
    message: "Hola, quiero enviar muestras de mi producto.",
  },
];

export const whatsappLinkFor = (cta: SiteCta) =>
  cta.number ? `https://wa.me/${cta.number}?text=${encodeURIComponent(cta.message)}` : undefined;
