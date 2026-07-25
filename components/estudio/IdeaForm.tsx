"use client";

import { useState } from "react";
import type {
  Alcance,
  Etapa,
  IdeaInput,
  NivelIA,
  Objetivo,
} from "@/lib/types";

const ETAPAS: { valor: Etapa; emoji: string; label: string; hint: string }[] = [
  { valor: "idea", emoji: "🌱", label: "Idea", hint: "Aún no arranco" },
  { valor: "iniciado", emoji: "🚀", label: "Proyecto iniciado", hint: "Ya tengo algo funcionando" },
  { valor: "consolidado", emoji: "📈", label: "Negocio consolidado", hint: "Quiero escalar" },
];

const ALCANCES: { valor: Alcance; label: string }[] = [
  { valor: "local", label: "Local" },
  { valor: "nacional", label: "Nacional" },
  { valor: "online", label: "Solo online" },
  { valor: "internacional", label: "Internacional" },
];

const OBJETIVOS: { valor: Objetivo; label: string }[] = [
  { valor: "validar", label: "Validar la idea" },
  { valor: "primeros-clientes", label: "Conseguir mis primeros clientes" },
  { valor: "aumentar-ventas", label: "Aumentar ventas" },
  { valor: "marca-presencia", label: "Mejorar mi marca y presencia" },
  { valor: "escalar", label: "Escalar / automatizar" },
];

const NIVELES_IA: { valor: NivelIA; label: string }[] = [
  { valor: "nunca", label: "Nunca la he usado" },
  { valor: "basico", label: "Básico (uso ocasional)" },
  { valor: "seguido", label: "La uso seguido" },
  { valor: "integrada", label: "La integro en mi negocio" },
];

const CANALES = [
  "Sitio web",
  "Instagram",
  "TikTok",
  "Facebook",
  "WhatsApp Business",
  "YouTube",
  "LinkedIn",
];

const VACIO: IdeaInput = {
  etapa: "idea",
  producto: "",
  ofertaPrincipal: "",
  problema: "",
  cliente: "",
  diferenciador: "",
  competencia: "",
  modelo: "",
  alcance: "local",
  ubicacion: "",
  recursos: "",
  presenciaDigital: [],
  objetivo: "validar",
  nivelIA: "nunca",
};

const EJEMPLO: IdeaInput = {
  etapa: "iniciado",
  producto:
    "Loncheras saludables por suscripción y, además, snacks sueltos, kits de cumpleaños y catering para eventos escolares.",
  ofertaPrincipal:
    "El plan semanal de loncheras por suscripción — es lo recurrente y lo que quiero impulsar primero.",
  problema:
    "Los papás que trabajan no tienen tiempo de preparar loncheras nutritivas y terminan mandando comida chatarra o gastando en la cooperativa.",
  cliente:
    "Papás y mamás que trabajan, con hijos en primaria en escuelas privadas de la ciudad.",
  diferenciador:
    "Menú personalizado y saludable, con cocinas del barrio y entrega en la escuela; no es comida congelada genérica.",
  competencia:
    "Hoy usan la cooperativa de la escuela, comida rápida o preparan a las prisas en la mañana.",
  modelo: "Suscripción semanal por niño (~350/semana), con comisión a las cocinas aliadas.",
  alcance: "local",
  ubicacion: "Guadalajara, México",
  recursos: "Somos 2, con unas 20 horas/semana y un ahorro de 30.000 para empezar.",
  presenciaDigital: ["Instagram", "WhatsApp Business"],
  objetivo: "aumentar-ventas",
  nivelIA: "basico",
};

export function IdeaForm({
  onSubmit,
  cargando,
}: {
  onSubmit: (input: IdeaInput) => void;
  cargando: boolean;
}) {
  const [form, setForm] = useState<IdeaInput>(VACIO);

  const set = <K extends keyof IdeaInput>(campo: K, valor: IdeaInput[K]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const toggleCanal = (canal: string) =>
    setForm((prev) => ({
      ...prev,
      presenciaDigital: prev.presenciaDigital.includes(canal)
        ? prev.presenciaDigital.filter((c) => c !== canal)
        : [...prev.presenciaDigital, canal],
    }));

  const listo =
    form.producto.trim() &&
    form.problema.trim() &&
    form.cliente.trim() &&
    form.recursos.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (listo && !cargando) onSubmit(form);
      }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Entre más específico seas, mejor te puede guiar tu coach.
        </p>
        <button
          type="button"
          onClick={() => setForm(EJEMPLO)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-brand-strong transition-colors hover:bg-brand-soft"
        >
          Rellenar con un ejemplo
        </button>
      </div>

      {/* Etapa — lo primero */}
      <section>
        <SeccionTitulo n="1" titulo="¿En qué etapa estás?" />
        <p className="mt-1 text-sm text-muted">
          Define todo tu recorrido — no todos partimos del mismo lugar.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {ETAPAS.map((e) => {
            const activo = form.etapa === e.valor;
            return (
              <button
                key={e.valor}
                type="button"
                onClick={() => set("etapa", e.valor)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  activo
                    ? "border-brand bg-brand-soft"
                    : "border-border bg-surface hover:bg-surface-2"
                }`}
              >
                <span className="text-2xl">{e.emoji}</span>
                <p className="mt-2 font-semibold">{e.label}</p>
                <p className="text-xs text-muted">{e.hint}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bloque 1 — validar y diferenciar */}
      <section className="space-y-5">
        <SeccionTitulo n="2" titulo="Tu negocio" />
        <Campo etiqueta="¿Qué ofreces?" ayuda="Un servicio, varios, o tu catálogo. Sé concreto." obligatorio>
          <textarea rows={2} value={form.producto} onChange={(e) => set("producto", e.target.value)} placeholder="Ej: Un servicio de… / Vendo estos productos…" className={inputCls} />
        </Campo>
        <Campo
          etiqueta="Tu oferta estrella"
          ayuda="Si tienes varias, la que quieres impulsar primero. Si es una sola, déjalo vacío."
        >
          <input value={form.ofertaPrincipal} onChange={(e) => set("ofertaPrincipal", e.target.value)} placeholder="Ej: El plan mensual / mi producto más vendido" className={inputCls} />
        </Campo>
        <Campo etiqueta="¿Qué problema resuelve?" ayuda="El dolor real de tu cliente." obligatorio>
          <textarea rows={2} value={form.problema} onChange={(e) => set("problema", e.target.value)} placeholder="Ej: Hoy la gente pierde tiempo / dinero porque…" className={inputCls} />
        </Campo>
        <Campo etiqueta="¿Quién es tu cliente ideal?" ayuda="Lo más específico posible, y dónde está." obligatorio>
          <textarea rows={2} value={form.cliente} onChange={(e) => set("cliente", e.target.value)} placeholder="Ej: Dueños de pequeños restaurantes en…" className={inputCls} />
        </Campo>
        <Campo
          etiqueta="¿Por qué te elegirían a ti y no a otra opción?"
          ayuda="Tu diferenciador. Si aún no lo tienes claro, déjalo — tu coach te ayuda a construirlo."
        >
          <textarea rows={2} value={form.diferenciador} onChange={(e) => set("diferenciador", e.target.value)} placeholder="Ej: Somos más rápidos / especializados / cercanos… (o déjalo si aún no lo sabes)" className={inputCls} />
        </Campo>
        <Campo etiqueta="¿Con qué compites hoy?" ayuda="Qué usa tu cliente ahora. Si no lo sabes, no pasa nada.">
          <textarea rows={2} value={form.competencia} onChange={(e) => set("competencia", e.target.value)} placeholder="Ej: Lo resuelven con Excel, con la competencia X, o a mano." className={inputCls} />
        </Campo>
      </section>

      {/* Bloque 2 — situación */}
      <section className="space-y-5">
        <SeccionTitulo n="3" titulo="Tu situación" />
        <Campo etiqueta="¿Cómo cobras y cuánto (aprox.)?" ayuda="Tu modelo de ingresos y precio.">
          <input value={form.modelo} onChange={(e) => set("modelo", e.target.value)} placeholder="Ej: Suscripción mensual de $200 / comisión por venta" className={inputCls} />
        </Campo>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo etiqueta="Alcance / mercado" obligatorio>
            <select value={form.alcance} onChange={(e) => set("alcance", e.target.value as Alcance)} className={inputCls}>
              {ALCANCES.map((a) => (
                <option key={a.valor} value={a.valor}>{a.label}</option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="Ubicación" ayuda="Opcional">
            <input value={form.ubicacion} onChange={(e) => set("ubicacion", e.target.value)} placeholder="Ciudad, país" className={inputCls} />
          </Campo>
        </div>
        <Campo etiqueta="¿Con qué recursos cuentas?" ayuda="Tiempo por semana, dinero y equipo." obligatorio>
          <textarea rows={2} value={form.recursos} onChange={(e) => set("recursos", e.target.value)} placeholder="Ej: Trabajo solo, 10 h/semana y $500 para empezar." className={inputCls} />
        </Campo>
      </section>

      {/* Bloque 3 — presencia digital y meta */}
      <section className="space-y-5">
        <SeccionTitulo n="4" titulo="Presencia digital y meta" />
        <Campo etiqueta="¿Qué presencia digital tienes hoy?" ayuda="Marca lo que ya usas (o ninguna).">
          <div className="flex flex-wrap gap-2">
            {CANALES.map((canal) => {
              const activo = form.presenciaDigital.includes(canal);
              return (
                <button
                  key={canal}
                  type="button"
                  onClick={() => toggleCanal(canal)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    activo
                      ? "bg-brand text-brand-ink"
                      : "border border-border bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  {canal}
                </button>
              );
            })}
          </div>
        </Campo>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo etiqueta="¿Tu objetivo en 3-6 meses?" obligatorio>
            <select value={form.objetivo} onChange={(e) => set("objetivo", e.target.value as Objetivo)} className={inputCls}>
              {OBJETIVOS.map((o) => (
                <option key={o.valor} value={o.valor}>{o.label}</option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="¿Cuánto usas IA hoy?" obligatorio>
            <select value={form.nivelIA} onChange={(e) => set("nivelIA", e.target.value as NivelIA)} className={inputCls}>
              {NIVELES_IA.map((n) => (
                <option key={n.valor} value={n.valor}>{n.label}</option>
              ))}
            </select>
          </Campo>
        </div>
      </section>

      <button
        type="submit"
        disabled={!listo || cargando}
        className="glow-brand w-full rounded-xl bg-brand px-6 py-3.5 font-semibold text-brand-ink transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
      >
        {cargando ? "Analizando…" : "Analizar con mi coach"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/20";

function SeccionTitulo({ n, titulo }: { n: string; titulo: string }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-bold">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft font-mono text-sm text-brand-strong">
        {n}
      </span>
      {titulo}
    </h2>
  );
}

function Campo({
  etiqueta,
  ayuda,
  obligatorio,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  obligatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex flex-wrap items-baseline gap-2">
        <span className="font-semibold">{etiqueta}</span>
        {obligatorio && <span className="text-xs text-accent-strong">obligatorio</span>}
        {ayuda && <span className="text-xs text-muted">· {ayuda}</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
