"use client";

import type { Proyecto } from "@/lib/community";
import { ETAPA_LABEL } from "@/lib/community";

export function Etiqueta({
  children,
  tono = "neutro",
}: {
  children: React.ReactNode;
  tono?: "ofrezco" | "busco" | "neutro";
}) {
  const cls =
    tono === "ofrezco"
      ? "bg-brand-soft text-brand-strong"
      : tono === "busco"
        ? "bg-accent-soft text-accent-strong"
        : "bg-surface-2 text-muted";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export function ProyectoCard({
  proyecto,
  esMio,
  onConectar,
}: {
  proyecto: Proyecto;
  esMio?: boolean;
  onConectar: (p: Proyecto) => void;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-2xl">
          {proyecto.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-bold">{proyecto.nombre}</h3>
            {esMio && (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-ink">
                TÚ
              </span>
            )}
          </div>
          <p className="truncate text-sm text-muted">
            {proyecto.emprendedor} · {proyecto.ubicacion}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Etiqueta>{proyecto.categoria}</Etiqueta>
        <Etiqueta>{ETAPA_LABEL[proyecto.etapa]}</Etiqueta>
      </div>

      <p className="mt-3 text-sm text-foreground/85">{proyecto.descripcion}</p>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-strong">
            Ofrece
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {proyecto.ofrezco.map((o) => (
              <Etiqueta key={o} tono="ofrezco">
                {o}
              </Etiqueta>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong">
            Busca
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {proyecto.busco.map((b) => (
              <Etiqueta key={b} tono="busco">
                {b}
              </Etiqueta>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onConectar(proyecto)}
        className="mt-5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-soft"
      >
        Ver a quién te conviene conocer
      </button>
    </article>
  );
}
