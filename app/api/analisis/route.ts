import { NextResponse } from "next/server";
import { hayDb } from "@/lib/db";
import { eliminarAnalisis, guardarAnalisis, listarAnalisis } from "@/lib/repo";
import { usuarioIdActual } from "@/lib/session";
import type { AnalisisRespuesta, IdeaInput } from "@/lib/types";

export async function GET() {
  if (!hayDb()) return NextResponse.json({ analisis: [] });
  const id = await usuarioIdActual();
  if (!id) return NextResponse.json({ analisis: [] });
  const analisis = await listarAnalisis(id);
  return NextResponse.json({ analisis });
}

export async function POST(request: Request) {
  if (!hayDb()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 503 });
  }
  const id = await usuarioIdActual();
  if (!id) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const input = body.input as IdeaInput | undefined;
  const respuesta = body.respuesta as AnalisisRespuesta | undefined;
  if (!input || !respuesta) {
    return NextResponse.json({ error: "Faltan datos del análisis." }, { status: 400 });
  }
  const titulo = typeof body.titulo === "string" && body.titulo.trim()
    ? body.titulo.trim()
    : (input.producto || "Análisis").slice(0, 200);

  const guardado = await guardarAnalisis(id, titulo, input, respuesta);
  return NextResponse.json({ analisis: guardado });
}

export async function DELETE(request: Request) {
  if (!hayDb()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 503 });
  }
  const id = await usuarioIdActual();
  if (!id) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const aid = new URL(request.url).searchParams.get("id");
  if (aid) await eliminarAnalisis(id, aid);
  return NextResponse.json({ ok: true });
}
