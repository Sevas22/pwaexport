import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { buttonStyles } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <LogoMark className="size-12" />
      <h1 className="display mt-8 text-2xl">Esta página no existe</h1>
      <p className="mt-3 text-muted">Revisa la dirección o vuelve al panel para seguir con tu exportación.</p>
      <Link href="/panel" className={`${buttonStyles("primary")} mt-6`}>
        Ir al panel
      </Link>
    </main>
  );
}
