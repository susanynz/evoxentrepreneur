"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUsuario } from "@/lib/auth";
import type { GuiaRespuesta, NivelIA } from "@/lib/types";

const NIVELES: { valor: NivelIA; label: string }[] = [
  { valor: "nunca", label: "Nunca he usado IA" },
  { valor: "basico", label: "Básico (uso ocasional)" },
  { valor: "seguido", label: "La uso seguido" },
  { valor: "integrada", label: "La integro en mi negocio" },
];

const AREAS = [
  { label: "Marketing y contenido", q: "¿Cómo uso IA para crear contenido y marketing para mi negocio?" },
  { label: "Ventas", q: "¿Cómo uso IA para vender más y cerrar mejor?" },
  { label: "Atención a clientes", q: "¿Cómo uso IA para atender mejor y más rápido a mis clientes?" },
  { label: "Operaciones", q: "¿Cómo uso IA para automatizar tareas repetitivas de mi negocio?" },
  { label: "Diseño y marca", q: "¿Cómo uso IA para diseñar piezas visuales para mi marca?" },
  { label: "Finanzas y datos", q: "¿Cómo uso IA para entender mis números y tomar mejores decisiones?" },
];

const NIVELES_INFO = [
  { n: "1", titulo: "Primeros pasos con IA", texto: "Qué es, elegir herramienta y pedirle bien." },
  { n: "2", titulo: "Áreas de aplicación", texto: "IA en marketing, ventas, atención, diseño…" },
  { n: "3", titulo: "Lo más avanzado", texto: "Automatización, agentes e integraciones." },
];

export default function GuiasPage() {
  const { analisis } = useUsuario();
  const [pregunta, setPregunta] = useState("");
  const [contexto, setContexto] = useState("");
  const [nivel, setNivel] = useState<NivelIA>("nunca");
  const [estado, setEstado] = useState<"form" | "cargando" | "resultado">("form");
  const [respuesta, setRespuesta] = useState<GuiaRespuesta | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Personaliza con el último análisis guardado, si lo hay.
  useEffect(() => {
    const ult = analisis[0];
    if (ult) {
      setContexto(
        `${ult.input.producto}. Cliente: ${ult.input.cliente}.`.slice(0, 400),
      );
      setNivel(ult.input.nivelIA);
    }
  }, [analisis]);

  async function generar(q: string) {
    setEstado("cargando");
    setCopiado(false);
    try {
      const res = await fetch("/api/guia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: q, contexto, nivel }),
      });
      const data = (await res.json()) as GuiaRespuesta;
      setRespuesta(data);
      setEstado("resultado");
    } catch {
      setEstado("form");
    }
  }

  return (
    <div className="contenedor max-w-4xl py-12">
      <header className="max-w-2xl">
        <span className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-brand-strong">
          Coach de consulta
        </span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Guías de IA para tu negocio</h1>
        <p className="mt-3 text-lg text-muted">
          Pregunta lo que quieras lograr con IA y tu coach te arma una guía puntual:
          qué herramienta usar, los pasos, un prompt listo para copiar y el enlace
          oficial. Todo aplicado a tu negocio.
        </p>
      </header>

      {/* Niveles (orientación) */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {NIVELES_INFO.map((x) => (
          <div key={x.n} className="rounded-xl border border-border bg-surface p-4">
            <span className="font-mono text-sm text-blue">Nivel {x.n}</span>
            <p className="mt-1 font-semibold">{x.titulo}</p>
            <p className="text-sm text-muted">{x.texto}</p>
          </div>
        ))}
      </div>

      {estado === "resultado" && respuesta ? (
        <Resultado
          data={respuesta}
          copiado={copiado}
          onCopiar={() => {
            navigator.clipboard?.writeText(respuesta.guia.ejemploPrompt);
            setCopiado(true);
          }}
          onReset={() => {
            setRespuesta(null);
            setEstado("form");
          }}
        />
      ) : estado === "cargando" ? (
        <div className="mt-10 flex min-h-[30vh] flex-col items-center justify-center text-center">
          <div className="animar-pulso text-4xl">💡</div>
          <p className="mt-4 text-lg font-medium">Armando tu guía…</p>
        </div>
      ) : (
        <section className="mt-8">
          {/* Áreas sugeridas */}
          <p className="text-sm font-medium text-muted">Empieza por un área, o pregunta libremente:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <button
                key={a.label}
                onClick={() => setPregunta(a.q)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:border-brand hover:text-foreground"
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
            <label className="block">
              <span className="font-semibold">¿Qué quieres lograr con IA?</span>
              <textarea
                rows={2}
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="Ej: Responder más rápido a mis clientes en WhatsApp"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Tu nivel con IA</span>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as NivelIA)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  {NIVELES.map((n) => (
                    <option key={n.valor} value={n.valor}>{n.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Sobre tu negocio (opcional)</span>
                <input
                  value={contexto}
                  onChange={(e) => setContexto(e.target.value)}
                  placeholder="Ej: Vendo postres por encargo"
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>
            <button
              onClick={() => pregunta.trim() && generar(pregunta.trim())}
              disabled={!pregunta.trim()}
              className="glow-brand rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              Generar mi guía
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">
            ¿Quieres una estrategia completa de tu negocio?{" "}
            <Link href="/estudio" className="text-blue hover:underline">
              Habla con tu coach en el Estudio →
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}

function Resultado({
  data,
  copiado,
  onCopiar,
  onReset,
}: {
  data: GuiaRespuesta;
  copiado: boolean;
  onCopiar: () => void;
  onReset: () => void;
}) {
  const { guia, fuente } = data;
  return (
    <div className="animar-subir mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">{guia.titulo}</h2>
        <button
          onClick={onReset}
          className="shrink-0 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          Otra consulta
        </button>
      </div>

      {fuente === "ejemplo" && (
        <div className="mt-4 rounded-xl border border-media/40 bg-media-soft px-4 py-3 text-sm">
          <strong>Guía de ejemplo.</strong> Con la API key de Claude en el
          servidor, cada guía se genera a tu medida.
        </div>
      )}

      <p className="mt-4 text-lg text-foreground/90">{guia.resumen}</p>

      <div className="mt-6 rounded-2xl border-2 border-brand bg-brand-soft p-5">
        <p className="font-sub text-sm font-semibold uppercase tracking-wide text-brand-strong">
          Herramienta recomendada
        </p>
        <p className="mt-1 text-xl font-bold">{guia.herramienta.nombre}</p>
        <p className="mt-1 text-sm text-foreground/85">{guia.herramienta.porQue}</p>
        {guia.herramienta.docUrl && (
          <a
            href={guia.herramienta.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink"
          >
            Abrir {guia.herramienta.nombre} ↗
          </a>
        )}
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-bold">Pasos</h3>
        <ol className="mt-3 space-y-2">
          {guia.pasos.map((p, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border bg-surface p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-ink">
                {i + 1}
              </span>
              <span className="text-sm">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Prompt listo para copiar</h3>
          <button
            onClick={onCopiar}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            {copiado ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-surface-2 p-4 font-mono text-sm whitespace-pre-wrap text-foreground/90">
          {guia.ejemploPrompt}
        </pre>
      </section>

      <div className="mt-6 rounded-xl bg-surface-2 px-4 py-3 text-sm">
        <span className="font-semibold text-brand-strong">Siguiente paso: </span>
        {guia.siguientePaso}
      </div>
    </div>
  );
}
