"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdeaForm } from "@/components/estudio/IdeaForm";
import { Resultado } from "@/components/estudio/Resultado";
import { Logo } from "@/components/Logo";
import { useUsuario } from "@/lib/auth";
import { generarEjemplo } from "@/lib/mockData";
import type { AnalisisRespuesta, IdeaInput } from "@/lib/types";

type Estado = "form" | "cargando" | "resultado";

export default function EstudioPage() {
  const { usuario, guardarAnalisis } = useUsuario();
  const [estado, setEstado] = useState<Estado>("form");
  const [respuesta, setRespuesta] = useState<AnalisisRespuesta | null>(null);
  const [ultimoInput, setUltimoInput] = useState<IdeaInput | null>(null);
  const [guardado, setGuardado] = useState(false);

  async function analizar(input: IdeaInput) {
    setGuardado(false);
    setUltimoInput(input);
    setEstado("cargando");
    let resultado: AnalisisRespuesta;
    try {
      const res = await fetch("/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("respuesta no ok");
      resultado = (await res.json()) as AnalisisRespuesta;
    } catch {
      // Respaldo con ejemplo en el cliente ante un error de red.
      resultado = { analisis: generarEjemplo(input), fuente: "ejemplo" };
    }
    setRespuesta(resultado);
    setEstado("resultado");
  }

  async function guardar() {
    if (respuesta && ultimoInput) {
      setGuardado(true);
      await guardarAnalisis(ultimoInput, respuesta);
    }
  }

  return (
    <div className="contenedor max-w-4xl py-12">
      {estado === "resultado" && respuesta ? (
        <>
          {!usuario && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <span className="text-muted">
                Crea tu perfil para guardar este análisis y darle seguimiento.
              </span>
              <Link
                href="/perfil"
                className="rounded-lg bg-brand px-3 py-1.5 font-semibold text-brand-ink"
              >
                Crear perfil
              </Link>
            </div>
          )}
          <Resultado
            analisis={respuesta.analisis}
            fuente={respuesta.fuente}
            onReset={() => {
              setRespuesta(null);
              setEstado("form");
            }}
            onGuardar={usuario ? guardar : undefined}
            guardado={guardado}
          />
        </>
      ) : estado === "cargando" ? (
        <Cargando />
      ) : (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">Habla con tu coach</h1>
            <p className="mt-3 text-lg text-muted">
              Cuéntale tu negocio y su contexto. Tu coach analiza como un experto
              —adaptándose a tu etapa— y te devuelve validación honesta, tu idea
              pulida, un plan orientado a tu posicionamiento digital en 1-3 meses,
              e identidad visual.
            </p>
          </header>
          <IdeaForm onSubmit={analizar} cargando={false} />
        </>
      )}
    </div>
  );
}

const MENSAJES = [
  "Leyendo tu idea con lupa…",
  "Buscando los huecos, con cariño…",
  "Pensando el «cómo sí»…",
  "Armando tu plan de ejecución…",
  "Diseñando tu identidad visual…",
];

function Cargando() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MENSAJES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <Logo className="animar-pulso h-16 w-16" />
      <p className="mt-6 text-lg font-medium">{MENSAJES[i]}</p>
      <p className="mt-2 text-sm text-muted">
        Un buen análisis toma unos segundos. Vale la pena.
      </p>
    </div>
  );
}
