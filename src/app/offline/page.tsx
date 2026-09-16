import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "Sin conexión" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <LogoMark className="size-12" />
      <WifiOff className="mt-8 size-6 text-muted" aria-hidden />
      <h1 className="display mt-3 text-2xl">Estás sin conexión</h1>
      <p className="mt-3 text-muted">
        Esta página aún no está guardada en tu dispositivo. Tus operaciones y referidos siguen disponibles en el panel.
      </p>
      <Link href="/panel" className={`${buttonStyles("primary")} mt-6`}>
        Ir al panel
      </Link>
    </main>
  );
}
