import { cn } from "@/components/ui";
import { site } from "@/data/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <rect width="512" height="512" rx="112" fill="#0E2A47" />
      <g fill="none" stroke="#3FB07A" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round">
        <path d="M140 372H236V236H380" />
        <path d="M324 180l56 56-56 56" />
      </g>
      <circle cx="140" cy="372" r="40" fill="#F2F5F3" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="display text-[1.15rem] leading-none">{site.name}</span>
    </span>
  );
}
