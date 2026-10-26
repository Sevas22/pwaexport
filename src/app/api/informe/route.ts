import type { NextRequest } from "next/server";
import { generateReport } from "@/lib/agent";
import { isGroqConfigured } from "@/lib/env";
import { isRouteId, modesFor } from "@/data/catalog";
import { defaultDestination, defaultOrigin, getDestination, getOrigin, marketOf } from "@/data/countries";
import type { ReportInput } from "@/lib/agent/types";
import type { TransportMode } from "@/lib/types";

// Genera el informe de exportación con el agente de IA.
// Sin clave de Groq responde con el informe armado desde la base documental.

const MAX_QUERY = 160;

// Límite simple por IP para que el demo no se dispare en consumo.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Demasiadas consultas seguidas. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  let body: Partial<ReportInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Petición inválida." }, { status: 400 });
  }

  const query = String(body.query ?? "").trim().slice(0, MAX_QUERY);
  if (query.length < 3) {
    return Response.json({ error: "Escribe el producto o la partida arancelaria que quieres exportar." }, { status: 400 });
  }

  const origin = getOrigin(String(body.origin ?? "")) ? String(body.origin) : defaultOrigin;
  const destinationCode = getDestination(String(body.destination ?? "")) ? String(body.destination) : defaultDestination;
  const market = marketOf(destinationCode);
  const route = isRouteId(body.route) ? body.route : "ordinaria";
  const modes = modesFor(route, market);
  const mode = modes.includes(body.mode as TransportMode) ? (body.mode as TransportMode) : modes[0];

  const input: ReportInput = {
    query,
    origin,
    destination: destinationCode,
    market,
    route,
    mode,
    destinationCountry: getDestination(destinationCode)?.name,
  };

  try {
    const report = await generateReport(input, crypto.randomUUID());
    return Response.json({ report, agent: isGroqConfigured });
  } catch (error) {
    console.error("No se pudo generar el informe", error);
    return Response.json({ error: "No pudimos generar el informe. Inténtalo de nuevo." }, { status: 500 });
  }
}
