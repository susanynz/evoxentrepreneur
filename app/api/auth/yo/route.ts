import { NextResponse } from "next/server";
import { hayDb } from "@/lib/db";
import { actualizarUsuario, obtenerUsuario } from "@/lib/repo";
import { usuarioIdActual } from "@/lib/session";
import type { DatosPerfil } from "@/lib/userTypes";

export async function GET() {
  if (!hayDb()) return NextResponse.json({ usuario: null });
  const id = await usuarioIdActual();
  if (!id) return NextResponse.json({ usuario: null });
  const usuario = await obtenerUsuario(id);
  return NextResponse.json({ usuario });
}

export async function PATCH(request: Request) {
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

  const parcial: Partial<DatosPerfil> = {};
  for (const campo of ["nombre", "avatar", "rol", "bio", "ubicacion", "web"] as const) {
    if (typeof body[campo] === "string") parcial[campo] = (body[campo] as string).trim();
  }

  const usuario = await actualizarUsuario(id, parcial);
  return NextResponse.json({ usuario });
}
