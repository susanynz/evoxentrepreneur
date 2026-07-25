import type { AnalisisRespuesta, IdeaInput } from "./types";

// Tipos de usuario/entregables compartidos entre el servidor (repo) y el
// cliente (contexto de auth). El perfil público NUNCA incluye el hash.

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar: string;
  rol: string;
  bio?: string;
  ubicacion?: string;
  web?: string;
  creadoEn: string;
}

export interface AnalisisGuardado {
  id: string;
  titulo: string;
  fecha: string;
  input: IdeaInput;
  respuesta: AnalisisRespuesta;
}

export type DatosPerfil = Omit<Usuario, "id" | "creadoEn">;
