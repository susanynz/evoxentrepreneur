"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUsuario } from "@/lib/auth";
import type { BrandBook, BrandBookRespuesta } from "@/lib/brandbookTypes";

export default function LabPage() {
  const { analisis } = useUsuario();
  const [nombre, setNombre] = useState("");
  const [contexto, setContexto] = useState("");
  const [estado, setEstado] = useState<"form" | "cargando" | "resultado">("form");
  const [respuesta, setRespuesta] = useState<BrandBookRespuesta | null>(null);

  useEffect(() => {
    const ult = analisis[0];
    if (ult) {
      setContexto(
        `${ult.input.producto}. Cliente: ${ult.input.cliente}. Etapa: ${ult.input.etapa}.`.slice(0, 600),
      );
    }
  }, [analisis]);

  async function generar() {
    if (!contexto.trim()) return;
    setEstado("cargando");
    try {
      const res = await fetch("/api/brandbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contexto: contexto.trim(), nombre: nombre.trim() }),
      });
      const data = (await res.json()) as BrandBookRespuesta;
      setRespuesta(data);
      setEstado("resultado");
    } catch {
      setEstado("form");
    }
  }

  return (
    <div className="contenedor max-w-5xl py-12">
      {estado !== "resultado" && (
        <header className="max-w-2xl no-print">
          <span className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-brand-strong">
            El Lab
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Tu brand book, con IA</h1>
          <p className="mt-3 text-lg text-muted">
            Genera un brand book profesional completo —esencia, paleta, tipografías,
            logo, tono y más— listo para usar en Canva o dárselo a tu diseñador.
            Descárgalo en PDF cuando quieras.
          </p>
        </header>
      )}

      {estado === "cargando" ? (
        <div className="mt-10 flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="animar-pulso text-4xl">🎨</div>
          <p className="mt-4 text-lg font-medium">Creando tu identidad de marca…</p>
          <p className="mt-1 text-sm text-muted">Vale la pena, toma unos segundos.</p>
        </div>
      ) : estado === "resultado" && respuesta ? (
        <>
          <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Tu brand book</h1>
              {respuesta.fuente === "ejemplo" && (
                <p className="text-sm text-media">
                  Ejemplo — con tu API key de Claude se genera a tu medida.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="glow-brand rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink"
              >
                Descargar PDF
              </button>
              <button
                onClick={() => {
                  setRespuesta(null);
                  setEstado("form");
                }}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
              >
                Otro
              </button>
            </div>
          </div>
          <BrandBookDoc bb={respuesta.brandbook} />
          <p className="no-print mt-4 text-xs text-muted">
            Para el PDF: pulsa «Descargar PDF» y elige «Guardar como PDF» en el diálogo.
          </p>
        </>
      ) : (
        <section className="no-print mt-8 max-w-2xl space-y-4 rounded-2xl border border-border bg-surface p-6">
          <label className="block">
            <span className="text-sm font-semibold">Nombre de tu marca (opcional)</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Si aún no lo tienes, lo proponemos"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Describe tu negocio</span>
            <textarea
              rows={4}
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              placeholder="Qué ofreces, a quién y qué te hace especial…"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <button
            onClick={generar}
            disabled={!contexto.trim()}
            className="glow-brand rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            Generar mi brand book
          </button>
          <p className="text-xs text-muted">
            ¿Aún no defines tu negocio?{" "}
            <Link href="/estudio" className="text-blue hover:underline">
              Empieza en el Estudio →
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}

/* ---------------- Documento del brand book (claro, imprimible) ---------------- */

const C = {
  bg: "#ffffff",
  text: "#1c1c1e",
  muted: "#6b6b70",
  border: "#e7e7ea",
  label: "#6d28d9",
  soft: "#f6f5fa",
};

function esHex(s: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s.trim());
}
function textoSobre(hex: string): string {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(f.slice(0, 2), 16);
  const g = parseInt(f.slice(2, 4), 16);
  const b = parseInt(f.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#111" : "#fff";
}

function BrandBookDoc({ bb }: { bb: BrandBook }) {
  return (
    <div
      className="bb-doc overflow-hidden rounded-2xl border"
      style={{ background: C.bg, color: C.text, borderColor: C.border }}
    >
      {/* Cabecera */}
      <div className="p-7 sm:p-10" style={{ borderBottom: `1px solid ${C.border}` }}>
        <p style={{ color: C.label, fontSize: 12, letterSpacing: "0.2em", fontWeight: 600 }}>
          BRAND BOOK
        </p>
        <h2 className="mt-2 text-4xl font-bold sm:text-5xl" style={{ color: C.text }}>
          {bb.marca.nombre}
        </h2>
        <p className="mt-2 text-lg" style={{ color: C.muted }}>
          {bb.marca.tagline}
        </p>
        <p className="mt-3 max-w-2xl" style={{ color: C.text }}>
          {bb.marca.descripcion}
        </p>
      </div>

      <div className="grid gap-px sm:grid-cols-2" style={{ background: C.border }}>
        <Bloque titulo="Esencia de marca" bg={C.bg}>
          <Dl k="Qué hago" v={bb.esencia.queHago} />
          <Dl k="Para quién" v={bb.esencia.paraQuien} />
          <Dl k="Qué problema resuelvo" v={bb.esencia.queProblema} />
          <Dl k="Qué transformación prometo" v={bb.esencia.queTransformacion} />
        </Bloque>

        <Bloque titulo="Misión · Visión · Propósito" bg={C.bg}>
          <Dl k="Misión" v={bb.mision} />
          <Dl k="Visión" v={bb.vision} />
          <Dl k="Propósito" v={bb.proposito} />
        </Bloque>

        <Bloque titulo="Personalidad de marca" bg={C.bg}>
          <Chips items={bb.personalidad} />
        </Bloque>

        <Bloque titulo="Mapa emocional" bg={C.bg}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>PROVOCA</p>
          <Chips items={bb.emocionesProvoca} />
          <p className="mt-3" style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
            EVITA
          </p>
          <Chips items={bb.emocionesEvita} />
        </Bloque>

        <Bloque titulo="Paleta de colores" bg={C.bg} full>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bb.paleta.map((c, i) => {
              const ok = esHex(c.hex);
              return (
                <div key={i} className="overflow-hidden rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                  <div
                    className="flex h-20 items-end p-2"
                    style={{ background: ok ? c.hex : C.soft, color: ok ? textoSobre(c.hex) : C.text }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{c.hex.toUpperCase()}</span>
                  </div>
                  <div className="p-2">
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{c.nombre}</p>
                    <p style={{ fontSize: 11, color: C.muted }}>{c.uso}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Bloque>

        <Bloque titulo="Tipografías" bg={C.bg} full>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { r: "Títulos", f: bb.tipografias.titulos },
              { r: "Subtítulos", f: bb.tipografias.subtitulos },
              { r: "Cuerpo", f: bb.tipografias.cuerpo },
            ].map((t) => (
              <div key={t.r}>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{t.r.toUpperCase()}</p>
                <p className="mt-1 text-2xl font-bold" style={{ fontFamily: `${t.f}, sans-serif`, color: C.text }}>
                  {t.f}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3" style={{ fontSize: 13, color: C.muted }}>
            {bb.tipografias.nota}
          </p>
        </Bloque>

        <Bloque titulo="Universo visual" bg={C.bg}>
          <Dl k="Materiales" v={bb.universoVisual.materiales.join(" · ")} />
          <Dl k="Texturas" v={bb.universoVisual.texturas} />
          <Dl k="Estilo" v={bb.universoVisual.estilo} />
          <Dl k="Sensación" v={bb.universoVisual.sensacion} />
        </Bloque>

        <Bloque titulo="Estilo fotográfico" bg={C.bg}>
          <Lista items={bb.estiloFotografico} />
        </Bloque>

        <Bloque titulo="Logo" bg={C.bg} full>
          <div className="grid gap-4 sm:grid-cols-3">
            <Dl k="Concepto" v={bb.logo.concepto} />
            <Dl k="Cómo vectorizarlo" v={bb.logo.vectorizar} />
            <Dl k="Versiones de color" v={bb.logo.versionesColor} />
          </div>
        </Bloque>

        <Bloque titulo="Elementos recurrentes" bg={C.bg}>
          <Chips items={bb.elementosRecurrentes} />
        </Bloque>

        <Bloque titulo="Elementos prohibidos" bg={C.bg}>
          <Lista items={bb.elementosProhibidos} cruz />
        </Bloque>

        <Bloque titulo="Regla innegociable" bg={C.bg}>
          <p style={{ color: C.text }}>{bb.reglaInnegociable}</p>
        </Bloque>

        <Bloque titulo="Tono de comunicación" bg={C.bg}>
          <p style={{ color: C.text }}>{bb.tonoComunicacion}</p>
        </Bloque>

        <Bloque titulo="Propuesta de valor" bg={C.bg}>
          <p style={{ color: C.text }}>{bb.propuestaValor}</p>
        </Bloque>

        <Bloque titulo="Cliente ideal" bg={C.bg}>
          <p style={{ color: C.text }}>{bb.clienteIdeal}</p>
        </Bloque>

        <Bloque titulo="Beneficios clave" bg={C.bg}>
          <Lista items={bb.beneficios} />
        </Bloque>

        <Bloque titulo="Promesa de marca" bg={C.bg}>
          <p style={{ color: C.text }}>{bb.promesa}</p>
        </Bloque>

        <Bloque titulo="Hashtags de marca" bg={C.bg} full>
          <div className="flex flex-wrap gap-2">
            {bb.hashtags.map((h) => (
              <span key={h} style={{ color: C.label, fontWeight: 600, fontSize: 14 }}>
                {h}
              </span>
            ))}
          </div>
        </Bloque>
      </div>
    </div>
  );
}

function Bloque({
  titulo,
  children,
  bg,
  full,
}: {
  titulo: string;
  children: React.ReactNode;
  bg: string;
  full?: boolean;
}) {
  return (
    <div className={`p-5 sm:p-6 ${full ? "sm:col-span-2" : ""}`} style={{ background: bg }}>
      <p style={{ color: C.label, fontSize: 11, letterSpacing: "0.12em", fontWeight: 700 }}>
        {titulo.toUpperCase()}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Dl({ k, v }: { k: string; v: string }) {
  return (
    <div className="mb-3">
      <p style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{k}</p>
      <p style={{ color: C.text, fontSize: 14 }}>{v}</p>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {items.map((x) => (
        <span
          key={x}
          style={{ background: C.soft, color: C.text, borderRadius: 999, padding: "3px 10px", fontSize: 13 }}
        >
          {x}
        </span>
      ))}
    </div>
  );
}

function Lista({ items, cruz }: { items: string[]; cruz?: boolean }) {
  return (
    <ul className="space-y-1">
      {items.map((x, i) => (
        <li key={i} style={{ fontSize: 14, color: C.text, display: "flex", gap: 8 }}>
          <span style={{ color: cruz ? "#c0492f" : C.label }}>{cruz ? "✕" : "•"}</span>
          {x}
        </li>
      ))}
    </ul>
  );
}
