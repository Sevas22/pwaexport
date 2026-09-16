import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/panel",
    name: "Trader Marketer",
    short_name: "Trader",
    description:
      "Documentos de exportación, operaciones y referidos a agencias aliadas de comercio exterior.",
    lang: "es",
    start_url: "/panel",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f5f3",
    theme_color: "#0e2a47",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Consultar documentos", url: "/documentos" },
      { name: "Nueva operación", url: "/operaciones/nueva" },
      { name: "Mis referidos", url: "/referidos" },
    ],
  };
}
