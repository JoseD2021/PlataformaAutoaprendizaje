import { InvalidGuideError } from '../errors/guide.errors';

const MAX_SLUG_LENGTH = 80;

export function slugFromTitle(title: string): string {
  const slug = (title ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '');

  if (!slug) {
    throw new InvalidGuideError(
      'El título debe contener letras o números para generar el identificador de la guía',
    );
  }

  return slug;
}