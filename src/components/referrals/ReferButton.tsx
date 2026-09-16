"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { ReferDialog, type ReferContext } from "@/components/referrals/ReferDialog";
import { buttonStyles, cn } from "@/components/ui";

export function ReferButton({
  context,
  label = "Referir mi exportación",
  variant = "primary",
  className,
}: {
  context: ReferContext;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn(buttonStyles(variant), className)}>
        <Send className="size-4" aria-hidden />
        {label}
      </button>
      <ReferDialog context={open ? context : null} onClose={() => setOpen(false)} />
    </>
  );
}
