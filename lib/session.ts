import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Sesión sin estado: un JWT firmado en una cookie httpOnly. Solo el servidor
// lo lee/escribe; el navegador nunca ve el id crudo del usuario.

const COOKIE = "evox_sesion";
const DURACION = 60 * 60 * 24 * 30; // 30 días

function clave(): Uint8Array {
  const s = process.env.AUTH_SECRET || "cambia-este-secreto-en-produccion";
  return new TextEncoder().encode(s);
}

export async function crearSesion(usuarioId: string): Promise<void> {
  const token = await new SignJWT({ uid: usuarioId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION}s`)
    .sign(clave());

  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION,
  });
}

export async function usuarioIdActual(): Promise<string | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave());
    return typeof payload.uid === "string" ? payload.uid : null;
  } catch {
    return null;
  }
}

export async function cerrarSesion(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
}
