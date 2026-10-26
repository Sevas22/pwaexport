import type { ComponentProps, ComponentType, ReactNode } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

export function buttonStyles(variant: ButtonVariant = "primary", size: "sm" | "md" | "lg" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    size === "lg" && "h-12 px-5 text-base",
    size === "md" && "h-11 px-4 text-[0.95rem]",
    size === "sm" && "h-9 rounded-lg px-3 text-sm",
    variant === "primary" &&
      "bg-gradient-to-b from-seal to-seal-strong text-on-seal shadow-[0_1px_0_rgb(255_255_255/0.2)_inset,0_8px_20px_-10px_rgb(30_122_78/0.7)] hover:brightness-110",
    variant === "secondary" && "border border-rule bg-card text-ink shadow-card hover:border-seal/50 hover:text-seal-strong",
    variant === "ghost" && "text-muted hover:bg-seal-tint hover:text-seal-strong",
    variant === "dark" && "bg-white text-navy hover:bg-seal-tint",
  );
}

const control =
  "w-full rounded-xl border border-rule bg-card px-3.5 text-ink shadow-[0_1px_2px_rgb(var(--shadow-color)/0.04)] transition-colors placeholder:text-muted/60 hover:border-muted/40 focus:border-seal focus:ring-4 focus:ring-seal/10 focus:outline-none";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-rule bg-card shadow-card", className)} {...props} />;
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: ReactNode;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24 py-2.5", className)} {...props} />;
}

export type Tone = "seal" | "amber" | "sky" | "rose" | "muted" | "navy";

const toneClasses: Record<Tone, string> = {
  seal: "bg-seal-tint text-seal-strong",
  amber: "bg-amber-tint text-amber",
  sky: "bg-sky-tint text-sky",
  rose: "bg-rose-tint text-rose",
  muted: "bg-paper text-muted",
  navy: "bg-navy text-white",
};

export function Badge({ tone = "seal", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function IconTile({
  icon: Icon,
  tone = "seal",
  size = "md",
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        size === "sm" && "size-8 rounded-lg",
        size === "md" && "size-10",
        size === "lg" && "size-12 rounded-2xl",
        toneClasses[tone],
        className,
      )}
    >
      <Icon className={cn(size === "sm" ? "size-4" : size === "md" ? "size-5" : "size-6")} />
    </span>
  );
}

export function RequirementBadge({ requirement }: { requirement: "obligatorio" | "condicional" }) {
  return requirement === "obligatorio" ? (
    <Badge tone="seal">Obligatorio</Badge>
  ) : (
    <Badge tone="amber">Condicional</Badge>
  );
}

export function ProgressRing({
  ratio,
  size = 48,
  stroke = 5,
  label,
  className,
}: {
  ratio: number;
  size?: number;
  stroke?: number;
  label?: ReactNode;
  className?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(ratio * 100)} % completado`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-rule" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="stroke-trace transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute text-xs font-semibold tabular-nums">{label ?? `${Math.round(ratio * 100)}%`}</span>
    </span>
  );
}

const avatarPalette = [
  "from-[#1e7a4e] to-[#2fae6d]",
  "from-[#0b2239] to-[#2563a8]",
  "from-[#7a4b1e] to-[#c98a2e]",
  "from-[#4b2a7a] to-[#8a5cc9]",
  "from-[#145c5c] to-[#2fa3a3]",
  "from-[#7a1e3d] to-[#c94f73]",
];

export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter((word) => /^[A-ZÁÉÍÓÚÑ]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-semibold text-white",
        avatarPalette[hash % avatarPalette.length],
        size === "sm" && "size-8 rounded-lg text-xs",
        size === "md" && "size-11 text-sm",
        size === "lg" && "size-16 rounded-2xl text-xl",
        className,
      )}
    >
      {initials || name[0]}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  icon,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <header className="flex flex-col gap-5 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-2xl gap-4">
        {icon && <IconTile icon={icon} size="lg" className="hidden sm:flex" />}
        <div>
          {eyebrow && <p className="eyebrow mb-1.5 text-seal">{eyebrow}</p>}
          <h1 className="display text-balance text-[1.85rem] sm:text-[2.2rem]">{title}</h1>
          {description && <p className="mt-2 max-w-xl text-[0.97rem] leading-relaxed text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="display text-lg sm:text-xl">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-rule bg-card/60 px-6 py-12 text-center">
      {icon && <IconTile icon={icon} size="lg" tone="muted" className="mb-4" />}
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex flex-col gap-4 py-2" aria-label="Cargando tus datos" role="status">
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-rule/70" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-rule/60" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-rule/50" />
    </div>
  );
}
