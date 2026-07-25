import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";
import type { AnalisisGuardado, DatosPerfil, Usuario } from "./userTypes";
import type { AnalisisRespuesta, IdeaInput } from "./types";

function aIso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return typeof v === "string" ? v : new Date().toISOString();
}

function parseJson<T>(v: unknown): T {
  return typeof v === "string" ? (JSON.parse(v) as T) : (v as T);
}

function filaUsuario(r: RowDataPacket): Usuario {
  return {
    id: r.id,
    nombre: r.nombre,
    email: r.email,
    avatar: r.avatar,
    rol: r.rol,
    bio: r.bio ?? undefined,
    ubicacion: r.ubicacion ?? undefined,
    web: r.web ?? undefined,
    creadoEn: aIso(r.creado_en),
  };
}

export async function emailExiste(email: string): Promise<boolean> {
  const p = await db();
  const [rows] = await p.query<RowDataPacket[]>(
    "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
    [email.toLowerCase()],
  );
  return rows.length > 0;
}

export async function crearUsuario(datos: {
  nombre: string;
  email: string;
  passwordHash: string;
  avatar: string;
  rol: string;
  bio?: string;
  ubicacion?: string;
  web?: string;
}): Promise<Usuario> {
  const p = await db();
  const id = randomUUID();
  await p.query(
    `INSERT INTO usuarios (id, nombre, email, password_hash, avatar, rol, bio, ubicacion, web)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      datos.nombre,
      datos.email.toLowerCase(),
      datos.passwordHash,
      datos.avatar,
      datos.rol,
      datos.bio ?? null,
      datos.ubicacion ?? null,
      datos.web ?? null,
    ],
  );
  const u = await obtenerUsuario(id);
  if (!u) throw new Error("No se pudo crear el usuario");
  return u;
}

export async function credencialesPorEmail(
  email: string,
): Promise<{ id: string; passwordHash: string } | null> {
  const p = await db();
  const [rows] = await p.query<RowDataPacket[]>(
    "SELECT id, password_hash FROM usuarios WHERE email = ? LIMIT 1",
    [email.toLowerCase()],
  );
  if (rows.length === 0) return null;
  return { id: rows[0].id, passwordHash: rows[0].password_hash };
}

export async function obtenerUsuario(id: string): Promise<Usuario | null> {
  const p = await db();
  const [rows] = await p.query<RowDataPacket[]>(
    "SELECT * FROM usuarios WHERE id = ? LIMIT 1",
    [id],
  );
  return rows.length ? filaUsuario(rows[0]) : null;
}

export async function actualizarUsuario(
  id: string,
  parcial: Partial<DatosPerfil>,
): Promise<Usuario | null> {
  const permitidos: (keyof DatosPerfil)[] = [
    "nombre",
    "avatar",
    "rol",
    "bio",
    "ubicacion",
    "web",
  ];
  const sets: string[] = [];
  const valores: unknown[] = [];
  for (const campo of permitidos) {
    if (parcial[campo] !== undefined) {
      sets.push(`${campo} = ?`);
      valores.push(parcial[campo] ?? null);
    }
  }
  if (sets.length) {
    const p = await db();
    valores.push(id);
    await p.query(`UPDATE usuarios SET ${sets.join(", ")} WHERE id = ?`, valores);
  }
  return obtenerUsuario(id);
}

export async function guardarAnalisis(
  usuarioId: string,
  titulo: string,
  input: IdeaInput,
  respuesta: AnalisisRespuesta,
): Promise<AnalisisGuardado> {
  const p = await db();
  const id = randomUUID();
  await p.query(
    `INSERT INTO analisis (id, usuario_id, titulo, input, respuesta)
     VALUES (?, ?, ?, ?, ?)`,
    [id, usuarioId, titulo.slice(0, 200), JSON.stringify(input), JSON.stringify(respuesta)],
  );
  const [rows] = await p.query<RowDataPacket[]>(
    "SELECT * FROM analisis WHERE id = ? LIMIT 1",
    [id],
  );
  return filaAnalisis(rows[0]);
}

export async function listarAnalisis(usuarioId: string): Promise<AnalisisGuardado[]> {
  const p = await db();
  const [rows] = await p.query<RowDataPacket[]>(
    "SELECT * FROM analisis WHERE usuario_id = ? ORDER BY creado_en DESC",
    [usuarioId],
  );
  return rows.map(filaAnalisis);
}

export async function eliminarAnalisis(usuarioId: string, id: string): Promise<void> {
  const p = await db();
  await p.query("DELETE FROM analisis WHERE id = ? AND usuario_id = ?", [id, usuarioId]);
}

function filaAnalisis(r: RowDataPacket): AnalisisGuardado {
  return {
    id: r.id,
    titulo: r.titulo,
    fecha: aIso(r.creado_en),
    input: parseJson<IdeaInput>(r.input),
    respuesta: parseJson<AnalisisRespuesta>(r.respuesta),
  };
}
