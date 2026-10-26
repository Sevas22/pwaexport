import type { MarketId } from "@/lib/types";

// Países de origen y destino del buscador.
// Cada destino se asocia al mercado con el que trabaja la base documental.

export interface DestinationCountry {
  code: string;
  name: string;
  market: MarketId;
}

export const destinationCountries: DestinationCountry[] = [
  { code: "us", name: "Estados Unidos", market: "us" },
  { code: "ca", name: "Canadá", market: "ca" },
  { code: "mx", name: "México", market: "latam" },
  { code: "br", name: "Brasil", market: "latam" },
  { code: "cl", name: "Chile", market: "latam" },
  { code: "pe", name: "Perú", market: "latam" },
  { code: "ec", name: "Ecuador", market: "latam" },
  { code: "pa", name: "Panamá", market: "latam" },
  { code: "ar", name: "Argentina", market: "latam" },
  { code: "cr", name: "Costa Rica", market: "latam" },
  { code: "do", name: "República Dominicana", market: "latam" },
  { code: "es", name: "España", market: "eu" },
  { code: "de", name: "Alemania", market: "eu" },
  { code: "nl", name: "Países Bajos", market: "eu" },
  { code: "fr", name: "Francia", market: "eu" },
  { code: "it", name: "Italia", market: "eu" },
  { code: "pt", name: "Portugal", market: "eu" },
  { code: "be", name: "Bélgica", market: "eu" },
  { code: "gb", name: "Reino Unido", market: "eu" },
  { code: "cn", name: "China", market: "cn" },
  { code: "jp", name: "Japón", market: "cn" },
  { code: "kr", name: "Corea del Sur", market: "cn" },
  { code: "ae", name: "Emiratos Árabes Unidos", market: "me" },
  { code: "sa", name: "Arabia Saudita", market: "me" },
  { code: "il", name: "Israel", market: "me" },
  { code: "tr", name: "Turquía", market: "me" },
];

export interface OriginCountry {
  code: string;
  name: string;
  /** "completa" = tenemos su base documental de salida; "parcial" = solo requisitos del destino. */
  coverage: "completa" | "parcial";
}

export const originCountries: OriginCountry[] = [
  { code: "co", name: "Colombia", coverage: "completa" },
  { code: "ve", name: "Venezuela", coverage: "parcial" },
  { code: "ec", name: "Ecuador", coverage: "parcial" },
  { code: "pe", name: "Perú", coverage: "parcial" },
  { code: "mx", name: "México", coverage: "parcial" },
  { code: "cl", name: "Chile", coverage: "parcial" },
  { code: "ar", name: "Argentina", coverage: "parcial" },
  { code: "br", name: "Brasil", coverage: "parcial" },
];

const destinationMap = Object.fromEntries(destinationCountries.map((item) => [item.code, item]));
const originMap = Object.fromEntries(originCountries.map((item) => [item.code, item]));

export const getDestination = (code: string): DestinationCountry | undefined => destinationMap[code];
export const getOrigin = (code: string): OriginCountry | undefined => originMap[code];

export const defaultOrigin = "co";
export const defaultDestination = "us";

/** Mercado al que pertenece un país de destino; si no lo conocemos, Estados Unidos. */
export function marketOf(code: string): MarketId {
  return destinationMap[code]?.market ?? "us";
}
