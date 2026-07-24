"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AnalisisRespuesta, IdeaInput } from "./types";

// Identidad local-first: el perfil y su historial viven en el navegador.
// Para cuentas reales multi-dispositivo, se cambia esta capa por un backend
// con base de datos (los componentes que la consumen no cambiarían).

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar: string; // emoji
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

interface AuthCtx {
  listo: boolean;
  usuario: Usuario | null;
  analisis: AnalisisGuardado[];
  crearPerfil: (datos: Omit<Usuario, "id" | "creadoEn">) => void;
  actualizarPerfil: (parcial: Partial<Omit<Usuario, "id" | "creadoEn">>) => void;
  cerrarSesion: () => void;
  guardarAnalisis: (input: IdeaInput, respuesta: AnalisisRespuesta) => void;
  eliminarAnalisis: (id: string) => void;
}

const KEY_USER = "evox_usuario";
const KEY_ANALISIS = "evox_analisis";

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [listo, setListo] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [analisis, setAnalisis] = useState<AnalisisGuardado[]>([]);

  useEffect(() => {
    try {
      const u = localStorage.getItem(KEY_USER);
      if (u) setUsuario(JSON.parse(u));
      const a = localStorage.getItem(KEY_ANALISIS);
      if (a) setAnalisis(JSON.parse(a));
    } catch {
      /* almacenamiento no disponible */
    }
    setListo(true);
  }, []);

  const persistirUsuario = useCallback((u: Usuario | null) => {
    setUsuario(u);
    try {
      if (u) localStorage.setItem(KEY_USER, JSON.stringify(u));
      else localStorage.removeItem(KEY_USER);
    } catch {
      /* ignora */
    }
  }, []);

  const persistirAnalisis = useCallback((lista: AnalisisGuardado[]) => {
    setAnalisis(lista);
    try {
      localStorage.setItem(KEY_ANALISIS, JSON.stringify(lista));
    } catch {
      /* ignora */
    }
  }, []);

  const crearPerfil = useCallback(
    (datos: Omit<Usuario, "id" | "creadoEn">) => {
      persistirUsuario({
        ...datos,
        id: `u_${Date.now()}`,
        creadoEn: new Date().toISOString(),
      });
    },
    [persistirUsuario],
  );

  const actualizarPerfil = useCallback(
    (parcial: Partial<Omit<Usuario, "id" | "creadoEn">>) => {
      setUsuario((prev) => {
        if (!prev) return prev;
        const actualizado = { ...prev, ...parcial };
        try {
          localStorage.setItem(KEY_USER, JSON.stringify(actualizado));
        } catch {
          /* ignora */
        }
        return actualizado;
      });
    },
    [],
  );

  const cerrarSesion = useCallback(() => {
    persistirUsuario(null);
    persistirAnalisis([]);
  }, [persistirUsuario, persistirAnalisis]);

  const guardarAnalisis = useCallback(
    (input: IdeaInput, respuesta: AnalisisRespuesta) => {
      const item: AnalisisGuardado = {
        id: `a_${Date.now()}`,
        titulo: input.producto.slice(0, 80),
        fecha: new Date().toISOString(),
        input,
        respuesta,
      };
      setAnalisis((prev) => {
        const lista = [item, ...prev];
        try {
          localStorage.setItem(KEY_ANALISIS, JSON.stringify(lista));
        } catch {
          /* ignora */
        }
        return lista;
      });
    },
    [],
  );

  const eliminarAnalisis = useCallback(
    (id: string) => {
      persistirAnalisis(analisis.filter((a) => a.id !== id));
    },
    [analisis, persistirAnalisis],
  );

  const valor = useMemo<AuthCtx>(
    () => ({
      listo,
      usuario,
      analisis,
      crearPerfil,
      actualizarPerfil,
      cerrarSesion,
      guardarAnalisis,
      eliminarAnalisis,
    }),
    [
      listo,
      usuario,
      analisis,
      crearPerfil,
      actualizarPerfil,
      cerrarSesion,
      guardarAnalisis,
      eliminarAnalisis,
    ],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useUsuario(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUsuario debe usarse dentro de <AuthProvider>");
  return ctx;
}
