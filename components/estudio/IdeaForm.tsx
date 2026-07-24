"use client";

import { useState } from "react";
import type { Etapa, IdeaInput } from "@/lib/types";

const ETAPAS: { valor: Etapa; label: string }[] = [
  { valor: "idea", label: "Solo es una idea" },
  { valor: "prototipo", label: "Tengo un prototipo" },
  { valor: "vendiendo", label: "Ya tengo ventas" },
  { valor: "escalando", label: "Busco escalar" },
];

const EJEMPLO: IdeaInput = {
  idea: "Una app de lonchera saludable: los papás arman el menú semanal de sus hijos y una red de cocinas locales lo prepara y entrega en la escuela.",
  problema:
    "Los papás no tienen tiempo de preparar loncheras nutritivas y terminan mandando comida chatarra o gastando en la cooperativa.",
  cliente: "Papás y mamás que trabajan, con hijos en primaria en escuelas privadas.",
  etapa: "idea",
  recursos: "Solo yo, con unas 15 horas por semana y un ahorro de 20.000 pesos para empezar.",
  modelo: "Suscripción semanal por niño, con comisión a las cocinas aliadas.",
  ubicacion: "Guadalajara, México",
};

const VACIO: IdeaInput = {
  idea: "",
  problema: "",
  cliente: "",
  etapa: "idea",
  recursos: "",
  modelo: "",
  ubicacion: "",
};

export function IdeaForm({
  onSubmit,
  cargando,
}: {
  onSubmit: (input: IdeaInput) => void;
  cargando: boolean;
}) {
  const [form, setForm] = useState<IdeaInput>(VACIO);

  const actualizar = (campo: keyof IdeaInput, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const requeridosListos =
    form.idea.trim() &&
    form.problema.trim() &&
    form.cliente.trim() &&
    form.recursos.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (requeridosListos && !cargando) onSubmit(form);
      }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Entre más específico seas, más útil será el análisis.
        </p>
        <button
          type="button"
          onClick={() => setForm(EJEMPLO)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-brand-strong transition-colors hover:bg-brand-soft"
        >
          Rellenar con un ejemplo
        </button>
      </div>

      <Campo
        etiqueta="¿Cuál es tu idea?"
        ayuda="Descríbela como se la contarías a un amigo."
        obligatorio
      >
        <textarea
          value={form.idea}
          onChange={(e) => actualizar("idea", e.target.value)}
          rows={3}
          placeholder="Ej: Una plataforma que conecta…"
          className={inputCls}
        />
      </Campo>

      <Campo
        etiqueta="¿Qué problema resuelve?"
        ayuda="El dolor real que sienten tus clientes."
        obligatorio
      >
        <textarea
          value={form.problema}
          onChange={(e) => actualizar("problema", e.target.value)}
          rows={2}
          placeholder="Ej: Hoy la gente pierde tiempo / dinero porque…"
          className={inputCls}
        />
      </Campo>

      <Campo
        etiqueta="¿Para quién? (tu cliente)"
        ayuda="Cuanto más afilado, mejor."
        obligatorio
      >
        <textarea
          value={form.cliente}
          onChange={(e) => actualizar("cliente", e.target.value)}
          rows={2}
          placeholder="Ej: Dueños de pequeños restaurantes que…"
          className={inputCls}
        />
      </Campo>

      <div className="grid gap-6 sm:grid-cols-2">
        <Campo etiqueta="¿En qué etapa estás?" obligatorio>
          <select
            value={form.etapa}
            onChange={(e) => actualizar("etapa", e.target.value)}
            className={inputCls}
          >
            {ETAPAS.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.label}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="Mercado / ubicación" ayuda="Opcional">
          <input
            value={form.ubicacion}
            onChange={(e) => actualizar("ubicacion", e.target.value)}
            placeholder="Ej: Bogotá, Colombia"
            className={inputCls}
          />
        </Campo>
      </div>

      <Campo
        etiqueta="¿Con qué recursos cuentas?"
        ayuda="Tiempo, dinero y equipo disponibles."
        obligatorio
      >
        <textarea
          value={form.recursos}
          onChange={(e) => actualizar("recursos", e.target.value)}
          rows={2}
          placeholder="Ej: Trabajo solo, 10 h/semana y $500 para empezar."
          className={inputCls}
        />
      </Campo>

      <Campo etiqueta="¿Cómo piensas ganar dinero?" ayuda="Opcional">
        <input
          value={form.modelo}
          onChange={(e) => actualizar("modelo", e.target.value)}
          placeholder="Ej: Suscripción mensual / comisión por venta"
          className={inputCls}
        />
      </Campo>

      <button
        type="submit"
        disabled={!requeridosListos || cargando}
        className="w-full rounded-xl bg-brand px-6 py-3.5 font-semibold text-brand-ink shadow-sm transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {cargando ? "Analizando…" : "Analizar mi idea"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/20";

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
      <span className="flex items-baseline gap-2">
        <span className="font-semibold">{etiqueta}</span>
        {obligatorio && <span className="text-xs text-accent-strong">obligatorio</span>}
        {ayuda && <span className="text-xs text-muted">· {ayuda}</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
