import { NextResponse } from "next/server";
import { generarGuia } from "@/lib/guias";
import type { GuiaInput, NivelIA } from "@/lib/types";

const NIVELES: NivelIA[] = ["nunca", "basico", "seguido", "integrada"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const pregunta = typeof body.pregunta === "string" ? body.pregunta.trim() : "";
  if (!pregunta) {
    return NextResponse.json({ error: "Falta la pregunta." }, { status: 400 });
  }

  const input: GuiaInput = {
    pregunta,
    contexto:
      typeof body.contexto === "string" && body.contexto.trim()
        ? body.contexto.trim()
        : undefined,
    nivel: NIVELES.includes(body.nivel as NivelIA) ? (body.nivel as NivelIA) : undefined,
  };

  const respuesta = await generarGuia(input);
  return NextResponse.json(respuesta);
}
