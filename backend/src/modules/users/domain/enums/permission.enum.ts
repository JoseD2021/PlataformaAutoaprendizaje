/**
 * Catálogo de permisos atómicos.
 *
 * Las operaciones de categorías, guías, favoritos, ayuda y sesiones en línea
 * se implementarán en módulos posteriores; sus permisos ya quedan definidos
 * para que el administrador pueda preparar los roles desde ahora.
 */
export enum Permission {
  USERS_CREATE = 'users:create',
  USERS_READ = 'users:read',
  USERS_UPDATE_ROLE = 'users:update-role',
  USERS_DELETE = 'users:delete',

  ROLES_READ = 'roles:read',
  ROLES_CREATE = 'roles:create',
  ROLES_DELETE = 'roles:delete',
  ROLES_UPDATE_PERMISSIONS = 'roles:update-permissions',

  CATEGORIES_CREATE = 'categories:create',
  CATEGORIES_MANAGE = 'categories:manage',
  GUIDES_CREATE = 'guides:create',
  GUIDES_MANAGE = 'guides:manage',

  SESSIONS_READ_ONLINE = 'sessions:read-online',
  HELP_REQUESTS_READ = 'help-requests:read',
  HELP_REQUESTS_CREATE = 'help-requests:create',
  FAVORITES_MANAGE = 'favorites:manage',

  ROOM_INFO_MANAGE = 'room-info:manage',
}

export const ALL_PERMISSIONS: Permission[] = Object.values(Permission);
