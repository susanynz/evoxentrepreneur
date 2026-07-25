"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUsuario, type DatosPerfil, type Usuario } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Resultado } from "@/components/estudio/Resultado";
import {
  STORAGE_KEY_PROYECTOS,
  ETAPA_LABEL,
  type Proyecto,
} from "@/lib/community";

const AVATARES = ["🚀", "🦾", "🎯", "💡", "🧠", "🛠️", "🌱", "🌐", "⚡", "🔥", "🦅", "💎"];
const ROLES = [
  "Founder",
  "Emprendedor",
  "Creador",
  "Comerciante",
  "Freelancer",
  "Consultor",
  "Inversionista",
  "Estudiante",
];

export default function PerfilPage() {
  const {
    listo,
    usuario,
    analisis,
    registro,
    login,
    actualizarPerfil,
    cerrarSesion,
    eliminarAnalisis,
  } = useUsuario();
  const [editando, setEditando] = useState(false);
  const [verId, setVerId] = useState<string | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [modo, setModo] = useState<"registro" | "login">("registro");
  const [err, setErr] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

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
    return <div className="contenedor py-20 text-center text-muted">Cargando…</div>;
  }

  // Sin sesión -> pantalla de registro / login (con marca)
  if (!usuario) {
    const esRegistro = modo === "registro";
    return (
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(46rem 30rem at 80% -10%, rgba(138,43,226,0.28), transparent 60%), radial-gradient(34rem 24rem at 5% 5%, rgba(0,178,255,0.18), transparent 55%)",
          }}
        />
        <div className="contenedor flex min-h-[72vh] items-center justify-center py-12">
          <div className={`w-full ${esRegistro ? "max-w-xl" : "max-w-md"}`}>
            <div className="mb-6 flex flex-col items-center text-center">
              <Logo className="h-14 w-auto" />
              <p className="font-sub mt-2 text-xs uppercase tracking-[0.3em] text-muted">
                Belong to the evolution
              </p>
            </div>

            <div className="borde-neon rounded-3xl bg-surface p-6 sm:p-8">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {esRegistro ? "Crea tu cuenta" : "Bienvenido de vuelta"}
              </h1>
              <p className="mt-1.5 text-sm text-muted">
                {esRegistro
                  ? "Tu coach guarda tu progreso y tus entregables, y te conecta en la comunidad."
                  : "Entra para ver tu tablero, tus análisis y tu progreso."}
              </p>

              <div className="mt-6 flex gap-1 rounded-xl border border-border bg-background p-1">
                {(["registro", "login"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setModo(m);
                      setErr(null);
                    }}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      modo === m
                        ? "bg-brand text-brand-ink"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {m === "registro" ? "Crear cuenta" : "Iniciar sesión"}
                  </button>
                ))}
              </div>

              {err && (
                <div className="mt-5 rounded-xl border border-alta/40 bg-alta-soft px-4 py-3 text-sm text-foreground">
                  {err}
                </div>
              )}

              <div className="mt-6">
                {esRegistro ? (
                  <PerfilForm
                    conPassword
                    submitLabel="Crear mi cuenta"
                    enviando={enviando}
                    onSubmit={async (datos, password) => {
                      setErr(null);
                      setEnviando(true);
                      const e = await registro({ ...datos, password });
                      setEnviando(false);
                      if (e) setErr(e);
                    }}
                  />
                ) : (
                  <LoginForm
                    enviando={enviando}
                    onSubmit={async (email, password) => {
                      setErr(null);
                      setEnviando(true);
                      const e = await login(email, password);
                      setEnviando(false);
                      if (e) setErr(e);
                    }}
                  />
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-muted">
              Powered by Evox · Parte del ecosistema EVOXVERSE
            </p>
          </div>
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

  // Editar perfil
  if (editando) {
    return (
      <div className="contenedor max-w-lg py-12">
        <h1 className="text-3xl font-bold">Editar perfil</h1>
        <div className="mt-8">
          <PerfilForm
            inicial={usuario}
            submitLabel="Guardar cambios"
            onSubmit={async (datos) => {
              await actualizarPerfil(datos);
              setEditando(false);
            }}
            onCancelar={() => setEditando(false)}
          />
        </div>
      </div>
    );
  }

  // Tablero de coaching
  return (
    <div className="contenedor max-w-4xl py-12">
      <section className="borde-neon rounded-2xl bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-4xl">
              {usuario.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{usuario.nombre}</h1>
              <p className="font-sub uppercase tracking-wide text-brand-strong">{usuario.rol}</p>
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

      <section className="mt-10">
        <h2 className="text-xl font-bold">Tus análisis</h2>
        {analisis.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-muted">Aún no has guardado ningún análisis.</p>
            <Link
              href="/estudio"
              className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink"
            >
              Hablar con mi coach
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

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tus proyectos en la comunidad</h2>
          <Link href="/comunidad" className="text-sm font-medium text-blue hover:underline">
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
              <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
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

      <section className="mt-12 border-t border-border pt-6">
        <button
          onClick={() => cerrarSesion()}
          className="text-sm font-medium text-muted transition-colors hover:text-alta"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  );
}

function Dato({ n, texto, label }: { n?: number; texto?: string; label: string }) {
  return (
    <div>
      <span className="font-display text-2xl font-bold texto-neon">{texto ?? n}</span>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function normalizarUrl(u: string): string {
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60";

/* ---------------- Registro / editar perfil ---------------- */

function PerfilForm({
  inicial,
  submitLabel,
  conPassword,
  enviando,
  onSubmit,
  onCancelar,
}: {
  inicial?: Usuario;
  submitLabel: string;
  conPassword?: boolean;
  enviando?: boolean;
  onSubmit: (datos: DatosPerfil, password: string) => void;
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
    password: "",
  });

  const listo =
    f.nombre.trim() && f.email.trim() && (!conPassword || f.password.length >= 6);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!listo || enviando) return;
        onSubmit(
          {
            nombre: f.nombre.trim(),
            email: f.email.trim(),
            avatar: f.avatar,
            rol: f.rol,
            bio: f.bio.trim() || undefined,
            ubicacion: f.ubicacion.trim() || undefined,
            web: f.web.trim() || undefined,
          },
          f.password,
        );
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
        <input className={`mt-1.5 ${inputCls}`} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input
          type="email"
          className={`mt-1.5 ${inputCls}`}
          value={f.email}
          disabled={!!inicial}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
      </label>

      {conPassword && (
        <label className="block">
          <span className="text-sm font-semibold">Contraseña</span>
          <input
            type="password"
            className={`mt-1.5 ${inputCls}`}
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
            placeholder="Mínimo 6 caracteres"
          />
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Rol</span>
          <select className={`mt-1.5 ${inputCls}`} value={f.rol} onChange={(e) => setF({ ...f, rol: e.target.value })}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Ubicación</span>
          <input className={`mt-1.5 ${inputCls}`} value={f.ubicacion} onChange={(e) => setF({ ...f, ubicacion: e.target.value })} placeholder="Ciudad, país" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Sitio o red (opcional)</span>
        <input className={`mt-1.5 ${inputCls}`} value={f.web} onChange={(e) => setF({ ...f, web: e.target.value })} placeholder="tuweb.com / @usuario" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Bio (opcional)</span>
        <textarea className={`mt-1.5 ${inputCls}`} rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="En qué estás trabajando, qué buscas…" />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!listo || enviando}
          className="glow-brand rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
        >
          {enviando ? "Guardando…" : submitLabel}
        </button>
        {onCancelar && (
          <button type="button" onClick={onCancelar} className="rounded-xl border border-border px-6 py-3 font-medium text-muted transition-colors hover:bg-surface">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

/* ---------------- Login ---------------- */

function LoginForm({
  enviando,
  onSubmit,
}: {
  enviando?: boolean;
  onSubmit: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const listo = email.trim() && password;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (listo && !enviando) onSubmit(email.trim(), password);
      }}
      className="space-y-5"
    >
      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input type="email" className={`mt-1.5 ${inputCls}`} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Contraseña</span>
        <input type="password" className={`mt-1.5 ${inputCls}`} value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button
        type="submit"
        disabled={!listo || enviando}
        className="glow-brand rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
      >
        {enviando ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
