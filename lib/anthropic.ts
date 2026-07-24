import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, construirMensaje } from "./prompts";
import { generarEjemplo } from "./mockData";
import { analisisJsonSchema, type Analisis, type AnalisisRespuesta, type IdeaInput } from "./types";

// Solo se usa en el servidor (route handler). La API key vive en el entorno
// del servidor (variable ANTHROPIC_API_KEY), nunca llega al navegador.

function hayApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export async function analizarIdea(input: IdeaInput): Promise<AnalisisRespuesta> {
  // Sin credenciales -> flujo con respuesta de ejemplo.
  if (!hayApiKey()) {
    return { analisis: generarEjemplo(input), fuente: "ejemplo" };
  }

  try {
    const client = new Anthropic();

    const respuesta = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      output_config: {
        // Si en Hostinger las peticiones se cortan por timeout, baja a "medium".
        effort: "high",
        format: {
          type: "json_schema",
          schema: analisisJsonSchema as unknown as Record<string, unknown>,
        },
      },
      messages: [{ role: "user", content: construirMensaje(input) }],
    });

    if (respuesta.stop_reason === "refusal") {
      return { analisis: generarEjemplo(input), fuente: "ejemplo" };
    }

    const bloque = respuesta.content.find((b) => b.type === "text");
    if (!bloque || bloque.type !== "text") {
      return { analisis: generarEjemplo(input), fuente: "ejemplo" };
    }

    const analisis = JSON.parse(bloque.text) as Analisis;
    return { analisis, fuente: "ia" };
  } catch (error) {
    console.error("[analizarIdea] fallo la llamada a Claude, uso ejemplo:", error);
    return { analisis: generarEjemplo(input), fuente: "ejemplo" };
  }
}
