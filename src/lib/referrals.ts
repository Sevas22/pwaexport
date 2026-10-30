import { getMarket, getCategory, modeLabels } from "@/data/catalog";
import { getDocument } from "@/lib/requirements";
import { site } from "@/data/site";
import type { Tone } from "@/components/ui";
import type { Ally, CompanyProfile, Operation, Referral, ReferralStatus } from "@/lib/types";

export const referralStatuses: { id: ReferralStatus; label: string }[] = [
  { id: "enviado", label: "Enviado" },
  { id: "contactado", label: "Contactado" },
  { id: "en-proceso", label: "En proceso" },
  { id: "cerrado", label: "Cerrado" },
  { id: "descartado", label: "Descartado" },
];

export const referralStatusLabel = (status: ReferralStatus) =>
  referralStatuses.find((item) => item.id === status)?.label ?? status;

const statusTones: Record<ReferralStatus, Tone> = {
  enviado: "sky",
  contactado: "amber",
  "en-proceso": "seal",
  cerrado: "navy",
  descartado: "rose",
};

export const referralTone = (status: ReferralStatus) => statusTones[status];

/** Mensaje que recibe la agencia aliada al abrir el referido. */
export function referralMessage(
  referral: Referral,
  ally: Ally,
  profile: CompanyProfile,
  operation?: Operation,
) {
  const lines = [
    `Hola, ${ally.name}.`,
    "",
    `Les refiero una exportación desde ${site.name}. Código de referido: ${referral.code}`,
  ];

  if (operation) {
    lines.push(
      "",
      `Operación ${operation.code}: ${operation.product}`,
      `Destino: ${operation.destinationCountry || getMarket(operation.market).name} · ${modeLabels[operation.mode]} · ${operation.incoterm}`,
      `Categoría: ${getCategory(operation.category).name}${operation.hsCode ? ` · Subpartida ${operation.hsCode}` : ""}`,
    );
  }

  const docs = referral.documentIds.map((id) => getDocument(id)?.name).filter(Boolean);
  if (docs.length) lines.push("", "Necesito apoyo con:", ...docs.map((name) => `- ${name}`));
  if (referral.note.trim()) lines.push("", referral.note.trim());

  const contact = [profile.contactName, profile.company, profile.taxId && `NIT ${profile.taxId}`]
    .filter(Boolean)
    .join(" · ");
  const reach = [profile.email, profile.phone].filter(Boolean).join(" · ");
  if (contact || reach) lines.push("", "Contacto:", ...[contact, reach].filter(Boolean));

  return lines.filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n");
}

export function mailtoLink(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappLink(body: string) {
  return `https://wa.me/?text=${encodeURIComponent(body)}`;
}
