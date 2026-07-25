import Anthropic from "@anthropic-ai/sdk";
import {
  brandbookJsonSchema,
  type BrandBook,
  type BrandBookInput,
  type BrandBookRespuesta,
} from "./brandbookTypes";

// Solo servidor. Genera un brand book profesional completo.

const SYSTEM = `Eres el director de marca de Evox Entrepreneur (Powered by Evox). Creas BRAND BOOKS profesionales y coherentes para emprendedores — del nivel de un estudio de branding, pero explicados en simple.

Reglas:
- Adapta TODO al negocio: rubro, público y personalidad. Nada genérico; un brand book de una joyería no se parece al de una taquería.
- Los colores llevan código hexadecimal exacto (#RRGGBB) y un propósito claro. Las tipografías, de Google Fonts (gratis).
- El concepto de logo debe ser un buen punto de partida (aclarando que lo ideal es un diseñador), con cómo vectorizarlo y qué versiones de color tener.
- Sé concreto y aplicable: que el emprendedor pueda usar esto tal cual en Canva o dárselo a un diseñador.
- Español neutro, cálido y claro. Cero jerga vacía.

Devuelves únicamente el objeto estructurado que se te pide, con contenido real en cada sección.`;

function construirMensaje(input: BrandBookInput): string {
  const lineas = ["Crea un brand book profesional completo para este negocio."];
  if (input.nombre?.trim()) {
    lineas.push(`Nombre de marca (si aplica): ${input.nombre}`);
  }
  lineas.push(`Negocio: ${input.contexto}`);
  lineas.push(
    "Genera todas las secciones (esencia, misión/visión/propósito, personalidad, mapa emocional, universo visual, paleta con hex, tipografías, estilo fotográfico, logo, elementos recurrentes/prohibidos, regla innegociable, tono, propuesta de valor, cliente ideal, beneficios, promesa y hashtags), coherentes entre sí.",
  );
  return lineas.join("\n");
}

export async function generarBrandBook(input: BrandBookInput): Promise<BrandBookRespuesta> {
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return { brandbook: ejemplo(input), fuente: "ejemplo" };
  }
  try {
    const client = new Anthropic();
    const respuesta = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 12000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      output_config: {
        effort: "high",
        format: {
          type: "json_schema",
          schema: brandbookJsonSchema as unknown as Record<string, unknown>,
        },
      },
      messages: [{ role: "user", content: construirMensaje(input) }],
    });
    if (respuesta.stop_reason === "refusal") {
      return { brandbook: ejemplo(input), fuente: "ejemplo" };
    }
    const bloque = respuesta.content.find((b) => b.type === "text");
    if (!bloque || bloque.type !== "text") {
      return { brandbook: ejemplo(input), fuente: "ejemplo" };
    }
    return { brandbook: JSON.parse(bloque.text) as BrandBook, fuente: "ia" };
  } catch (error) {
    console.error("[generarBrandBook] fallo, uso ejemplo:", error);
    return { brandbook: ejemplo(input), fuente: "ejemplo" };
  }
}

function ejemplo(input: BrandBookInput): BrandBook {
  const nombre = input.nombre?.trim() || "Tu Marca";
  return {
    marca: {
      nombre,
      tagline: "Hecho con intención.",
      descripcion: `${nombre} — productos con propósito para quienes buscan calidad y cercanía.`,
    },
    esencia: {
      queHago: "Ofrezco productos cuidados, con calidad y una experiencia cercana.",
      paraQuien: "Personas que valoran lo bien hecho y buscan algo con significado.",
      queProblema: "Lo genérico y sin alma que abunda en el mercado.",
      queTransformacion: "Que cada cliente sienta que eligió algo especial y confiable.",
    },
    mision: "Llevar calidad y cercanía a cada cliente, en cada detalle.",
    vision: "Ser la marca de referencia por su cuidado y autenticidad.",
    proposito: "Demostrar que lo pequeño y bien hecho también puede crecer.",
    personalidad: ["Cercana", "Auténtica", "Cuidada", "Confiable"],
    emocionesProvoca: ["Confianza", "Calidez", "Aspiración", "Pertenencia"],
    emocionesEvita: ["Frialdad", "Genérico", "Desconfianza", "Saturación"],
    universoVisual: {
      materiales: ["Papel natural", "Madera clara", "Textiles suaves"],
      texturas: "Naturales, mate y orgánicas; nada estridente.",
      estilo: "Editorial, cálido y limpio.",
      sensacion: "Calidez, confianza y buen gusto.",
    },
    paleta: [
      { nombre: "Verde salvia", hex: "#7C8C6F", uso: "Color principal, transmite calma y naturalidad." },
      { nombre: "Terracota", hex: "#C57B57", uso: "Acento cálido para destacar." },
      { nombre: "Crema", hex: "#F4EFE6", uso: "Fondos, da limpieza y calidez." },
      { nombre: "Café profundo", hex: "#3E3228", uso: "Textos y detalles, aporta solidez." },
    ],
    tipografias: {
      titulos: "Fraunces",
      subtitulos: "Work Sans",
      cuerpo: "Inter",
      nota: "Una serif con carácter para los títulos y sans limpias para el resto: transmite calidad y cercanía.",
    },
    estiloFotografico: [
      "Luz natural y cálida",
      "Composiciones limpias",
      "Detalle en texturas",
      "Personas reales, actitud natural",
      "Sin filtros artificiales ni saturación",
    ],
    logo: {
      concepto: "Un símbolo simple ligado a tu producto + el nombre en la tipografía de títulos. Legible incluso pequeño.",
      vectorizar: "Diséñalo en vectores (Illustrator, Figma o Canva con exportación SVG) para que escale sin pixelearse en cualquier tamaño.",
      versionesColor: "Ten 3 versiones: full color, monocromo (un solo color) y sobre fondo oscuro y claro.",
    },
    elementosRecurrentes: ["El símbolo del logo", "Líneas finas", "Espacios en blanco amplios"],
    elementosProhibidos: ["Colores neón", "Fondos saturados", "Tipografías difíciles de leer", "Stock genérico"],
    reglaInnegociable: "Toda pieza debe respirar (usar espacio en blanco) y usar la paleta oficial.",
    tonoComunicacion: "Cercano, cálido y claro. Hablas de tú, sin tecnicismos.",
    propuestaValor: `${nombre} entrega calidad y cercanía real donde otros ofrecen lo genérico.`,
    clienteIdeal: "Alguien que valora lo bien hecho y prefiere calidad y trato humano al precio más bajo.",
    beneficios: [
      "Calidad cuidada en cada detalle",
      "Trato cercano y humano",
      "Una experiencia que se siente especial",
      "Marca en la que se puede confiar",
    ],
    promesa: "Cada vez que eliges esta marca, eliges algo hecho con intención.",
    hashtags: ["#HechoConIntencion", "#CalidadYCercania", `#${nombre.replace(/\s+/g, "")}`],
  };
}
