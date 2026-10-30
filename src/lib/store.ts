"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildDemoData } from "@/data/demo";
import type { ExportReport } from "@/lib/agent/types";
import type { AppUser } from "@/lib/auth";
import { initialChecklist } from "@/lib/requirements";
import type {
  ChecklistStatus,
  CompanyProfile,
  ExportSelection,
  Operation,
  Referral,
  ReferralStatus,
} from "@/lib/types";

// Persistencia local (localStorage) para funcionar sin conexión como PWA.
// Este store es el punto de reemplazo cuando exista un backend: las acciones
// conservan la misma firma y pasarían a llamar a la API.

export type NewOperation = ExportSelection &
  Pick<Operation, "product" | "hsCode" | "destinationCountry" | "incoterm">;

export type NewReferral = Pick<Referral, "allyId" | "operationId" | "documentIds" | "note">;

interface AppState {
  profile: CompanyProfile;
  operations: Operation[];
  referrals: Referral[];
  /** Informes del agente guardados en este dispositivo (modo sin Supabase). */
  reports: ExportReport[];
  /** Cuenta local, solo cuando la app corre sin Supabase. */
  account: AppUser | null;
  setAccount: (account: AppUser | null) => void;
  saveReport: (report: ExportReport) => void;
  deleteReport: (reportId: string) => void;
  /** true cuando ya se cargaron (o descartaron) los datos de demostración. */
  seeded: boolean;
  loadDemo: () => void;
  clearData: () => void;
  saveProfile: (profile: CompanyProfile) => void;
  createOperation: (input: NewOperation) => Operation;
  setChecklistStatus: (operationId: string, documentId: string, status: ChecklistStatus) => void;
  deleteOperation: (operationId: string) => void;
  createReferral: (input: NewReferral) => Referral;
  setReferralStatus: (referralId: string, status: ReferralStatus) => void;
}

const emptyProfile: CompanyProfile = {
  company: "",
  taxId: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
};

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function referralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `PZ-${code}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: emptyProfile,
      operations: [],
      referrals: [],
      reports: [],
      account: null,
      seeded: false,

      setAccount: (account) => set({ account }),

      saveReport: (report) =>
        set({ reports: [report, ...get().reports.filter((item) => item.id !== report.id)].slice(0, 50) }),

      deleteReport: (reportId) => set({ reports: get().reports.filter((item) => item.id !== reportId) }),

      loadDemo: () => set({ ...buildDemoData(), seeded: true }),

      clearData: () => set({ profile: emptyProfile, operations: [], referrals: [], seeded: true }),

      saveProfile: (profile) => set({ profile }),

      createOperation: (input) => {
        const year = new Date().getFullYear();
        const prefix = `EXP-${year}-`;
        const sequence =
          Math.max(0, ...get().operations.filter((op) => op.code.startsWith(prefix)).map((op) => Number(op.code.slice(prefix.length)))) + 1;
        const operation: Operation = {
          ...input,
          id: randomId(),
          code: `EXP-${year}-${String(sequence).padStart(4, "0")}`,
          createdAt: new Date().toISOString(),
          checklist: initialChecklist(input),
        };
        set({ operations: [operation, ...get().operations] });
        return operation;
      },

      setChecklistStatus: (operationId, documentId, status) =>
        set({
          operations: get().operations.map((op) =>
            op.id === operationId
              ? { ...op, checklist: { ...op.checklist, [documentId]: status } }
              : op,
          ),
        }),

      deleteOperation: (operationId) =>
        set({
          operations: get().operations.filter((op) => op.id !== operationId),
          referrals: get().referrals.map((ref) =>
            ref.operationId === operationId ? { ...ref, operationId: undefined } : ref,
          ),
        }),

      createReferral: (input) => {
        const now = new Date().toISOString();
        const referral: Referral = {
          ...input,
          id: randomId(),
          code: referralCode(),
          status: "enviado",
          createdAt: now,
          history: [{ status: "enviado", at: now }],
        };
        set({ referrals: [referral, ...get().referrals] });
        return referral;
      },

      setReferralStatus: (referralId, status) =>
        set({
          referrals: get().referrals.map((ref) =>
            ref.id === referralId
              ? { ...ref, status, history: [...ref.history, { status, at: new Date().toISOString() }] }
              : ref,
          ),
        }),
    }),
    {
      name: "trader-marketer",
      version: 2,
      skipHydration: true,
      partialize: ({ profile, operations, referrals, reports, account, seeded }) => ({
        profile,
        operations,
        referrals,
        reports,
        account,
        seeded,
      }),
      migrate: (persisted) => ({ ...(persisted as object), seeded: true }),
      // Primera visita: carga el demo para que la app no se vea vacía.
      onRehydrateStorage: () => (state) => {
        if (state && !state.seeded) state.loadDemo();
      },
    },
  ),
);

const subscribeHydration = (callback: () => void) => useAppStore.persist.onFinishHydration(callback);

/** true cuando los datos locales ya se cargaron; evita parpadeos y errores de hidratación. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
