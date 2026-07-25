import Link from "next/link";

const PILARES = [
  {
    emoji: "🔍",
    titulo: "Valida",
    texto:
      "¿Resuelve un problema real? ¿Hay mercado? ¿Se diferencia? Una lectura honesta y sin filtros de tu idea.",
  },
  {
    emoji: "💎",
    titulo: "Pule",
    texto:
      "El abogado del diablo constructivo: encuentra los huecos y los convierte en un plan para ejecutar mejor.",
  },
  {
    emoji: "🚀",
    titulo: "Lanza",
    texto:
      "Plan de ejecución por fases, identidad visual (paleta, tipografía, logo) y guía de posicionamiento digital.",
  },
  {
    emoji: "🤝",
    titulo: "Escala",
    texto:
      "Una comunidad tipo incubadora: los emprendedores se conectan, se refieren y crecen juntos. Connect · Build · Scale.",
  },
];

const PASOS = [
  {
    n: "01",
    titulo: "Cuéntanos tu idea y tu contexto",
    texto:
      "Tu idea, a quién sirve, en qué etapa estás y con qué recursos cuentas. Entre más real, mejor el análisis.",
  },
  {
    n: "02",
    titulo: "Recibe un análisis honesto y accionable",
    texto:
      "Fortalezas, riesgos con su 'cómo sí', tu idea pulida, el plan de ejecución, la identidad visual y el posicionamiento.",
  },
  {
    n: "03",
    titulo: "Ejecuta y escala en comunidad",
    texto:
      "Pon el plan en marcha y conéctate con otros emprendedores que ofrecen justo lo que tú buscas.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(52rem 34rem at 78% -12%, rgba(138,43,226,0.34), transparent 60%), radial-gradient(40rem 30rem at 6% 6%, rgba(0,178,255,0.22), transparent 55%), radial-gradient(30rem 24rem at 62% 48%, rgba(255,46,122,0.14), transparent 62%)",
          }}
        />
        <div className="contenedor grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animar-subir">
            <span className="font-sub inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm uppercase tracking-[0.2em] text-muted">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Tu coach de negocio con IA · Powered by Evox
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] sm:text-7xl">
              VALIDA.
              <br />
              CONSTRUYE.
              <br />
              <span className="texto-neon">ESCALA.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Evox Entrepreneur es tu <em>coach de negocio con IA</em>: valida tu
              idea con un abogado del diablo constructivo y te lleva paso a paso
              —sin abrumarte— del análisis al plan, tu identidad visual y tu
              posicionamiento digital. En 1-3 meses, tu presencia lista.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/estudio"
                className="glow-brand rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.03]"
              >
                Validar mi idea
              </Link>
              <Link
                href="/comunidad"
                className="rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-foreground transition-colors hover:bg-surface-2"
              >
                Explorar la comunidad
              </Link>
            </div>
            <p className="font-sub mt-4 text-sm uppercase tracking-wide text-muted">
              Sin registro para probar · para emprendedores de LatAm
            </p>
          </div>

          {/* Vista previa del veredicto */}
          <div className="animar-subir lg:justify-self-end">
            <VistaPreviaVeredicto />
          </div>
        </div>
      </section>

      {/* ¿Qué es? + ecosistema */}
      <section className="contenedor py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <span className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-accent-strong">
              ¿Qué es Evox Entrepreneur?
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Tu coach de negocio con IA, de la idea al lanzamiento
            </h2>
            <p className="mt-4 text-lg text-muted">
              Evox Entrepreneur te acompaña, paso a paso y sin abrumarte, a{" "}
              <strong className="text-foreground">validar</strong> tu idea,{" "}
              <strong className="text-foreground">pulirla</strong>, crear tu{" "}
              <strong className="text-foreground">identidad visual</strong> y
              lograr tu <strong className="text-foreground">posicionamiento
              digital</strong> en 1-3 meses. Y no te suelta: queda disponible para
              consultar tus dudas de IA cuando las tengas.
            </p>
          </div>

          <div
            className="borde-neon rounded-3xl p-6 sm:p-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(138,43,226,0.14), rgba(0,178,255,0.10) 60%, rgba(255,46,122,0.10))",
            }}
          >
            <p className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-brand-strong">
              Parte del ecosistema
            </p>
            <p className="mt-2 font-display text-2xl font-bold tracking-widest">
              <span className="texto-neon">EVOX</span>
              <span className="text-foreground">VERSE</span>
            </p>
            <p className="mt-3 text-foreground/85">
              Evox Entrepreneur es parte de <strong>EVOXVERSE</strong>, el
              ecosistema Evox — junto a{" "}
              <a
                href="https://evoxlearn.evoxverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue hover:underline"
              >
                Evox Learn
              </a>
              , la plataforma de educación. Aquí construyes y te conectas en
              comunidad; ahí te sigues formando.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand bg-brand-soft p-4">
                <p className="text-sm font-bold text-brand-strong">Evox Entrepreneur</p>
                <p className="mt-0.5 text-xs text-muted">Tu coach · estás aquí</p>
              </div>
              <a
                href="https://evoxlearn.evoxverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-brand hover:bg-brand-soft/40"
              >
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  Evox Learn
                  <span className="text-xs text-muted transition-colors group-hover:text-brand-strong">
                    ↗
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted">Educación</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="contenedor py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Todo el camino, en un solo lugar
          </h2>
          <p className="mt-3 text-lg text-muted">
            De la idea cruda al lanzamiento y la comunidad. Cuatro etapas,
            acompañadas paso a paso.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p, i) => (
            <div
              key={p.titulo}
              className="hover-neon rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-xl">
                {p.emoji}
              </div>
              <h3 className="mt-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wide">
                <span className="font-mono text-sm text-blue">0{i + 1}</span>
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-muted">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filosofía */}
      <section className="bg-surface">
        <div className="contenedor grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-accent-strong">
              Regla innegociable
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              No buscamos todos los &ldquo;no&rdquo;.
              <br />
              Buscamos el <span className="texto-neon">cómo sí</span>.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Un buen socio no te dice a todo que sí, pero tampoco te tumba la
              idea por deporte. Evox es crítico y honesto: detecta los supuestos
              frágiles y los riesgos reales. Y por cada uno, te da una acción
              concreta para superarlo.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background p-5 opacity-75">
              <p className="font-sub text-sm font-semibold uppercase tracking-wide text-muted">
                Un sí que no ayuda
              </p>
              <p className="mt-1 text-foreground/70">
                &ldquo;¡Suena increíble, hazlo!&rdquo; — halago vacío que no
                prepara para la realidad.
              </p>
            </div>
            <div className="borde-neon rounded-2xl bg-brand-soft p-5">
              <p className="font-sub text-sm font-semibold uppercase tracking-wide text-brand-strong">
                El cómo sí de Evox
              </p>
              <p className="mt-1 text-foreground">
                &ldquo;El riesgo es que el segmento es muy amplio. Empieza por
                este nicho y valida con 10 preventas.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="contenedor py-16">
        <h2 className="text-3xl font-bold sm:text-4xl">Cómo funciona</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {PASOS.map((paso) => (
            <div key={paso.n} className="relative">
              <span className="font-display text-5xl font-extrabold texto-neon">
                {paso.n}
              </span>
              <h3 className="mt-2 text-xl font-bold">{paso.titulo}</h3>
              <p className="mt-2 text-muted">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comunidad */}
      <section className="bg-surface">
        <div className="contenedor py-16">
          <div
            className="borde-neon rounded-3xl p-8 sm:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(138,43,226,0.16), rgba(0,178,255,0.10) 55%, rgba(255,46,122,0.12))",
            }}
          >
            <div className="max-w-2xl">
              <span className="font-sub text-sm font-semibold uppercase tracking-[0.2em] text-brand-strong">
                Comunidad
              </span>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                Una incubadora que conecta emprendedores
              </h2>
              <p className="mt-4 text-lg text-foreground/85">
                Cada miembro declara lo que <strong>ofrece</strong> (contactos,
                experiencia, servicios) y lo que <strong>busca</strong>. La
                comunidad te conecta con quien tiene justo lo que necesitas: se
                refieren clientes, se apoyan y escalan juntos.
              </p>
              <Link
                href="/comunidad"
                className="glow-brand mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-brand-ink transition-transform hover:scale-[1.03]"
              >
                Explorar la comunidad
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="contenedor py-20 text-center">
        <h2 className="text-3xl font-bold sm:text-5xl">
          ¿Tienes una idea rondando?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Ponla a prueba con un análisis honesto y llévate un plan para
          ejecutarla mejor. Belong to the evolution.
        </p>
        <Link
          href="/estudio"
          className="glow-accent mt-8 inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
        >
          Validar mi idea ahora
        </Link>
      </section>
    </>
  );
}

function VistaPreviaVeredicto() {
  return (
    <div className="borde-neon w-full max-w-md rounded-2xl bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="font-sub text-sm font-medium uppercase tracking-wide text-muted">
          Veredicto
        </span>
        <span className="rounded-full bg-media-soft px-3 py-1 text-xs font-semibold text-media">
          Ajustar
        </span>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <span className="font-display text-5xl font-extrabold texto-neon">68</span>
        <span className="pb-1.5 text-sm text-muted">/ 100 viabilidad</span>
      </div>
      <p className="mt-3 text-sm text-foreground/80">
        Resuelve un problema real y es ejecutable. El riesgo está en enfocar
        demasiado amplio al inicio.
      </p>
      <div className="mt-5 space-y-3 border-t border-border pt-5">
        <div className="flex gap-3">
          <span className="mt-0.5 text-blue">✓</span>
          <p className="text-sm">
            <span className="font-semibold">Fortaleza:</span> problema con dolor
            real y recurrente.
          </p>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="font-sub text-xs font-semibold uppercase tracking-wide text-alta">
            Riesgo · alta
          </p>
          <p className="mt-1 text-sm">El segmento inicial es muy amplio.</p>
          <p className="mt-2 text-sm text-brand-strong">
            <span className="font-semibold">Cómo sí:</span> elige un nicho para
            los primeros 90 días y valida con 10 preventas.
          </p>
        </div>
      </div>
    </div>
  );
}
