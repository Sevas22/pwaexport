import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ClientBoot } from "@/components/pwa/ClientBoot";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Trader Marketer · Exporta con los documentos en regla",
    template: "%s · Trader Marketer",
  },
  description:
    "Consulta qué documentos necesita tu exportación, controla cada operación y conecta con agencias aliadas de comercio exterior.",
  applicationName: "Trader Marketer",
  appleWebApp: { capable: true, title: "Trader Marketer", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1620" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <ClientBoot />
      </body>
    </html>
  );
}
