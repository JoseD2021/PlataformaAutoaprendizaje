/**
 * Identificador válido para un rol: minúsculas, números, guiones y guiones
 * bajos. Debe comenzar con una letra y tener como máximo 32 caracteres.
 */
export const ROLE_SLUG_PATTERN = /^[a-z][a-z0-9_-]{0,31}$/;
