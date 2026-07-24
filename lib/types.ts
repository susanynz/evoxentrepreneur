// Tipos compartidos y esquema de salida estructurada para el motor de IA.
// El esquema JSON respeta los límites de structured outputs de Claude:
// todos los objetos llevan additionalProperties:false y required completo,
// sin restricciones de longitud ni numéricas.

// La etapa es lo PRIMERO que elige el emprendedor y calibra todo el análisis.
export type Etapa = "idea" | "iniciado" | "consolidado";
export type Alcance = "local" | "nacional" | "online" | "internacional";
export type Objetivo =
  | "validar"
  | "primeros-clientes"
  | "aumentar-ventas"
  | "marca-presencia"
  | "escalar";
export type NivelIA = "nunca" | "basico" | "seguido" | "integrada";

// Entrada del estudio: preguntas objetivas y específicas, nivel analista de
// negocio + posicionamiento digital.
export interface IdeaInput {
  etapa: Etapa;
  // Bloque 1 — validar y diferenciar
  producto: string;
  problema: string;
  cliente: string;
  diferenciador: string;
  competencia: string;
  // Bloque 2 — situación
  modelo: string;
  alcance: Alcance;
  ubicacion: string;
  recursos: string;
  // Bloque 3 — presencia digital y meta
  presenciaDigital: string[];
  objetivo: Objetivo;
  nivelIA: NivelIA;
}

export type NivelVeredicto = "adelante" | "ajustar" | "replantear";
export type Severidad = "alta" | "media" | "baja";

export interface Analisis {
  veredicto: {
    puntuacion: number; // 0-100
    nivel: NivelVeredicto;
    resumen: string;
  };
  fortalezas: { titulo: string; detalle: string }[];
  // El "abogado del diablo constructivo": cada hueco viene con su "cómo sí".
  puntosDebiles: {
    riesgo: string;
    severidad: Severidad;
    porQueImporta: string;
    comoSuperarlo: string;
  }[];
  ideaPulida: {
    propuestaValor: string;
    clienteIdeal: string;
    diferenciador: string;
    modeloIngresos: string;
  };
  planEjecucion: {
    fase: string;
    objetivo: string;
    pasos: string[];
    metrica: string;
  }[];
  posicionamientoDigital: {
    mensajeClave: string;
    publicoEnPalabras: string;
    canales: { canal: string; porQue: string; primeraAccion: string }[];
    primeros30Dias: string[];
  };
  identidadVisual: {
    nombresSugeridos: string[];
    tagline: string;
    personalidad: string[];
    paleta: { nombre: string; hex: string; uso: string }[];
    tipografia: { titulos: string; cuerpo: string; nota: string };
    logo: string;
    imagenYTono: string;
  };
}

export interface AnalisisRespuesta {
  analisis: Analisis;
  fuente: "ia" | "ejemplo"; // "ejemplo" = sin API key o fallback por error
}

// Esquema JSON para output_config.format (json_schema) de la API de Claude.
export const analisisJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    veredicto: {
      type: "object",
      additionalProperties: false,
      properties: {
        puntuacion: {
          type: "integer",
          description:
            "Viabilidad global de 0 a 100, considerando qué tan ejecutable es la idea con el contexto dado (no solo si es buena idea).",
        },
        nivel: {
          type: "string",
          enum: ["adelante", "ajustar", "replantear"],
          description:
            "adelante = ejecutable ya con ajustes menores; ajustar = tiene potencial pero necesita cambios claros; replantear = el núcleo necesita repensarse.",
        },
        resumen: {
          type: "string",
          description:
            "2-3 frases honestas pero orientadas a la acción. Nada de relleno motivacional.",
        },
      },
      required: ["puntuacion", "nivel", "resumen"],
    },
    fortalezas: {
      type: "array",
      description: "Lo que realmente juega a favor. Específico, no genérico.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          titulo: { type: "string" },
          detalle: { type: "string" },
        },
        required: ["titulo", "detalle"],
      },
    },
    puntosDebiles: {
      type: "array",
      description:
        "El abogado del diablo constructivo. Cada hueco o riesgo REAL, emparejado siempre con el 'cómo sí' para superarlo. Nunca un 'no' sin salida.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          riesgo: {
            type: "string",
            description: "El hueco, supuesto frágil o riesgo concreto.",
          },
          severidad: { type: "string", enum: ["alta", "media", "baja"] },
          porQueImporta: {
            type: "string",
            description: "Por qué este punto podría frenar la ejecución.",
          },
          comoSuperarlo: {
            type: "string",
            description:
              "El 'cómo sí': la acción concreta para convertir el riesgo en ventaja o mitigarlo. Este es el valor central.",
          },
        },
        required: ["riesgo", "severidad", "porQueImporta", "comoSuperarlo"],
      },
    },
    ideaPulida: {
      type: "object",
      additionalProperties: false,
      properties: {
        propuestaValor: {
          type: "string",
          description: "Propuesta de valor afinada en una frase clara.",
        },
        clienteIdeal: {
          type: "string",
          description: "El segmento inicial más afilado por donde empezar.",
        },
        diferenciador: {
          type: "string",
          description: "Qué lo hace difícil de copiar o distinto de lo existente.",
        },
        modeloIngresos: {
          type: "string",
          description: "Cómo gana dinero, planteado de forma realista.",
        },
      },
      required: ["propuestaValor", "clienteIdeal", "diferenciador", "modeloIngresos"],
    },
    planEjecucion: {
      type: "array",
      description:
        "Plan por fases, concreto y adaptado al contexto (etapa, recursos, mercado).",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          fase: {
            type: "string",
            description: "Nombre y horizonte, p.ej. 'Validación (semanas 1-3)'.",
          },
          objetivo: { type: "string" },
          pasos: {
            type: "array",
            items: { type: "string" },
            description: "Pasos accionables y específicos.",
          },
          metrica: {
            type: "string",
            description: "La señal concreta de que la fase salió bien.",
          },
        },
        required: ["fase", "objetivo", "pasos", "metrica"],
      },
    },
    posicionamientoDigital: {
      type: "object",
      additionalProperties: false,
      properties: {
        mensajeClave: {
          type: "string",
          description: "El mensaje central que debe transmitir online.",
        },
        publicoEnPalabras: {
          type: "string",
          description:
            "Cómo describe el propio cliente su problema (útil para SEO, anuncios y copys).",
        },
        canales: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              canal: { type: "string" },
              porQue: {
                type: "string",
                description: "Por qué ESE canal para ESTE negocio.",
              },
              primeraAccion: {
                type: "string",
                description: "La primera acción concreta en ese canal.",
              },
            },
            required: ["canal", "porQue", "primeraAccion"],
          },
        },
        primeros30Dias: {
          type: "array",
          items: { type: "string" },
          description: "Plan de arranque digital de los primeros 30 días.",
        },
      },
      required: ["mensajeClave", "publicoEnPalabras", "canales", "primeros30Dias"],
    },
    identidadVisual: {
      type: "object",
      additionalProperties: false,
      description:
        "Propuesta de identidad de marca adaptada al negocio y su etapa. Si ya tiene marca (etapa avanzada), afínala; si apenas es idea, propónla desde cero.",
      properties: {
        nombresSugeridos: {
          type: "array",
          items: { type: "string" },
          description:
            "2-3 nombres de marca memorables y disponibles (o validación del actual). Evita nombres genéricos.",
        },
        tagline: {
          type: "string",
          description: "Una frase corta que capture la promesa de la marca.",
        },
        personalidad: {
          type: "array",
          items: { type: "string" },
          description: "3-4 rasgos de personalidad de marca (p.ej. 'cercana', 'confiable').",
        },
        paleta: {
          type: "array",
          description: "4-5 colores con propósito, coherentes con el rubro y el público.",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              nombre: { type: "string", description: "Nombre del color, p.ej. 'Verde bosque'." },
              hex: {
                type: "string",
                description: "Código hexadecimal exacto, formato #RRGGBB (p.ej. #0E7C5A).",
              },
              uso: { type: "string", description: "Para qué se usa (fondo, acento, texto...)." },
            },
            required: ["nombre", "hex", "uso"],
          },
        },
        tipografia: {
          type: "object",
          additionalProperties: false,
          properties: {
            titulos: {
              type: "string",
              description: "Fuente recomendada para títulos (idealmente de Google Fonts).",
            },
            cuerpo: {
              type: "string",
              description: "Fuente recomendada para texto de cuerpo (Google Fonts).",
            },
            nota: { type: "string", description: "Por qué esa combinación encaja con la marca." },
          },
          required: ["titulos", "cuerpo", "nota"],
        },
        logo: {
          type: "string",
          description:
            "Concepto de logo o símbolo: qué representar y cómo, en términos que un diseñador pueda ejecutar.",
        },
        imagenYTono: {
          type: "string",
          description:
            "Guía de estilo visual: tipo de imágenes, tono y qué evitar para verse coherente.",
        },
      },
      required: [
        "nombresSugeridos",
        "tagline",
        "personalidad",
        "paleta",
        "tipografia",
        "logo",
        "imagenYTono",
      ],
    },
  },
  required: [
    "veredicto",
    "fortalezas",
    "puntosDebiles",
    "ideaPulida",
    "planEjecucion",
    "posicionamientoDigital",
    "identidadVisual",
  ],
} as const;
