"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/** Carga los datos locales y registra el service worker (solo en producción). */
export function ClientBoot() {
  useEffect(() => {
    useAppStore.persist.rehydrate();

    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        // Recursos que esta página cargó antes de que el service worker la controlara.
        const urls = performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((name) => name.startsWith(`${location.origin}/_next/static/`));
        registration.active?.postMessage({ type: "CACHE_URLS", urls: [location.pathname, ...urls] });
      })
      .catch((error) => console.error("No se pudo registrar el service worker", error));
  }, []);

  return null;
}
