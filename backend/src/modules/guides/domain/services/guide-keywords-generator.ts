import { SPANISH_STOPWORDS } from '../constants/stopwords';

// Grupos de palabras que la gente usa como equivalentes en la sala de internet.
// Si el título, la etiqueta o la categoría contienen una, se agregan todas.
const SYNONYM_GROUPS: string[][] = [
  ['enviar', 'mandar', 'compartir', 'adjuntar', 'remitir'],
  ['archivo', 'archivos', 'adjunto', 'documento', 'documentos', 'foto', 'fotos', 'fotografia', 'fotografias', 'imagen', 'imagenes'],
  ['correo', 'email', 'mail', 'gmail', 'outlook'],
  ['imprimir', 'impresion', 'impresora', 'copia', 'copias', 'fotocopia'],
  ['tramite', 'tramites', 'gestion', 'diligencia', 'recibo'],
  ['buscar', 'busqueda', 'encontrar', 'google', 'navegar', 'internet'],
  ['guardar', 'descargar', 'bajar', 'almacenar'],
  ['abrir', 'entrar', 'ingresar', 'acceder', 'iniciar'],
  ['contrasena', 'clave', 'password', 'seguridad'],
  ['redes', 'facebook', 'whatsapp', 'instagram'],
];

export interface GuideKeywordSource {
  title: string;
  tag?: string | null;
  /** Keywords escritos a mano por el personal (opcional). */
  manualKeywords?: string;
}

function toWords(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !SPANISH_STOPWORDS.has(w));
}

export function generateGuideKeywords(source: GuideKeywordSource): string {
  const result = new Set<string>(toWords(source.manualKeywords ?? ''));

  const base = [
    ...toWords(source.title),
    ...toWords(source.tag ?? ''),
  ];

  for (const word of base) {
    result.add(word);
    for (const group of SYNONYM_GROUPS) {
      if (group.includes(word)) group.forEach((w) => result.add(w));
    }
  }

  return [...result].join(' ');
}