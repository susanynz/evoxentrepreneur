import Anthropic from "@anthropic-ai/sdk";
import {
  guiaJsonSchema,
  type Guia,
  type GuiaInput,
  type GuiaRespuesta,
  type NivelIA,
} from "./types";

// Solo servidor. Genera una guía puntual de cómo usar IA en el negocio.

const NIVEL_LABEL: Record<NivelIA, string> = {
  nunca: "principiante total (nunca ha usado IA)",
  basico: "básico (uso ocasional)",
  seguido: "intermedio (la usa seguido)",
  integrada: "avanzado (la integra en su negocio)",
};

// Enlaces oficiales — los pone el servidor, no la IA (evita URLs inventadas).
const DOCS: { re: RegExp; url: string }[] = [
  { re: /claude|anthropic/i, url: "https://claude.ai" },
  { re: /chatgpt|openai|gpt/i, url: "https://chatgpt.com" },
  { re: /gemini|google/i, url: "https://gemini.google.com" },
  { re: /canva/i, url: "https://www.canva.com" },
];

function docUrl(nombre: string): string | undefined {
  return DOCS.find((d) => d.re.test(nombre))?.url;
}

const SYSTEM = `Eres el coach de IA de Evox Entrepreneur (Powered by Evox). Ayudas a emprendedores de habla hispana a usar herramientas de IA en su negocio con guías PUNTUALES y accionables — nada de teoría ni de abrumar.

Reglas:
- Recomienda la herramienta MÁS adecuada para la tarea:
  · Claude → razonamiento, textos largos, análisis, estrategia.
  · ChatGPT → versátil, generación de imágenes, uso general.
  · Gemini → integrado con Google (Docs, Sheets, Gmail).
  · Canva → diseño y piezas visuales (con su IA, Magic Studio).
- Da entre 3 y 6 pasos concretos que pueda hacer hoy, con sus recursos.
- Incluye SIEMPRE un prompt de ejemplo listo para copiar y pegar, ya adaptado a su negocio.
- Adapta al nivel del emprendedor: si es principiante, explica lo básico y ve simple; si es avanzado, ve a automatización/integración.
- Español simple y directo, sin jerga. Aplica todo a SU negocio concreto; nada genérico.

Devuelves únicamente el objeto estructurado que se te pide.`;

function construirMensaje(input: GuiaInput): string {
  const lineas = [`El emprendedor quiere lograr esto con IA: ${input.pregunta}`];
  if (input.contexto?.trim()) {
    lineas.push(`Sobre su negocio: ${input.contexto}`);
  }
  if (input.nivel) {
    lineas.push(`Su nivel con IA: ${NIVEL_LABEL[input.nivel]}`);
  }
  lineas.push(
    "Arma una guía puntual: herramienta ideal, por qué, 3-6 pasos, un prompt de ejemplo listo para copiar, y el siguiente paso.",
  );
  return lineas.join("\n");
}

export async function generarGuia(input: GuiaInput): Promise<GuiaRespuesta> {
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return { guia: ejemploGuia(input), fuente: "ejemplo" };
  }
  try {
    const client = new Anthropic();
    const respuesta = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      output_config: {
        effort: "medium",
        format: {
          type: "json_schema",
          schema: guiaJsonSchema as unknown as Record<string, unknown>,
        },
      },
      messages: [{ role: "user", content: construirMensaje(input) }],
    });

    if (respuesta.stop_reason === "refusal") {
      return { guia: ejemploGuia(input), fuente: "ejemplo" };
    }
    const bloque = respuesta.content.find((b) => b.type === "text");
    if (!bloque || bloque.type !== "text") {
      return { guia: ejemploGuia(input), fuente: "ejemplo" };
    }
    const guia = JSON.parse(bloque.text) as Guia;
    guia.herramienta.docUrl = docUrl(guia.herramienta.nombre);
    return { guia, fuente: "ia" };
  } catch (error) {
    console.error("[generarGuia] fallo, uso ejemplo:", error);
    return { guia: ejemploGuia(input), fuente: "ejemplo" };
  }
}

function ejemploGuia(input: GuiaInput): Guia {
  const tema = input.pregunta?.trim() || "usar IA en tu negocio";
  return {
    titulo: "Crea contenido para redes con IA",
    resumen: `Una forma rápida de avanzar en "${tema}" sin gastar horas ni dinero.`,
    herramienta: {
      nombre: "ChatGPT",
      porQue:
        "Es versátil y fácil de empezar: te ayuda a redactar publicaciones, ideas y respuestas en minutos.",
      docUrl: "https://chatgpt.com",
    },
    pasos: [
      "Abre la herramienta y crea una cuenta gratuita.",
      "Escribe quién es tu cliente y qué vendes, en una frase.",
      "Pídele 5 ideas de publicaciones para tu negocio esta semana.",
      "Elige una, pídele que la escriba lista para publicar y ajústala con tu voz.",
      "Publícala y repite el proceso cada semana.",
    ],
    ejemploPrompt:
      "Actúa como experto en marketing para pequeños negocios. Mi negocio: [describe tu negocio y tu cliente]. Dame 5 ideas de publicaciones para Instagram de esta semana, con el texto listo para publicar y una llamada a la acción. Tono cercano y claro.",
    siguientePaso:
      "Cuando ya te sientas cómodo, pídele un calendario de contenido para todo el mes.",
  };
}
