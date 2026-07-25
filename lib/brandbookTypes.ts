// Tipos y esquema del brand book (formato tipo póster profesional).
// Client-safe: no importa nada del servidor.

export interface BrandBookInput {
  contexto: string; // descripción del negocio (de su análisis o escrita)
  nombre?: string; // nombre de marca si ya lo tiene
}

export interface BrandBook {
  marca: { nombre: string; tagline: string; descripcion: string };
  esencia: {
    queHago: string;
    paraQuien: string;
    queProblema: string;
    queTransformacion: string;
  };
  mision: string;
  vision: string;
  proposito: string;
  personalidad: string[];
  emocionesProvoca: string[];
  emocionesEvita: string[];
  universoVisual: {
    materiales: string[];
    texturas: string;
    estilo: string;
    sensacion: string;
  };
  paleta: { nombre: string; hex: string; uso: string }[];
  tipografias: { titulos: string; subtitulos: string; cuerpo: string; nota: string };
  estiloFotografico: string[];
  logo: { concepto: string; vectorizar: string; versionesColor: string };
  elementosRecurrentes: string[];
  elementosProhibidos: string[];
  reglaInnegociable: string;
  tonoComunicacion: string;
  propuestaValor: string;
  clienteIdeal: string;
  beneficios: string[];
  promesa: string;
  hashtags: string[];
}

export interface BrandBookRespuesta {
  brandbook: BrandBook;
  fuente: "ia" | "ejemplo";
}

const str = (description: string) => ({ type: "string", description });
const arr = (description: string) => ({
  type: "array",
  items: { type: "string" },
  description,
});

export const brandbookJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marca: {
      type: "object",
      additionalProperties: false,
      properties: {
        nombre: str("Nombre de la marca (usa el que tiene o propón uno memorable)."),
        tagline: str("Frase corta que capture la promesa de la marca."),
        descripcion: str("Una línea de qué es la marca y para quién."),
      },
      required: ["nombre", "tagline", "descripcion"],
    },
    esencia: {
      type: "object",
      additionalProperties: false,
      properties: {
        queHago: str("¿Qué hace la marca?"),
        paraQuien: str("¿Para quién?"),
        queProblema: str("¿Qué problema resuelve?"),
        queTransformacion: str("¿Qué transformación promete?"),
      },
      required: ["queHago", "paraQuien", "queProblema", "queTransformacion"],
    },
    mision: str("Misión de la marca, en una frase clara."),
    vision: str("Visión: a dónde quiere llegar."),
    proposito: str("Propósito: el porqué más profundo."),
    personalidad: arr("3-6 rasgos de personalidad de marca (p.ej. 'cercana', 'audaz')."),
    emocionesProvoca: arr("3-4 emociones que la marca quiere provocar."),
    emocionesEvita: arr("3-4 emociones o percepciones que debe evitar."),
    universoVisual: {
      type: "object",
      additionalProperties: false,
      properties: {
        materiales: arr("Materiales o elementos que evocan la marca."),
        texturas: str("Tipo de texturas y acabados."),
        estilo: str("Estilo visual general (p.ej. 'editorial, minimalista')."),
        sensacion: str("La sensación que transmite."),
      },
      required: ["materiales", "texturas", "estilo", "sensacion"],
    },
    paleta: {
      type: "array",
      description: "4-5 colores con propósito, coherentes con el rubro y el público.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          nombre: str("Nombre del color, p.ej. 'Verde bosque'."),
          hex: str("Código hexadecimal exacto, formato #RRGGBB."),
          uso: str("Para qué se usa (fondo, acento, texto...)."),
        },
        required: ["nombre", "hex", "uso"],
      },
    },
    tipografias: {
      type: "object",
      additionalProperties: false,
      properties: {
        titulos: str("Fuente para títulos (Google Fonts)."),
        subtitulos: str("Fuente para subtítulos (Google Fonts)."),
        cuerpo: str("Fuente para cuerpo de texto (Google Fonts)."),
        nota: str("Por qué esa combinación encaja con la marca."),
      },
      required: ["titulos", "subtitulos", "cuerpo", "nota"],
    },
    estiloFotografico: arr("5-7 rasgos del estilo fotográfico (luz, tono, composición...)."),
    logo: {
      type: "object",
      additionalProperties: false,
      properties: {
        concepto: str("Concepto del logo: qué representar y cómo, para un buen punto de partida."),
        vectorizar: str("Cómo vectorizarlo (para que escale sin pixelearse) — pasos simples."),
        versionesColor: str("Qué versiones de color tener (full color, monocromo, sobre fondo oscuro/claro)."),
      },
      required: ["concepto", "vectorizar", "versionesColor"],
    },
    elementosRecurrentes: arr("Elementos gráficos que se repiten en la marca."),
    elementosProhibidos: arr("Qué NO hacer nunca visualmente."),
    reglaInnegociable: str("La regla visual innegociable de la marca."),
    tonoComunicacion: str("Cómo habla la marca (tono de voz)."),
    propuestaValor: str("Propuesta de valor en una frase."),
    clienteIdeal: str("Descripción del cliente ideal."),
    beneficios: arr("4-5 beneficios clave que entrega la marca."),
    promesa: str("La promesa de marca."),
    hashtags: arr("4-6 hashtags de marca (con #)."),
  },
  required: [
    "marca",
    "esencia",
    "mision",
    "vision",
    "proposito",
    "personalidad",
    "emocionesProvoca",
    "emocionesEvita",
    "universoVisual",
    "paleta",
    "tipografias",
    "estiloFotografico",
    "logo",
    "elementosRecurrentes",
    "elementosProhibidos",
    "reglaInnegociable",
    "tonoComunicacion",
    "propuestaValor",
    "clienteIdeal",
    "beneficios",
    "promesa",
    "hashtags",
  ],
} as const;
