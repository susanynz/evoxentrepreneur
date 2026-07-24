import { NextResponse } from "next/server";
import { analizarIdea } from "@/lib/anthropic";
import type { Etapa, IdeaInput } from "@/lib/types";

const ETAPAS: Etapa[] = ["idea", "prototipo", "vendiendo", "escalando"];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const b = body as Partial<Record<keyof IdeaInput, string>>;
  const faltantes = (["idea", "problema", "cliente", "recursos"] as const).filter(
    (campo) => !b[campo]?.trim(),
  );
  if (faltantes.length > 0) {
    return NextResponse.json(
      { error: `Faltan campos: ${faltantes.join(", ")}` },
      { status: 400 },
    );
  }

  const etapa: Etapa = ETAPAS.includes(b.etapa as Etapa) ? (b.etapa as Etapa) : "idea";

  const input: IdeaInput = {
    idea: b.idea!.trim(),
    problema: b.problema!.trim(),
    cliente: b.cliente!.trim(),
    etapa,
    recursos: b.recursos!.trim(),
    modelo: b.modelo?.trim() || undefined,
    ubicacion: b.ubicacion?.trim() || undefined,
  };

  const respuesta = await analizarIdea(input);
  return NextResponse.json(respuesta);
}
