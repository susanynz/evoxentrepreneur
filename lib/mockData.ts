import type { Analisis, IdeaInput } from "./types";

// Análisis de ejemplo que se usa cuando no hay ANTHROPIC_API_KEY configurada
// (o si la llamada falla). Referencia ligeramente los datos del usuario para
// que el flujo se sienta real. La UI lo marca claramente como "ejemplo".
export function generarEjemplo(input: IdeaInput): Analisis {
  const cliente = input.cliente?.trim() || "tu cliente ideal";
  const idea = input.idea?.trim() || "tu idea";

  return {
    veredicto: {
      puntuacion: 68,
      nivel: "ajustar",
      resumen: `${capitalizar(idea)} resuelve un problema real y tienes por dónde empezar. El riesgo no es la idea en sí, sino enfocarla demasiado amplia al inicio: si afilas el primer segmento y validas que pagan, esto es totalmente ejecutable.`,
    },
    fortalezas: [
      {
        titulo: "Problema con dolor real",
        detalle: `El problema que describes lo vive ${cliente} de forma recurrente, no ocasional. Eso te da margen para cobrar en lugar de competir solo por precio.`,
      },
      {
        titulo: "Puedes arrancar ligero",
        detalle:
          "No necesitas construir todo para validar. Con una versión mínima puedes probar la disposición a pagar en semanas, no meses.",
      },
      {
        titulo: "Cercanía con el cliente",
        detalle:
          "Estás cerca del segmento que quieres servir, lo que te permite iterar rápido con retroalimentación directa.",
      },
    ],
    puntosDebiles: [
      {
        riesgo: "El segmento inicial está demasiado amplio",
        severidad: "alta",
        porQueImporta:
          "Hablarle a todos diluye el mensaje y encarece conseguir tus primeros clientes. Sin foco, cada peso de marketing rinde menos.",
        comoSuperarlo: `Elige un nicho específico dentro de ${cliente} para los primeros 90 días (por ejemplo, por ciudad, industria o tamaño). Domina ese nicho, consigue casos de éxito, y luego expandes.`,
      },
      {
        riesgo: "No está clara la disposición a pagar",
        severidad: "alta",
        porQueImporta:
          "Que a la gente le guste la idea no significa que pague. Muchos proyectos mueren aquí por no validarlo a tiempo.",
        comoSuperarlo:
          "Antes de construir más, haz 10 conversaciones de venta reales con una preventa o lista de espera con anticipo. Si 3 de 10 ponen dinero o dejan tarjeta, tienes señal. Si nadie, ajusta la oferta.",
      },
      {
        riesgo: "Diferenciación aún débil frente a alternativas",
        severidad: "media",
        porQueImporta:
          "Si el cliente puede resolverlo con algo que ya usa (aunque sea a medias), tu propuesta necesita una razón clara para cambiar.",
        comoSuperarlo:
          "Define un ángulo específico donde seas claramente mejor (rapidez, precio, especialización o experiencia) y ponlo al centro de tu mensaje, en vez de intentar ser bueno en todo.",
      },
    ],
    ideaPulida: {
      propuestaValor: `Ayudamos a ${cliente} a resolver su problema de forma más simple y confiable que las alternativas actuales.`,
      clienteIdeal: `Un subsegmento específico de ${cliente}: el que más sufre el problema y ya está buscando cómo resolverlo.`,
      diferenciador:
        "Especialización y cercanía: resuelves un problema concreto mejor que las soluciones genéricas del mercado.",
      modeloIngresos:
        "Empieza con un modelo simple y directo (pago por servicio o suscripción básica) que puedas cobrar desde el primer cliente, y sofisticas después.",
    },
    planEjecucion: [
      {
        fase: "Validación (semanas 1-3)",
        objetivo: "Confirmar que el cliente ideal paga por esto.",
        pasos: [
          "Escribe en una frase a quién le vendes y qué problema resuelves.",
          "Haz 10-15 conversaciones con clientes potenciales del nicho elegido.",
          "Ofrece una preventa, anticipo o lista de espera con compromiso real.",
        ],
        metrica: "Al menos 3 personas ponen dinero o un compromiso firme de compra.",
      },
      {
        fase: "Primeros clientes (semanas 4-8)",
        objetivo: "Entregar a los primeros clientes y pulir la oferta.",
        pasos: [
          "Entrega manualmente (sin automatizar) a tus primeros 3-5 clientes.",
          "Documenta qué funciona y qué se rompe en la entrega.",
          "Pide testimonios y un referido a cada cliente satisfecho.",
        ],
        metrica: "3-5 clientes atendidos y al menos 2 testimonios o referidos.",
      },
      {
        fase: "Tracción (meses 3-4)",
        objetivo: "Encontrar un canal repetible para conseguir clientes.",
        pasos: [
          "Concentra tu esfuerzo en 1-2 canales, no en todos a la vez.",
          "Mide cuánto te cuesta y cuánto tarda conseguir un cliente por canal.",
          "Duplica el canal que funcione y suelta el que no.",
        ],
        metrica: "Un canal que te trae clientes de forma predecible y rentable.",
      },
    ],
    posicionamientoDigital: {
      mensajeClave: `Para ${cliente} que están cansados del problema actual: una solución específica y confiable, sin complicaciones.`,
      publicoEnPalabras:
        "El cliente no busca tu categoría técnica; busca resolver su dolor. Usa sus palabras exactas (las que dice en las conversaciones) en tus textos y anuncios.",
      canales: [
        {
          canal: "Instagram / TikTok",
          porQue:
            "Tu cliente pasa tiempo ahí y el contenido corto muestra el 'antes y después' de tu solución sin costo de pauta al inicio.",
          primeraAccion:
            "Publica 3 veces por semana mostrando el problema y cómo lo resuelves, con ejemplos reales.",
        },
        {
          canal: "WhatsApp Business",
          porQue:
            "En Latinoamérica es donde se cierra la venta. Baja fricción y conversación directa.",
          primeraAccion:
            "Configura catálogo y respuestas rápidas; pon el enlace en todos tus perfiles.",
        },
        {
          canal: "Comunidad / boca a boca",
          porQue:
            "Tus primeros clientes son tu mejor canal: un referido convierte mucho mejor que un anuncio.",
          primeraAccion:
            "Crea un incentivo simple para que cada cliente feliz te refiera a uno más.",
        },
      ],
      primeros30Dias: [
        "Semana 1: define el mensaje y arma perfiles en 1-2 canales.",
        "Semana 2: publica contenido mostrando el problema y tu solución.",
        "Semana 3: activa conversaciones de venta y una oferta de lanzamiento.",
        "Semana 4: pide testimonios y referidos; mide qué canal trajo más interesados.",
      ],
    },
    identidadVisual: {
      nombresSugeridos: ["Lonchi", "Nutrikids", "Buen Bocado"],
      tagline: "Loncheras que sí se comen.",
      personalidad: ["Cercana", "Confiable", "Fresca", "Práctica"],
      paleta: [
        { nombre: "Verde fresco", hex: "#3DA35D", uso: "Color principal, transmite salud y frescura." },
        { nombre: "Naranja alegre", hex: "#F4A62A", uso: "Acento y botones de acción." },
        { nombre: "Crema suave", hex: "#FBF6EC", uso: "Fondos, da calidez y limpieza." },
        { nombre: "Azul profundo", hex: "#264653", uso: "Textos y detalles, aporta confianza." },
      ],
      tipografia: {
        titulos: "Poppins",
        cuerpo: "Nunito Sans",
        nota: "Ambas son redondeadas y amigables: transmiten cercanía sin perder legibilidad, ideal para una marca familiar.",
      },
      logo: "Una lonchera estilizada donde el cierre superior es una hoja verde. Simple, memorable y reconocible en tamaño pequeño (ícono de app).",
      imagenYTono:
        "Fotos reales de comida colorida y niños contentos, con luz natural. Evita stock genérico y tonos artificiales; que se vea casero y confiable.",
    },
  };
}

function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
