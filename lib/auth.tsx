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
import type { AnalisisGuardado, DatosPerfil, Usuario } from "./userTypes";

// Identidad real: cuentas y entregables persistidos en el servidor (MySQL) vía
// API. La sesión vive en una cookie httpOnly; el navegador no guarda datos.
export type { Usuario, AnalisisGuardado, DatosPerfil } from "./userTypes";

interface AuthCtx {
  listo: boolean;
  usuario: Usuario | null;
  analisis: AnalisisGuardado[];
  registro: (datos: DatosPerfil & { password: string }) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  actualizarPerfil: (parcial: Partial<DatosPerfil>) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  guardarAnalisis: (input: IdeaInput, respuesta: AnalisisRespuesta) => Promise<void>;
  eliminarAnalisis: (id: string) => Promise<void>;
}

interface RespuestaApi {
  usuario?: Usuario | null;
  analisis?: AnalisisGuardado[];
  error?: string;
}

const Ctx = createContext<AuthCtx | null>(null);
const JSON_HEADERS = { "Content-Type": "application/json" };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [listo, setListo] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [analisis, setAnalisis] = useState<AnalisisGuardado[]>([]);

  const cargarAnalisis = useCallback(async () => {
    try {
      const res = await fetch("/api/analisis");
      const data = (await res.json()) as RespuestaApi;
      setAnalisis(Array.isArray(data.analisis) ? data.analisis : []);
    } catch {
      setAnalisis([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/yo");
        const data = (await res.json()) as RespuestaApi;
        setUsuario(data.usuario ?? null);
        if (data.usuario) await cargarAnalisis();
      } catch {
        /* sin conexión / sin BD */
      }
      setListo(true);
    })();
  }, [cargarAnalisis]);

  const registro = useCallback(
    async (datos: DatosPerfil & { password: string }): Promise<string | null> => {
      try {
        const res = await fetch("/api/auth/registro", {
          method: "POST",
          headers: JSON_HEADERS,
          body: JSON.stringify(datos),
        });
        const data = (await res.json()) as RespuestaApi;
        if (!res.ok) return data.error ?? "No se pudo crear la cuenta.";
        setUsuario(data.usuario ?? null);
        await cargarAnalisis();
        return null;
      } catch {
        return "Error de conexión. Inténtalo de nuevo.";
      }
    },
    [cargarAnalisis],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: JSON_HEADERS,
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as RespuestaApi;
        if (!res.ok) return data.error ?? "No se pudo iniciar sesión.";
        setUsuario(data.usuario ?? null);
        await cargarAnalisis();
        return null;
      } catch {
        return "Error de conexión. Inténtalo de nuevo.";
      }
    },
    [cargarAnalisis],
  );

  const actualizarPerfil = useCallback(async (parcial: Partial<DatosPerfil>) => {
    try {
      const res = await fetch("/api/auth/yo", {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify(parcial),
      });
      const data = (await res.json()) as RespuestaApi;
      if (res.ok && data.usuario) setUsuario(data.usuario);
    } catch {
      /* ignora */
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignora */
    }
    setUsuario(null);
    setAnalisis([]);
  }, []);

  const guardarAnalisis = useCallback(
    async (input: IdeaInput, respuesta: AnalisisRespuesta) => {
      try {
        const res = await fetch("/api/analisis", {
          method: "POST",
          headers: JSON_HEADERS,
          body: JSON.stringify({ input, respuesta, titulo: input.producto?.slice(0, 200) }),
        });
        if (res.ok) await cargarAnalisis();
      } catch {
        /* ignora */
      }
    },
    [cargarAnalisis],
  );

  const eliminarAnalisis = useCallback(async (id: string) => {
    try {
      await fetch(`/api/analisis?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      /* ignora */
    }
    setAnalisis((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const valor = useMemo<AuthCtx>(
    () => ({
      listo,
      usuario,
      analisis,
      registro,
      login,
      actualizarPerfil,
      cerrarSesion,
      guardarAnalisis,
      eliminarAnalisis,
    }),
    [
      listo,
      usuario,
      analisis,
      registro,
      login,
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
