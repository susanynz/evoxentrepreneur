import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="contenedor flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="h-16 w-auto" />
        <nav className="font-sub flex flex-wrap gap-x-5 gap-y-2 text-sm uppercase tracking-wide text-muted">
          <Link href="/estudio" className="hover:text-foreground">
            Estudio
          </Link>
          <Link href="/comunidad" className="hover:text-foreground">
            Comunidad
          </Link>
          <Link href="/perfil" className="hover:text-foreground">
            Perfil
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="contenedor flex flex-col gap-1 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Parte del ecosistema EVOXVERSE · Belong to the evolution.</span>
          <span>
            Evox Entrepreneur acompaña, no reemplaza tu criterio. Un punto de
            partida para decidir mejor.
          </span>
        </p>
      </div>
    </footer>
  );
}
