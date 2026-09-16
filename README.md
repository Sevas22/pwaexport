# Trader Marketer

PWA para pymes latinoamericanas que exportan. Muestra qué documentos necesita cada exportación, sigue el avance de cada operación y refiere al exportador a agencias aliadas de comercio exterior.

## Ejecutar

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000 (sin service worker)
npm run build && npm start   # producción, con service worker y modo sin conexión
```

Requiere Node 20.9 o superior. Se recomienda Node 20.19 o superior, que es lo que pide ESLint.

### Datos de demostración

La primera vez que se abre la app se cargan una empresa, 3 operaciones y 4 referidos ficticios (`src/data/demo.ts`), para que el demo no se vea vacío. En **Mi empresa** puedes restablecerlos o empezar sin datos.

## Cómo el código refleja el modelo de negocio

| Pieza del modelo | Dónde está |
| --- | --- |
| Rutas "De tu fábrica al mundo" y "eCommerce sin fronteras" | `src/data/catalog.ts` (`routes`, modos de envío por ruta) |
| Mercados (EE. UU., Canadá, UE, China, Medio Oriente, Latinoamérica) | `src/data/catalog.ts` (`markets`) |
| Base de conocimiento documental | `src/data/documents.ts` (40 documentos en 5 etapas, con reglas por modo, mercado y categoría) |
| Motor de requisitos | `src/lib/requirements.ts` (`documentsFor`, `groupByStage`, `alliesFor`) |
| Aliados estratégicos (15 tipos) | `src/data/catalog.ts` (`allyTypes`) y `src/data/allies.ts` (directorio **ficticio**) |
| Referidos a agencias | `src/components/referrals/ReferDialog.tsx`, `src/lib/referrals.ts` |
| Módulos TM Core (en la app, con aliados, próximamente) | `src/data/modules.ts` |
| Venta de espacios publicitarios | `Ally.sponsored` + `src/components/SponsoredAlly.tsx` (anuncio según el servicio y el mercado) |

## Pantallas

- `/`: landing con consulta en vivo ("Exporto ___ a ___ vía ___").
- `/panel`: operaciones en curso, referidos recientes y módulos TM Core.
- `/documentos`: asistente documental. La selección queda en la URL para compartirla. Cada documento tiene su ficha en `/documentos/[id]`.
- `/operaciones`: expedientes de exportación con checklist por documento (pendiente, en trámite, listo, no aplica).
- `/aliados`: directorio con filtros por servicio y mercado. Cada aliado tiene su perfil en `/aliados/[id]`.
- `/referidos`: historial con código `TM-XXXXXX` y estado (enviado, contactado, en proceso, cerrado, descartado).
- `/perfil`: datos de la empresa que se incluyen en cada referido.

## Datos y persistencia

Por ahora no hay backend. Operaciones, referidos y perfil se guardan en `localStorage` (Zustand) en `src/lib/store.ts`. Así la app funciona sin conexión, pero los datos viven en un solo dispositivo. El referido se envía a la agencia por correo o WhatsApp con un mensaje prearmado.

Para pasar a un backend, reemplaza las acciones del store (`createOperation`, `createReferral`, etc.) por llamadas a la API, sin cambiar su firma.

## PWA

- Manifiesto: `src/app/manifest.ts`. Íconos en `public/icons` (generados a partir de `src/app/icon.svg`).
- Service worker: `public/sw.js`. Solo se registra en producción (`src/components/pwa/ClientBoot.tsx`).
  - Archivos estáticos: primero caché. Páginas: primero red y, sin conexión, la copia en caché o `/offline`.
  - Si cambias la estrategia de caché, sube `VERSION` en `sw.js`.

## Pendiente antes de producción

1. Validar `src/data/documents.ts` con un agente de aduanas. Es información de referencia y la normativa cambia. Varias notas ya lo advierten: EUDR, de minimis en EE. UU. y envíos de bajo valor a la UE.
2. Reemplazar el directorio ficticio de `src/data/allies.ts` y los correos `.example` de `src/data/site.ts`.
3. Backend y autenticación: cuentas de exportadores, panel para que las agencias reciban y actualicen referidos, y sincronización entre dispositivos.
4. Métricas del inventario publicitario: impresiones y clics por espacio patrocinado, para vendérselos a los anunciantes.
5. Módulos de la hoja de ruta: clasificación arancelaria con IA, cotizaciones, contratos, tracking y analítica.
