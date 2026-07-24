import type { Etapa } from "./types";

// La comunidad funciona como un BNI de incubadora: cada miembro declara lo que
// OFRECE (referencias, ayuda, experiencia) y lo que BUSCA. El valor está en el
// intercambio: te conectas con quien ofrece lo que necesitas y viceversa.

export interface Proyecto {
  id: string;
  nombre: string;
  emprendedor: string;
  categoria: string;
  etapa: Etapa;
  ubicacion: string;
  descripcion: string;
  ofrezco: string[];
  busco: string[];
  emoji: string;
  ownerId?: string; // id del usuario que lo creó (si tiene perfil)
}

// Clave de almacenamiento de los proyectos creados por el usuario.
export const STORAGE_KEY_PROYECTOS = "evox_proyectos_v1";

export const CATEGORIAS = [
  "Alimentos",
  "Tecnología",
  "Moda",
  "Educación",
  "Salud",
  "Servicios",
  "Agro",
  "Creativo",
] as const;

export const ETAPA_LABEL: Record<Etapa, string> = {
  idea: "Idea",
  prototipo: "Prototipo",
  vendiendo: "Vendiendo",
  escalando: "Escalando",
};

export const PROYECTOS_SEMILLA: Proyecto[] = [
  {
    id: "p1",
    nombre: "Masa Madre MX",
    emprendedor: "Lucía Fernández",
    categoria: "Alimentos",
    etapa: "vendiendo",
    ubicacion: "CDMX, México",
    descripcion:
      "Panadería artesanal de fermentación lenta con entrega a domicilio por suscripción semanal.",
    ofrezco: ["Contactos de proveedores de insumos", "Experiencia en logística de entregas", "Fotografía de producto"],
    busco: ["Ayuda con marketing en redes", "Un socio para empaques sostenibles"],
    emoji: "🥖",
  },
  {
    id: "p2",
    nombre: "Rutas Verdes",
    emprendedor: "Diego Herrera",
    categoria: "Tecnología",
    etapa: "prototipo",
    ubicacion: "Medellín, Colombia",
    descripcion:
      "App que optimiza rutas de reparto para pequeños negocios y reduce costos de combustible.",
    ofrezco: ["Desarrollo de MVP web/app", "Mentoría técnica", "Setup de analítica"],
    busco: ["Primeros negocios para piloto", "Feedback de repartidores"],
    emoji: "🗺️",
  },
  {
    id: "p3",
    nombre: "Hilo Nativo",
    emprendedor: "Camila Rojas",
    categoria: "Moda",
    etapa: "vendiendo",
    ubicacion: "Cusco, Perú",
    descripcion:
      "Moda sostenible tejida por artesanas andinas, con historia de origen en cada prenda.",
    ofrezco: ["Red de artesanas", "Conocimiento de comercio justo", "Contenido de storytelling"],
    busco: ["Canal de venta en EE.UU.", "Ayuda con e-commerce"],
    emoji: "🧶",
  },
  {
    id: "p4",
    nombre: "Aprende Haciendo",
    emprendedor: "Mateo Vargas",
    categoria: "Educación",
    etapa: "escalando",
    ubicacion: "Buenos Aires, Argentina",
    descripcion:
      "Cursos cortos y prácticos de oficios digitales para jóvenes sin acceso a educación formal.",
    ofrezco: ["Diseño instruccional", "Comunidad de +2.000 estudiantes", "Alianzas con ONGs"],
    busco: ["Patrocinadores", "Docentes de programación"],
    emoji: "🎓",
  },
  {
    id: "p5",
    nombre: "SaludCerca",
    emprendedor: "Valentina Cruz",
    categoria: "Salud",
    etapa: "prototipo",
    ubicacion: "Guadalajara, México",
    descripcion:
      "Plataforma que conecta a personas mayores con cuidadores verificados por horas.",
    ofrezco: ["Experiencia en verificación de perfiles", "Contactos en el sector salud"],
    busco: ["Asesoría legal", "Inversión ángel", "Desarrollo móvil"],
    emoji: "🩺",
  },
  {
    id: "p6",
    nombre: "Café de Altura",
    emprendedor: "Andrés Molina",
    categoria: "Agro",
    etapa: "vendiendo",
    ubicacion: "Chiapas, México",
    descripcion:
      "Café de especialidad directo del productor, con trazabilidad por lote y tueste bajo demanda.",
    ofrezco: ["Red de productores", "Conocimiento de exportación", "Muestras para cafeterías"],
    busco: ["Cafeterías aliadas", "Diseño de marca"],
    emoji: "☕",
  },
  {
    id: "p7",
    nombre: "Estudio Pixel",
    emprendedor: "Sofía Navarro",
    categoria: "Creativo",
    etapa: "vendiendo",
    ubicacion: "Santiago, Chile",
    descripcion:
      "Estudio de diseño y branding especializado en marcas de emprendedores en etapa temprana.",
    ofrezco: [
      "Branding e identidad",
      "Diseño de marca",
      "Manejo de redes sociales",
      "Mentoría de diseño",
    ],
    busco: ["Referencias de clientes", "Un desarrollador aliado"],
    emoji: "🎨",
  },
  {
    id: "p8",
    nombre: "FinClaro",
    emprendedor: "Tomás Reyes",
    categoria: "Servicios",
    etapa: "idea",
    ubicacion: "Bogotá, Colombia",
    descripcion:
      "Asesoría financiera simple y sin jerga para emprendedores que arrancan su primer negocio.",
    ofrezco: ["Asesoría financiera y fiscal", "Modelos de negocio", "Proyecciones"],
    busco: ["Primeros clientes", "Alianza con contadores"],
    emoji: "📊",
  },
];

// Coincidencias básicas: qué proyectos OFRECEN algo que este proyecto BUSCA.
// Es una demostración simple del mecanismo de referencias del BNI.
export function encontrarCoincidencias(
  proyecto: Proyecto,
  todos: Proyecto[],
): { proyecto: Proyecto; razon: string }[] {
  const resultados: { proyecto: Proyecto; razon: string }[] = [];
  for (const otro of todos) {
    if (otro.id === proyecto.id) continue;
    for (const necesidad of proyecto.busco) {
      const match = otro.ofrezco.find((oferta) => solapan(necesidad, oferta));
      if (match) {
        resultados.push({
          proyecto: otro,
          razon: `Ofrece "${match}" y tú buscas "${necesidad}".`,
        });
        break;
      }
    }
  }
  return resultados;
}

// Palabras vacías que no aportan significado a una coincidencia.
const STOPWORDS = new Set([
  "para",
  "con",
  "como",
  "pero",
  "por",
  "una",
  "uno",
  "unos",
  "unas",
  "los",
  "las",
  "del",
  "que",
  "mas",
  "muy",
  "sin",
  "sobre",
  "entre",
  "desde",
  "hasta",
  "este",
  "esta",
  "esto",
  "esos",
  "esas",
  "tus",
  "sus",
  "mis",
  "ayuda",
]);

function solapan(a: string, b: string): boolean {
  const palabras = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  const setB = new Set(palabras(b));
  return palabras(a).some((w) => setB.has(w));
}
