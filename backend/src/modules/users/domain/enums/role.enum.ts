/**
 * Roles base de la plataforma.
 *
 * Los roles personalizados se almacenan como identificadores de texto y se
 * administran desde la API. Estas constantes representan los roles que el
 * sistema necesita conocer de forma explícita.
 */
export const Role = {
  ADMINISTRADOR: 'administrador',
  PERSONAL_CLENA: 'personal_clena',
  USUARIO: 'usuario',
} as const;

export type Role = string;

/**
 * Roles que el sistema necesita para funcionar y que no se pueden eliminar.
 */
export const RESERVED_ROLES: Role[] = [Role.ADMINISTRADOR, Role.USUARIO];
