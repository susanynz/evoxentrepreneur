import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hayDb } from "@/lib/db";
import { credencialesPorEmail, obtenerUsuario } from "@/lib/repo";
import { crearSesion } from "@/lib/session";

export async function POST(request: Request) {
  if (!hayDb()) {
    return NextResponse.json(
      { error: "La base de datos aún no está configurada." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña son obligatorios." }, { status: 400 });
  }

  try {
    const cred = await credencialesPorEmail(email);
    if (!cred || !(await bcrypt.compare(password, cred.passwordHash))) {
      return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
    }
    await crearSesion(cred.id);
    const usuario = await obtenerUsuario(cred.id);
    return NextResponse.json({ usuario });
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ error: "No se pudo iniciar sesión." }, { status: 500 });
  }
}
