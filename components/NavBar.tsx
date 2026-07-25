"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useUsuario } from "@/lib/auth";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/estudio", label: "Estudio" },
  { href: "/guias", label: "Guías" },
  { href: "/comunidad", label: "Comunidad" },
];

export function NavBar() {
  const pathname = usePathname();
  const { listo, usuario } = useUsuario();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="contenedor flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Logo className="h-9 w-9" />
          <span className="font-display text-base font-bold tracking-widest">
            <span className="texto-neon">EVOX</span>
            <span className="ml-1 hidden text-foreground md:inline">ENTREPRENEUR</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const activo =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sub hidden rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors sm:block ${
                  activo
                    ? "bg-brand-soft text-brand-strong"
                    : "text-muted hover:text-foreground hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Área de sesión */}
          {listo &&
            (usuario ? (
              <Link
                href="/perfil"
                className={`flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-surface ${
                  pathname.startsWith("/perfil") ? "bg-brand-soft" : ""
                }`}
                title="Mi perfil"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-soft text-base">
                  {usuario.avatar}
                </span>
                <span className="hidden max-w-[8rem] truncate sm:inline">
                  {usuario.nombre.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/perfil"
                className="glow-brand rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-brand-ink transition-transform hover:scale-[1.03]"
              >
                Crear perfil
              </Link>
            ))}
        </div>
      </nav>
    </header>
  );
}
