"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import type { ExportReport } from "@/lib/agent/types";
import type { AppUser } from "@/lib/auth";

// Guarda y lee informes: en Supabase cuando hay cuenta real, y en el
// dispositivo cuando la app corre en modo demostración.

export async function persistReport(report: ExportReport, user: AppUser) {
  const supabase = getSupabaseBrowser();
  if (!supabase || user.id.startsWith("demo-")) {
    useAppStore.getState().saveReport(report);
    return { error: undefined as string | undefined };
  }

  const { error } = await supabase.from("reports").upsert({
    id: report.id,
    user_id: user.id,
    query: report.input.query,
    product: report.classification.product,
    hs_code: report.classification.code,
    market: report.input.market,
    destination_country: report.input.destinationCountry ?? "",
    route: report.input.route,
    mode: report.input.mode,
    generated_by: report.generatedBy,
    model: report.model ?? null,
    payload: report,
  });

  if (error) {
    // Si la tabla aún no existe, al menos no se pierde el informe.
    useAppStore.getState().saveReport(report);
    return { error: error.message };
  }
  return { error: undefined };
}

export async function fetchReports(user: AppUser | null): Promise<ExportReport[]> {
  const local = useAppStore.getState().reports;
  const supabase = getSupabaseBrowser();
  if (!supabase || !user || user.id.startsWith("demo-")) return local;

  const { data, error } = await supabase
    .from("reports")
    .select("payload")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return local;
  return (data as { payload: ExportReport }[]).map((row) => row.payload);
}
