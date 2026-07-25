import { NextResponse } from "next/server";
import { generarBrandBook } from "@/lib/brandbook";
import type { BrandBookInput } from "@/lib/brandbookTypes";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const contexto = typeof body.contexto === "string" ? body.contexto.trim() : "";
  if (!contexto) {
    return NextResponse.json({ error: "Falta describir tu negocio." }, { status: 400 });
  }

  const input: BrandBookInput = {
    contexto,
    nombre:
      typeof body.nombre === "string" && body.nombre.trim() ? body.nombre.trim() : undefined,
  };

  const respuesta = await generarBrandBook(input);
  return NextResponse.json(respuesta);
}
