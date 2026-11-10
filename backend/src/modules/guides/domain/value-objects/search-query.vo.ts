import { InvalidSearchQueryError } from '../errors/guide.errors';

const STOPWORDS = new Set([
  'a', 'al', 'como', 'con', 'de', 'del', 'el', 'en', 'la', 'las', 'lo', 'los',
  'mi', 'me', 'para', 'por', 'que', 'quiero', 'un', 'una', 'unos', 'unas', 'y',
]);

const MAX_TOKENS = 8;
const MAX_LENGTH = 100;

export class SearchQuery {
  private constructor(
    readonly raw: string,
    readonly tokens: string[],
  ) {}

  static create(input: string): SearchQuery {
    const raw = (input ?? '').trim();
    if (raw.length < 2) {
      throw new InvalidSearchQueryError('La búsqueda debe tener al menos 2 caracteres');
    }
    if (raw.length > MAX_LENGTH) {
      throw new InvalidSearchQueryError(`La búsqueda no puede superar ${MAX_LENGTH} caracteres`);
    }

    const words = raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2);

    const meaningful = words.filter((w) => !STOPWORDS.has(w));
    const tokens = [...new Set(meaningful.length > 0 ? meaningful : words)].slice(0, MAX_TOKENS);

    if (tokens.length === 0) {
      throw new InvalidSearchQueryError('La búsqueda no contiene palabras válidas');
    }
    return new SearchQuery(raw, tokens);
  }
}