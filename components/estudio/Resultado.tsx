"use client";

import { useState } from "react";
import type { Analisis, NivelVeredicto, Severidad } from "@/lib/types";

type Tab = "validacion" | "pulida" | "plan" | "posicionamiento" | "identidad";

const TABS: { id: Tab; label: string }[] = [
  { id: "validacion", label: "Validación" },
  { id: "pulida", label: "Idea pulida" },
  { id: "plan", label: "Plan de ejecución" },
  { id: "posicionamiento", label: "Posicionamiento" },
  { id: "identidad", label: "Identidad visual" },
];

export function Resultado({
  analisis,
  fuente,
  onReset,
  resetLabel = "Analizar otra idea",
  onGuardar,
  guardado,
}: {
  analisis: Analisis;
  fuente: "ia" | "ejemplo";
  onReset: () => void;
  resetLabel?: string;
  onGuardar?: () => void;
  guardado?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("validacion");

  return (
    <div className="animar-subir">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Tu análisis</h1>
        <div className="flex flex-wrap items-center gap-2">
          {onGuardar && (
            <button
              onClick={onGuardar}
              disabled={guardado}
              className="glow-brand rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
            >
              {guardado ? "Guardado ✓" : "Guardar en mi perfil"}
            </button>
          )}
          <button
            onClick={onReset}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            {resetLabel}
          </button>
        </div>
      </div>

      {fuente === "ejemplo" && (
        <div className="mt-4 rounded-xl border border-media/40 bg-media-soft px-4 py-3 text-sm text-foreground">
          <strong>Respuesta de ejemplo.</strong> Para recibir análisis reales de
          IA, configura tu <code className="font-mono">ANTHROPIC_API_KEY</code> en
          el servidor. Mientras tanto, así se ve el flujo completo.
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-brand text-brand-strong"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "validacion" && <Validacion analisis={analisis} />}
        {tab === "pulida" && <Pulida analisis={analisis} />}
        {tab === "plan" && <Plan analisis={analisis} />}
        {tab === "posicionamiento" && <Posicionamiento analisis={analisis} />}
        {tab === "identidad" && <Identidad analisis={analisis} />}
      </div>
    </div>
  );
}

/* ---------------- Validación ---------------- */

const NIVEL_META: Record<NivelVeredicto, { label: string; cls: string }> = {
  adelante: { label: "Adelante", cls: "bg-baja-soft text-baja" },
  ajustar: { label: "Ajustar", cls: "bg-media-soft text-media" },
  replantear: { label: "Replantear", cls: "bg-alta-soft text-alta" },
};

function Validacion({ analisis }: { analisis: Analisis }) {
  const { veredicto, fortalezas, puntosDebiles } = analisis;
  const nivel = NIVEL_META[veredicto.nivel];

  return (
    <div className="space-y-8">
      {/* Veredicto */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted">Veredicto</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${nivel.cls}`}>
            {nivel.label}
          </span>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-display text-6xl font-bold text-brand">
            {veredicto.puntuacion}
          </span>
          <span className="pb-2 text-sm text-muted">/ 100 viabilidad</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${Math.max(0, Math.min(100, veredicto.puntuacion))}%` }}
          />
        </div>
        <p className="mt-4 text-foreground/90">{veredicto.resumen}</p>
      </section>

      {/* Fortalezas */}
      <section>
        <h2 className="text-lg font-bold">Lo que juega a tu favor</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fortalezas.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="text-brand">✓</span>
                <h3 className="font-semibold">{f.titulo}</h3>
              </div>
              <p className="mt-2 text-sm text-muted">{f.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Puntos débiles — el abogado del diablo constructivo */}
      <section>
        <h2 className="text-lg font-bold">Riesgos y cómo superarlos</h2>
        <p className="mt-1 text-sm text-muted">
          Cada riesgo real, con su &ldquo;cómo sí&rdquo; para ejecutarlo mejor.
        </p>
        <div className="mt-4 space-y-4">
          {puntosDebiles.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold">{p.riesgo}</h3>
                <BadgeSeveridad severidad={p.severidad} />
              </div>
              <p className="mt-2 text-sm text-muted">{p.porQueImporta}</p>
              <div className="mt-3 rounded-xl border-l-4 border-brand bg-brand-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-strong">
                  Cómo sí
                </p>
                <p className="mt-1 text-sm text-foreground">{p.comoSuperarlo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const SEV_META: Record<Severidad, { label: string; cls: string }> = {
  alta: { label: "Alta", cls: "bg-alta-soft text-alta" },
  media: { label: "Media", cls: "bg-media-soft text-media" },
  baja: { label: "Baja", cls: "bg-baja-soft text-baja" },
};

function BadgeSeveridad({ severidad }: { severidad: Severidad }) {
  const m = SEV_META[severidad];
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${m.cls}`}>
      Riesgo {m.label.toLowerCase()}
    </span>
  );
}

/* ---------------- Idea pulida ---------------- */

function Pulida({ analisis }: { analisis: Analisis }) {
  const { ideaPulida } = analisis;
  const items = [
    { t: "Cliente ideal", v: ideaPulida.clienteIdeal, emoji: "🎯" },
    { t: "Diferenciador", v: ideaPulida.diferenciador, emoji: "💎" },
    { t: "Modelo de ingresos", v: ideaPulida.modeloIngresos, emoji: "💰" },
  ];
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border-2 border-brand bg-brand-soft p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
          Propuesta de valor afinada
        </p>
        <p className="mt-2 text-xl font-medium text-foreground">
          {ideaPulida.propuestaValor}
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.t} className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-2xl">{it.emoji}</div>
            <h3 className="mt-2 font-semibold">{it.t}</h3>
            <p className="mt-1 text-sm text-muted">{it.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Plan de ejecución ---------------- */

function Plan({ analisis }: { analisis: Analisis }) {
  return (
    <ol className="space-y-6">
      {analisis.planEjecucion.map((fase, i) => (
        <li key={i} className="relative rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-bold text-brand-ink">
              {i + 1}
            </span>
            <h3 className="text-lg font-bold">{fase.fase}</h3>
          </div>
          <p className="mt-3 text-foreground/90">{fase.objetivo}</p>
          <ul className="mt-4 space-y-2">
            {fase.pasos.map((paso, j) => (
              <li key={j} className="flex gap-3 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{paso}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm">
            <span className="font-semibold text-brand-strong">Meta de la fase: </span>
            {fase.metrica}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Posicionamiento ---------------- */

function Posicionamiento({ analisis }: { analisis: Analisis }) {
  const { posicionamientoDigital: pos } = analisis;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border-2 border-accent bg-accent-soft p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">
            Mensaje clave
          </p>
          <p className="mt-2 text-lg font-medium text-foreground">{pos.mensajeClave}</p>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            En palabras de tu cliente
          </p>
          <p className="mt-2 text-foreground/90">{pos.publicoEnPalabras}</p>
        </section>
      </div>

      <section>
        <h2 className="text-lg font-bold">Canales recomendados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pos.canales.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-bold text-brand-strong">{c.canal}</h3>
              <p className="mt-2 text-sm text-muted">{c.porQue}</p>
              <div className="mt-3 border-t border-border pt-3 text-sm">
                <span className="font-semibold">Primera acción: </span>
                {c.primeraAccion}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">Tus primeros 30 días</h2>
        <ol className="mt-4 space-y-3">
          {pos.primeros30Dias.map((paso, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
              <span className="font-mono text-sm font-semibold text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm">{paso}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ---------------- Identidad visual ---------------- */

function esHex(s: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s.trim());
}

// Elige texto claro u oscuro según la luminancia del color de fondo.
function textoSobre(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#111111" : "#ffffff";
}

function Identidad({ analisis }: { analisis: Analisis }) {
  const id = analisis.identidadVisual;
  return (
    <div className="space-y-8">
      {/* Nombre + tagline */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          Nombres sugeridos
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {id.nombresSugeridos.map((n) => (
            <span
              key={n}
              className="rounded-lg bg-brand-soft px-3 py-1.5 font-display font-bold text-brand-strong"
            >
              {n}
            </span>
          ))}
        </div>
        <p className="mt-4 font-display text-2xl font-bold">
          &ldquo;{id.tagline}&rdquo;
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {id.personalidad.map((p) => (
            <span
              key={p}
              className="rounded-full border border-border px-3 py-1 text-sm text-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Paleta */}
      <section>
        <h2 className="text-lg font-bold">Paleta de colores</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {id.paleta.map((c, i) => {
            const valido = esHex(c.hex);
            const bg = valido ? c.hex : "var(--surface-2)";
            const fg = valido ? textoSobre(c.hex) : "var(--foreground)";
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-border">
                <div
                  className="flex h-24 items-end p-3"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  <span className="font-mono text-sm font-semibold">
                    {c.hex.toUpperCase()}
                  </span>
                </div>
                <div className="bg-surface p-3">
                  <p className="font-semibold">{c.nombre}</p>
                  <p className="mt-0.5 text-xs text-muted">{c.uso}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tipografía */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-bold">Tipografía</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Títulos
            </p>
            <p
              className="mt-1 text-3xl font-bold"
              style={{ fontFamily: `${id.tipografia.titulos}, var(--font-display), sans-serif` }}
            >
              {id.tipografia.titulos}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Cuerpo
            </p>
            <p
              className="mt-1 text-lg"
              style={{ fontFamily: `${id.tipografia.cuerpo}, var(--font-sans), sans-serif` }}
            >
              {id.tipografia.cuerpo} — texto de ejemplo para tu marca.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">{id.tipografia.nota}</p>
      </section>

      {/* Logo + tono */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span>✦</span> Concepto de logo
          </h2>
          <p className="mt-2 text-foreground/90">{id.logo}</p>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span>🎨</span> Estilo e imágenes
          </h2>
          <p className="mt-2 text-foreground/90">{id.imagenYTono}</p>
        </section>
      </div>

      <p className="text-sm text-muted">
        Consejo: usa estos colores y fuentes tal cual en Canva o pásaselos a tu
        diseñador. Las fuentes sugeridas están en Google Fonts (gratis).
      </p>
    </div>
  );
}
