"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ReportView } from "@/components/report/ReportView";
import { EmptyState, Loading, buttonStyles } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { fetchReports } from "@/lib/reports";
import type { ExportReport } from "@/lib/agent/types";

export default function SavedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const [report, setReport] = useState<ExportReport | null | "missing">(null);

  useEffect(() => {
    let active = true;
    fetchReports(user).then((reports) => {
      if (active) setReport(reports.find((item) => item.id === id) ?? "missing");
    });
    return () => {
      active = false;
    };
  }, [user, id]);

  if (loading || report === null) return <Loading />;

  if (report === "missing") {
    return (
      <EmptyState title="No encontramos este informe">
        <p>Puede que se haya generado en otro dispositivo o con otra cuenta.</p>
        <Link href="/informes" className={`${buttonStyles("primary", "sm")} mt-4`}>
          Ver mis informes
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      <Link href="/informes" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Informes
      </Link>
      <div className="mt-2">
        <ReportView report={report} unlocked={Boolean(user)} authLoading={loading} />
      </div>
    </>
  );
}
