"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUsuario, type Usuario } from "@/lib/auth";
import { Resultado } from "@/components/estudio/Resultado";
import {
  STORAGE_KEY_PROYECTOS,
  ETAPA_LABEL,
  type Proyecto,
} from "@/lib/community";

const AVATARES = ["🚀", "🦾", "🎮", "💡", "🧠", "🛠️", "👾", "🌐", "⚡", "🔥", "🦅", "💎"];
const ROLES = [
  "Founder",
  "Builder",
  "Trader",
  "Innovador",
  "Gamer",
  "Creador",
  "Inversionista",
  "Estudiante",
];

export default function PerfilPage() {
  const {
    listo,
    usuario,
    analisis,
    crearPerfil,
    actualizarPerfil,
    cerrarSesion,
    eliminarAnalisis,
  } = useUsuario();
  const [editando, setEditando] = useState(false);
  const [verId, setVerId] = useState<string | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROYECTOS);
      const todos = raw ? (JSON.parse(raw) as Proyecto[]) : [];
      setProyectos(usuario ? todos.filter((p) => p.ownerId === usuario.id) : []);
    } catch {
      /* ignora */
    }
  }, [usuario]);

  if (!listo) {
    return (
      <div className="contenedor py-20 text-center text-muted">Cargando…</div>
    );
  }

  // Sin perfil -> crear
  if (!usuario) {
    return (
      <div className="contenedor max-w-lg py-12">
        <span className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-brand-strong">
          Únete al ecosistema
        </span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Crea tu perfil</h1>
        <p className="mt-3 text-muted">
          Tu perfil te permite guardar tus análisis, darles seguimiento y
          conectarte en la comunidad. Belong to the evolution.
        </p>
        <div className="mt-8">
          <PerfilForm
            submitLabel="Crear mi perfil"
            onSubmit={(d) => crearPerfil(d)}
          />
        </div>
      </div>
    );
  }

  // Ver un análisis guardado
  const verAnalisis = analisis.find((a) => a.id === verId);
  if (verAnalisis) {
    return (
      <div className="contenedor max-w-4xl py-12">
        <Resultado
          analisis={verAnalisis.respuesta.analisis}
          fuente={verAnalisis.respuesta.fuente}
          onReset={() => setVerId(null)}
          resetLabel="← Volver a mi perfil"
        />
      </div>
    );
  }

  // Editar
  if (editando) {
    return (
      <div className="contenedor max-w-lg py-12">
        <h1 className="text-3xl font-bold">Editar perfil</h1>
        <div className="mt-8">
          <PerfilForm
            inicial={usuario}
            submitLabel="Guardar cambios"
            onSubmit={(d) => {
              actualizarPerfil(d);
              setEditando(false);
            }}
            onCancelar={() => setEditando(false)}
          />
        </div>
      </div>
    );
  }

  // Vista de perfil
  return (
    <div className="contenedor max-w-4xl py-12">
      {/* Tarjeta de perfil */}
      <section className="borde-neon rounded-2xl bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-4xl">
              {usuario.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{usuario.nombre}</h1>
              <p className="font-sub uppercase tracking-wide text-brand-strong">
                {usuario.rol}
              </p>
              <p className="mt-1 text-sm text-muted">
                {usuario.email}
                {usuario.ubicacion ? ` · ${usuario.ubicacion}` : ""}
              </p>
              {usuario.web && (
                <a
                  href={normalizarUrl(usuario.web)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-blue hover:underline"
                >
                  {usuario.web}
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="shrink-0 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Editar perfil
          </button>
        </div>
        {usuario.bio && <p className="mt-5 text-foreground/90">{usuario.bio}</p>}

        <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-5 text-sm">
          <Dato n={analisis.length} label="análisis guardados" />
          <Dato n={proyectos.length} label="proyectos en comunidad" />
          <Dato
            label="miembro desde"
            texto={new Date(usuario.creadoEn).toLocaleDateString("es", {
              month: "short",
              year: "numeric",
            })}
          />
        </div>
      </section>

      {/* Análisis guardados */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Tus análisis</h2>
        {analisis.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-muted">Aún no has guardado ningún análisis.</p>
            <Link
              href="/estudio"
              className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink"
            >
              Analizar una idea
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {analisis.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{a.titulo}</p>
                  <p className="text-xs text-muted">
                    {new Date(a.fecha).toLocaleDateString("es", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · Veredicto {a.respuesta.analisis.veredicto.puntuacion}/100 ·{" "}
                    {a.respuesta.analisis.veredicto.nivel}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVerId(a.id)}
                    className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-brand-ink"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => eliminarAnalisis(a.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-alta"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Proyectos en comunidad */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tus proyectos en la comunidad</h2>
          <Link
            href="/comunidad"
            className="text-sm font-medium text-blue hover:underline"
          >
            Ir a la comunidad →
          </Link>
        </div>
        {proyectos.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-muted">
            Aún no has publicado un proyecto. Publícalo en la comunidad para que
            otros emprendedores te encuentren.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {proyectos.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="font-semibold">{p.nombre}</p>
                    <p className="text-xs text-muted">
                      {p.categoria} · {ETAPA_LABEL[p.etapa]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cerrar sesión */}
      <section className="mt-12 border-t border-border pt-6">
        <button
          onClick={() => {
            if (
              confirm(
                "¿Cerrar sesión? Se borrará tu perfil y tus análisis de este navegador.",
              )
            ) {
              cerrarSesion();
            }
          }}
          className="text-sm font-medium text-muted transition-colors hover:text-alta"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  );
}

function Dato({
  n,
  texto,
  label,
}: {
  n?: number;
  texto?: string;
  label: string;
}) {
  return (
    <div>
      <span className="font-display text-2xl font-bold texto-neon">
        {texto ?? n}
      </span>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function normalizarUrl(u: string): string {
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

/* ---------------- Formulario de perfil ---------------- */

function PerfilForm({
  inicial,
  submitLabel,
  onSubmit,
  onCancelar,
}: {
  inicial?: Usuario;
  submitLabel: string;
  onSubmit: (datos: Omit<Usuario, "id" | "creadoEn">) => void;
  onCancelar?: () => void;
}) {
  const [f, setF] = useState({
    nombre: inicial?.nombre ?? "",
    email: inicial?.email ?? "",
    avatar: inicial?.avatar ?? AVATARES[0],
    rol: inicial?.rol ?? ROLES[0],
    bio: inicial?.bio ?? "",
    ubicacion: inicial?.ubicacion ?? "",
    web: inicial?.web ?? "",
  });

  const listo = f.nombre.trim() && f.email.trim();
  const inp =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (listo) onSubmit(f);
      }}
      className="space-y-5"
    >
      <div>
        <span className="text-sm font-semibold">Avatar</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {AVATARES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setF({ ...f, avatar: a })}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors ${
                f.avatar === a ? "bg-brand-soft ring-2 ring-brand" : "bg-surface-2"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Nombre</span>
        <input
          className={`mt-1.5 ${inp}`}
          value={f.nombre}
          onChange={(e) => setF({ ...f, nombre: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input
          type="email"
          className={`mt-1.5 ${inp}`}
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Rol</span>
          <select
            className={`mt-1.5 ${inp}`}
            value={f.rol}
            onChange={(e) => setF({ ...f, rol: e.target.value })}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Ubicación</span>
          <input
            className={`mt-1.5 ${inp}`}
            value={f.ubicacion}
            onChange={(e) => setF({ ...f, ubicacion: e.target.value })}
            placeholder="Ciudad, país"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Sitio o red (opcional)</span>
        <input
          className={`mt-1.5 ${inp}`}
          value={f.web}
          onChange={(e) => setF({ ...f, web: e.target.value })}
          placeholder="tuweb.com / @usuario"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Bio (opcional)</span>
        <textarea
          className={`mt-1.5 ${inp}`}
          rows={3}
          value={f.bio}
          onChange={(e) => setF({ ...f, bio: e.target.value })}
          placeholder="En qué estás trabajando, qué buscas…"
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!listo}
          className="glow-brand rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitLabel}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-xl border border-border px-6 py-3 font-medium text-muted transition-colors hover:bg-surface"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
