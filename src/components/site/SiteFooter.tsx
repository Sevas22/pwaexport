import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 md:grid-cols-4 lg:grid-cols-7">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="display text-lg">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted">{site.tagline}.</p>
        </div>

        {navigation.map((section) => (
          <div key={section.slug}>
            <Link href={`/${section.slug}`} className="text-sm font-semibold hover:text-seal-strong">
              {section.label}
            </Link>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
              {section.children.map((child) => (
                <li key={child.slug}>
                  <Link href={child.href ?? `/${section.slug}/${child.slug}`} className="hover:text-seal-strong">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-rule">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {site.name}. Información de referencia para comercio exterior: valide cada
          operación con un agente de aduanas.
        </p>
      </div>
    </footer>
  );
}
