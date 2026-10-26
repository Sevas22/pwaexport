import "server-only";
import { isGroqConfigured } from "@/lib/env";
import { buildBaseReport } from "@/lib/agent/fallback";
import { classifyWithRules } from "@/lib/agent/knowledge";
import { classifyWithAgent, writeReportWithAgent } from "@/lib/agent/groq";
import type { ExportReport, HsClassification, ReportInput } from "@/lib/agent/types";

// Orquestador del agente: si hay clave de Groq usa el modelo; si falla o no hay
// clave, responde con el informe armado desde la base documental propia.

export async function classify(input: ReportInput): Promise<HsClassification> {
  if (!isGroqConfigured) return classifyWithRules(input.query);
  try {
    return await classifyWithAgent(input);
  } catch (error) {
    console.error("Agente: falló la clasificación, se usa la base propia", error);
    return classifyWithRules(input.query);
  }
}

export async function generateReport(input: ReportInput, id: string): Promise<ExportReport> {
  const base = buildBaseReport(input, id);
  if (!isGroqConfigured) return base;

  try {
    const classification = await classify(input);
    return await writeReportWithAgent(input, classification, id);
  } catch (error) {
    console.error("Agente: falló la redacción del informe, se usa la base propia", error);
    return base;
  }
}
