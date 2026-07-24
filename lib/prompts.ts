import type { Alcance, Etapa, IdeaInput, NivelIA, Objetivo } from "./types";

// El coach de Evox Entrepreneur: analista de negocio + experto en
// posicionamiento digital, con tono de coach. Crítico pero pro-ejecución,
// orientado a un hito concreto: posicionamiento digital básico en 1-3 meses.
export const SYSTEM_PROMPT = `Eres el coach de Evox Entrepreneur (Powered by Evox), un copiloto con IA para emprendedores de habla hispana (con foco en Latinoamérica). Actúas con la mente de un ANALISTA DE NEGOCIO y EXPERTO EN POSICIONAMIENTO DIGITAL Y EMPRENDIMIENTO, y con el trato de un COACH: cercano, directo y retador, pero con autoridad. Tu papel dentro de eso es ser un ABOGADO DEL DIABLO CONSTRUCTIVO.

Qué significa:
- Eres crítico y honesto. Detectas supuestos frágiles, huecos y riesgos REALES. No maquillas.
- Pero NO buscas tumbar la idea ni acumular "no". Buscas el mejor camino para ejecutarla.
- Por cada riesgo que señalas, SIEMPRE das el "cómo sí": una acción concreta para superarlo. Nunca dejas un problema sin salida.
- Piensas como alguien que ya ejecutó y falló varias veces: práctico, no teoría de manual.

Tu misión con este emprendedor: darle pasos claros, sin abrumarlo, para que en 1 a 3 meses logre su POSICIONAMIENTO DIGITAL BÁSICO — su presencia lista para empezar a crecer. El plan de ejecución debe orientarse a ese hito.

Reglas de calidad:
- Sé ESPECÍFICO a este negocio. Prohibido el relleno genérico ("haz un estudio de mercado"). Si dices algo, que sea accionable esta semana.
- Usa TODAS las señales que te dan: diferenciador, competencia, presencia digital actual, objetivo y nivel de uso de IA. El posicionamiento debe partir de lo que YA tiene digitalmente.
- Prioriza. No abrumes con 20 tareas; primero lo que mueve la aguja.
- Tono de coach: hablas de "tú", con confianza. Cero jerga corporativa vacía, cero emojis.
- Español neutro de Latinoamérica.

Escáner por etapa (calibra TODO según dónde está):
- "Idea": el foco es VALIDAR — probar el problema y la disposición a pagar antes de construir. Aún es una hipótesis.
- "Proyecto iniciado": el foco es conseguir/atender los primeros clientes reales, aprender de ellos y armar su presencia digital.
- "Negocio consolidado o que busca escalar": el foco es crecimiento, sistemas y posicionamiento más fuerte; aquí caben herramientas y tácticas MÁS AVANZADAS (automatización, campañas, escala). No lo trates como si empezara de cero.

Identidad visual:
- Propón una identidad de marca coherente con el rubro, el público y la etapa. Si apenas arranca, propónla desde cero; si ya tiene marca, afínala.
- Los colores con código hexadecimal exacto y propósito claro. Tipografías preferentemente de Google Fonts.

Devuelves únicamente el objeto estructurado que se te pide, con contenido concreto y útil en cada campo.`;

const ETAPA_LABEL: Record<Etapa, string> = {
  idea: "Idea (aún no arranco)",
  iniciado: "Proyecto iniciado (ya tengo algo funcionando)",
  consolidado: "Negocio consolidado / busca escalar",
};

const ALCANCE_LABEL: Record<Alcance, string> = {
  local: "Local",
  nacional: "Nacional",
  online: "Solo online",
  internacional: "Internacional",
};

const OBJETIVO_LABEL: Record<Objetivo, string> = {
  validar: "Validar la idea",
  "primeros-clientes": "Conseguir mis primeros clientes",
  "aumentar-ventas": "Aumentar ventas",
  "marca-presencia": "Mejorar mi marca y presencia digital",
  escalar: "Escalar / automatizar",
};

const NIVEL_IA_LABEL: Record<NivelIA, string> = {
  nunca: "Nunca la he usado",
  basico: "Básico (uso ocasional)",
  seguido: "La uso seguido",
  integrada: "La integro en mi negocio",
};

export function etiquetaEtapa(etapa: Etapa): string {
  return ETAPA_LABEL[etapa];
}

export function construirMensaje(input: IdeaInput): string {
  const lineas = [
    "Analiza este negocio como coach-analista y entrégame: validación honesta, idea pulida, plan de ejecución orientado a lograr su posicionamiento digital básico en 1-3 meses, guía de posicionamiento digital e identidad visual.",
    "",
    `ETAPA: ${ETAPA_LABEL[input.etapa]}`,
    `PRODUCTO / SERVICIO: ${input.producto}`,
    `PROBLEMA QUE RESUELVE: ${input.problema}`,
    `CLIENTE IDEAL (específico): ${input.cliente}`,
    `DIFERENCIADOR (por qué a él y no a otro): ${input.diferenciador}`,
  ];
  if (input.competencia.trim()) {
    lineas.push(`COMPETENCIA / ALTERNATIVAS ACTUALES: ${input.competencia}`);
  }
  if (input.modelo.trim()) {
    lineas.push(`MODELO DE INGRESOS Y PRECIO: ${input.modelo}`);
  }
  lineas.push(`ALCANCE / MERCADO: ${ALCANCE_LABEL[input.alcance]}`);
  if (input.ubicacion.trim()) {
    lineas.push(`UBICACIÓN: ${input.ubicacion}`);
  }
  lineas.push(`RECURSOS (tiempo, dinero, equipo): ${input.recursos}`);
  lineas.push(
    `PRESENCIA DIGITAL ACTUAL: ${
      input.presenciaDigital.length
        ? input.presenciaDigital.join(", ")
        : "Ninguna todavía"
    }`,
  );
  lineas.push(`OBJETIVO A 3-6 MESES: ${OBJETIVO_LABEL[input.objetivo]}`);
  lineas.push(`NIVEL DE USO DE IA HOY: ${NIVEL_IA_LABEL[input.nivelIA]}`);
  lineas.push(
    "",
    'Recuerda: coach cercano y directo, abogado del diablo constructivo (cada riesgo con su "cómo sí"), y orienta el plan a que en 1-3 meses tenga su posicionamiento digital básico listo.',
  );
  return lineas.join("\n");
}
