"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIAS,
  ETAPA_LABEL,
  PROYECTOS_SEMILLA,
  STORAGE_KEY_PROYECTOS,
  encontrarCoincidencias,
  type Proyecto,
} from "@/lib/community";
import type { Etapa } from "@/lib/types";
import { useUsuario, type Usuario } from "@/lib/auth";
import { ProyectoCard, Etiqueta } from "@/components/comunidad/ProyectoCard";

const ETAPAS: Etapa[] = ["idea", "prototipo", "vendiendo", "escalando"];

export default function ComunidadPage() {
  const { usuario } = useUsuario();
  const [mios, setMios] = useState<Proyecto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");
  const [etapa, setEtapa] = useState<string>("todas");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [conexionesDe, setConexionesDe] = useState<Proyecto | null>(null);

  // Cargar proyectos propios guardados.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROYECTOS);
      if (raw) setMios(JSON.parse(raw) as Proyecto[]);
    } catch {
      /* ignora almacenamiento no disponible */
    }
  }, []);

  const todos = useMemo(() => [...mios, ...PROYECTOS_SEMILLA], [mios]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return todos.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (etapa !== "todas" && p.etapa !== etapa) return false;
      if (!q) return true;
      const texto = [
        p.nombre,
        p.emprendedor,
        p.descripcion,
        ...p.ofrezco,
        ...p.busco,
      ]
        .join(" ")
        .toLowerCase();
      return texto.includes(q);
    });
  }, [todos, busqueda, categoria, etapa]);

  function agregar(p: Proyecto) {
    const nuevos = [{ ...p, ownerId: usuario?.id }, ...mios];
    setMios(nuevos);
    try {
      localStorage.setItem(STORAGE_KEY_PROYECTOS, JSON.stringify(nuevos));
    } catch {
      /* ignora */
    }
    setModalAgregar(false);
  }

  const idsMios = new Set(mios.map((m) => m.id));

  return (
    <div className="contenedor py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Comunidad Evox</h1>
        <p className="mt-3 text-lg text-muted">
          Una incubadora que funciona como un BNI: cada quien declara lo que{" "}
          <span className="font-semibold text-brand-strong">ofrece</span> y lo que{" "}
          <span className="font-semibold text-accent-strong">busca</span>. Aquí
          conviven proyectos en todas las etapas —desde una idea recién nacida
          hasta negocios consolidados— y se conectan para crecer juntos.
        </p>
      </header>

      {/* Cómo funciona */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { n: "1", t: "Publica tu proyecto", d: "Di en qué etapa estás, qué ofreces y qué buscas." },
          { n: "2", t: "Encuentra encajes", d: "Te mostramos quién ofrece justo lo que necesitas." },
          { n: "3", t: "Refiere y crece", d: "Se dan referencias y apoyo mutuo, como en un BNI." },
        ].map((p) => (
          <div key={p.n} className="rounded-xl border border-border bg-surface p-4">
            <span className="font-display text-2xl font-bold text-brand">{p.n}</span>
            <p className="mt-1 font-semibold">{p.t}</p>
            <p className="text-sm text-muted">{p.d}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, ofrece o busca…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:max-w-xs"
          />
          <select
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="todas">Todas las etapas</option>
            {ETAPAS.map((e) => (
              <option key={e} value={e}>
                {ETAPA_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setModalAgregar(true)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-strong"
        >
          + Agregar mi proyecto
        </button>
      </div>

      {/* Filtro por categoría */}
      <div className="mt-4 flex flex-wrap gap-2">
        <ChipCategoria activo={categoria === "todas"} onClick={() => setCategoria("todas")}>
          Todas
        </ChipCategoria>
        {CATEGORIAS.map((c) => (
          <ChipCategoria key={c} activo={categoria === c} onClick={() => setCategoria(c)}>
            {c}
          </ChipCategoria>
        ))}
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          No hay proyectos con esos filtros. Prueba con otros o agrega el tuyo.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => (
            <ProyectoCard
              key={p.id}
              proyecto={p}
              esMio={idsMios.has(p.id)}
              onConectar={setConexionesDe}
            />
          ))}
        </div>
      )}

      {modalAgregar && (
        <ModalAgregar
          usuario={usuario}
          onCerrar={() => setModalAgregar(false)}
          onAgregar={agregar}
        />
      )}
      {conexionesDe && (
        <ModalConexiones
          proyecto={conexionesDe}
          todos={todos}
          onCerrar={() => setConexionesDe(null)}
        />
      )}
    </div>
  );
}

function ChipCategoria({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        activo
          ? "bg-brand text-brand-ink"
          : "border border-border bg-surface text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------- Modal: conexiones ---------------- */

function ModalConexiones({
  proyecto,
  todos,
  onCerrar,
}: {
  proyecto: Proyecto;
  todos: Proyecto[];
  onCerrar: () => void;
}) {
  const coincidencias = encontrarCoincidencias(proyecto, todos);
  return (
    <Overlay onCerrar={onCerrar}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">A quién le conviene conocer a {proyecto.nombre}</h2>
          <p className="mt-1 text-sm text-muted">
            Encajes según lo que {proyecto.nombre} busca y otros ofrecen.
          </p>
        </div>
        <BotonCerrar onClick={onCerrar} />
      </div>

      {coincidencias.length === 0 ? (
        <p className="mt-6 text-muted">
          Aún no hay encajes claros. Agrega más proyectos o afina lo que buscas y
          ofreces para encontrar conexiones.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {coincidencias.map(({ proyecto: otro, razon }) => (
            <li
              key={otro.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <span className="text-2xl">{otro.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">
                  {otro.nombre}{" "}
                  <span className="font-normal text-muted">· {otro.emprendedor}</span>
                </p>
                <p className="mt-1 text-sm text-brand-strong">{razon}</p>
              </div>
              <button className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-ink">
                Conectar
              </button>
            </li>
          ))}
        </ul>
      )}
    </Overlay>
  );
}

/* ---------------- Modal: agregar proyecto ---------------- */

const EMOJIS = ["✨", "🚀", "💡", "🌱", "🛠️", "🍽️", "👗", "📚", "🩺", "☕", "🎨", "📊"];

function ModalAgregar({
  usuario,
  onCerrar,
  onAgregar,
}: {
  usuario: Usuario | null;
  onCerrar: () => void;
  onAgregar: (p: Proyecto) => void;
}) {
  const [f, setF] = useState({
    nombre: "",
    emprendedor: usuario?.nombre ?? "",
    categoria: CATEGORIAS[0] as string,
    etapa: "idea" as Etapa,
    ubicacion: usuario?.ubicacion ?? "",
    descripcion: "",
    ofrezco: "",
    busco: "",
    emoji: usuario?.avatar ?? "✨",
  });

  const listo = f.nombre.trim() && f.emprendedor.trim() && f.descripcion.trim();

  const aLista = (s: string) =>
    s
      .split(/[,\n]/)
      .map((x) => x.trim())
      .filter(Boolean);

  function enviar() {
    if (!listo) return;
    onAgregar({
      id: `mio_${Date.now()}`,
      nombre: f.nombre.trim(),
      emprendedor: f.emprendedor.trim(),
      categoria: f.categoria,
      etapa: f.etapa,
      ubicacion: f.ubicacion.trim() || "Sin especificar",
      descripcion: f.descripcion.trim(),
      ofrezco: aLista(f.ofrezco),
      busco: aLista(f.busco),
      emoji: f.emoji,
    });
  }

  const inp =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <Overlay onCerrar={onCerrar}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold">Agrega tu proyecto</h2>
        <BotonCerrar onClick={onCerrar} />
      </div>

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Nombre del proyecto</span>
            <input
              className={`mt-1 ${inp}`}
              value={f.nombre}
              onChange={(e) => setF({ ...f, nombre: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Tu nombre</span>
            <input
              className={`mt-1 ${inp}`}
              value={f.emprendedor}
              onChange={(e) => setF({ ...f, emprendedor: e.target.value })}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold">Categoría</span>
            <select
              className={`mt-1 ${inp}`}
              value={f.categoria}
              onChange={(e) => setF({ ...f, categoria: e.target.value })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Etapa</span>
            <select
              className={`mt-1 ${inp}`}
              value={f.etapa}
              onChange={(e) => setF({ ...f, etapa: e.target.value as Etapa })}
            >
              {ETAPAS.map((e) => (
                <option key={e} value={e}>
                  {ETAPA_LABEL[e]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Ubicación</span>
            <input
              className={`mt-1 ${inp}`}
              value={f.ubicacion}
              onChange={(e) => setF({ ...f, ubicacion: e.target.value })}
              placeholder="Ciudad, país"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold">Descripción</span>
          <textarea
            className={`mt-1 ${inp}`}
            rows={2}
            value={f.descripcion}
            onChange={(e) => setF({ ...f, descripcion: e.target.value })}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-brand-strong">Qué ofreces</span>
            <textarea
              className={`mt-1 ${inp}`}
              rows={2}
              value={f.ofrezco}
              onChange={(e) => setF({ ...f, ofrezco: e.target.value })}
              placeholder="Separa con comas"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-accent-strong">Qué buscas</span>
            <textarea
              className={`mt-1 ${inp}`}
              rows={2}
              value={f.busco}
              onChange={(e) => setF({ ...f, busco: e.target.value })}
              placeholder="Separa con comas"
            />
          </label>
        </div>

        <div>
          <span className="text-sm font-semibold">Ícono</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setF({ ...f, emoji: e })}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors ${
                  f.emoji === e ? "bg-brand-soft ring-2 ring-brand" : "bg-surface-2"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Etiqueta tono="neutro">Se guarda solo en tu navegador</Etiqueta>
        </div>
        <button
          onClick={enviar}
          disabled={!listo}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-strong disabled:opacity-50"
        >
          Publicar proyecto
        </button>
      </div>
    </Overlay>
  );
}

/* ---------------- Utilidades de modal ---------------- */

function Overlay({
  children,
  onCerrar,
}: {
  children: React.ReactNode;
  onCerrar: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        className="animar-subir my-8 w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function BotonCerrar({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Cerrar"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      ✕
    </button>
  );
}
