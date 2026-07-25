import { NextResponse } from "next/server";
import { analizarIdea } from "@/lib/anthropic";
import type {
  Alcance,
  Etapa,
  IdeaInput,
  NivelIA,
  Objetivo,
} from "@/lib/types";

const ETAPAS: Etapa[] = ["idea", "iniciado", "consolidado"];
const ALCANCES: Alcance[] = ["local", "nacional", "online", "internacional"];
const OBJETIVOS: Objetivo[] = [
  "validar",
  "primeros-clientes",
  "aumentar-ventas",
  "marca-presencia",
  "escalar",
];
const NIVELES_IA: NivelIA[] = ["nunca", "basico", "seguido", "integrada"];

const REQUERIDOS = ["producto", "problema", "cliente", "diferenciador", "recursos"] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const texto = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  const faltantes = REQUERIDOS.filter((campo) => !texto(campo));
  if (faltantes.length > 0) {
    return NextResponse.json(
      { error: `Faltan campos: ${faltantes.join(", ")}` },
      { status: 400 },
    );
  }

  const enUnion = <T extends string>(valores: T[], v: unknown, def: T): T =>
    valores.includes(v as T) ? (v as T) : def;

  const presencia = Array.isArray(body.presenciaDigital)
    ? (body.presenciaDigital as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  const input: IdeaInput = {
    etapa: enUnion(ETAPAS, body.etapa, "idea"),
    producto: texto("producto"),
    ofertaPrincipal: texto("ofertaPrincipal"),
    problema: texto("problema"),
    cliente: texto("cliente"),
    diferenciador: texto("diferenciador"),
    competencia: texto("competencia"),
    modelo: texto("modelo"),
    alcance: enUnion(ALCANCES, body.alcance, "local"),
    ubicacion: texto("ubicacion"),
    recursos: texto("recursos"),
    presenciaDigital: presencia,
    objetivo: enUnion(OBJETIVOS, body.objetivo, "validar"),
    nivelIA: enUnion(NIVELES_IA, body.nivelIA, "nunca"),
  };

  const respuesta = await analizarIdea(input);
  return NextResponse.json(respuesta);
}
