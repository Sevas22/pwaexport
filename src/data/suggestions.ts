// Sugerencias del buscador: productos frecuentes de exportación colombiana.
// Sirven para que la persona no se quede en blanco y vea qué puede escribir.

export interface ProductSuggestion {
  label: string;
  code: string;
  hint: string;
}

export const productSuggestions: ProductSuggestion[] = [
  { label: "Café tostado en grano", code: "0901.21", hint: "Alimentos procesados" },
  { label: "Café verde sin tostar", code: "0901.11", hint: "Agro" },
  { label: "Cacao en grano", code: "1801.00", hint: "Agro" },
  { label: "Chocolate de mesa", code: "1806.90", hint: "Alimentos procesados" },
  { label: "Flores frescas cortadas", code: "0603.11", hint: "Agro" },
  { label: "Aguacate Hass", code: "0804.40", hint: "Agro" },
  { label: "Banano fresco", code: "0803.90", hint: "Agro" },
  { label: "Panela pulverizada", code: "1701.13", hint: "Alimentos procesados" },
  { label: "Miel de abejas", code: "0409.00", hint: "Alimentos procesados" },
  { label: "Snacks y pasabocas", code: "1905.90", hint: "Alimentos procesados" },
  { label: "Salsas y ají", code: "2103.90", hint: "Alimentos procesados" },
  { label: "Crema facial natural", code: "3304.99", hint: "Cosméticos" },
  { label: "Jabón artesanal", code: "3401.11", hint: "Cosméticos" },
  { label: "Aceites esenciales", code: "3301.29", hint: "Cosméticos" },
  { label: "Camisetas de algodón", code: "6109.10", hint: "Textil y moda" },
  { label: "Vestidos de baño", code: "6112.41", hint: "Textil y moda" },
  { label: "Jeans de algodón", code: "6203.42", hint: "Textil y moda" },
  { label: "Mochilas tejidas a mano", code: "4202.22", hint: "Artesanías" },
  { label: "Sombreros trenzados", code: "6504.00", hint: "Artesanías" },
  { label: "Cerámica decorativa", code: "6913.90", hint: "Artesanías" },
  { label: "Muebles de madera", code: "9403.60", hint: "Artesanías" },
  { label: "Autopartes y repuestos", code: "8708.99", hint: "Manufacturas" },
  { label: "Empaques plásticos", code: "3923.90", hint: "Manufacturas" },
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

export function filterSuggestions(query: string, limit = 6): ProductSuggestion[] {
  const text = normalize(query);
  if (text.length < 2) return [];
  return productSuggestions
    .filter((item) => normalize(item.label).includes(text) || item.code.startsWith(text.replace(/\s/g, "")))
    .slice(0, limit);
}

/** Ejemplos que se muestran debajo del buscador. */
export const searchExamples: { query: string; destination: string; label: string }[] = [
  { query: "Café tostado en grano", destination: "us", label: "Café tostado → EE. UU." },
  { query: "0901.21", destination: "es", label: "Partida 0901.21 → España" },
  { query: "Mochilas tejidas a mano", destination: "us", label: "Artesanías → EE. UU." },
  { query: "Crema facial natural", destination: "nl", label: "Cosméticos → Países Bajos" },
];
