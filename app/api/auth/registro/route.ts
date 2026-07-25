import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hayDb } from "@/lib/db";
import { crearUsuario, emailExiste } from "@/lib/repo";
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

  const s = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const nombre = s("nombre");
  const email = s("email").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!nombre || !email || password.length < 6) {
    return NextResponse.json(
      { error: "Nombre, email y contraseña (mínimo 6 caracteres) son obligatorios." },
      { status: 400 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
  }

  try {
    if (await emailExiste(email)) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email." },
        { status: 409 },
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await crearUsuario({
      nombre,
      email,
      passwordHash,
      avatar: s("avatar") || "🚀",
      rol: s("rol") || "Founder",
      bio: s("bio") || undefined,
      ubicacion: s("ubicacion") || undefined,
      web: s("web") || undefined,
    });
    await crearSesion(usuario.id);
    return NextResponse.json({ usuario });
  } catch (error) {
    console.error("[registro]", error);
    return NextResponse.json({ error: "No se pudo crear la cuenta." }, { status: 500 });
  }
}
