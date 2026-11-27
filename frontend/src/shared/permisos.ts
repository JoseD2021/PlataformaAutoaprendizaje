export const PERMISOS = [
  { valor: 'users:create', etiqueta: 'Crear usuarios', grupo: 'Usuarios y roles' },
  { valor: 'users:read', etiqueta: 'Ver usuarios', grupo: 'Usuarios y roles' },
  { valor: 'users:update-role', etiqueta: 'Cambiar roles de usuarios', grupo: 'Usuarios y roles' },
  { valor: 'users:delete', etiqueta: 'Eliminar usuarios', grupo: 'Usuarios y roles' },
  { valor: 'roles:read', etiqueta: 'Ver roles', grupo: 'Usuarios y roles' },
  { valor: 'roles:create', etiqueta: 'Crear roles', grupo: 'Usuarios y roles' },
  { valor: 'roles:update-permissions', etiqueta: 'Cambiar permisos de roles', grupo: 'Usuarios y roles' },
  { valor: 'roles:delete', etiqueta: 'Eliminar roles', grupo: 'Usuarios y roles' },
  { valor: 'categories:create', etiqueta: 'Crear categorías', grupo: 'Categorías y guías' },
  { valor: 'categories:manage', etiqueta: 'Gestionar categorías', grupo: 'Categorías y guías' },
  { valor: 'guides:create', etiqueta: 'Crear guías', grupo: 'Categorías y guías' },
  { valor: 'guides:manage', etiqueta: 'Gestionar guías', grupo: 'Categorías y guías' },
  { valor: 'favorites:manage', etiqueta: 'Gestionar favoritos', grupo: 'Favoritos, sala y privacidad' },
  { valor: 'room-info:manage', etiqueta: 'Gestionar horario y normas', grupo: 'Favoritos, sala y privacidad' },
  { valor: 'privacy-terms:manage', etiqueta: 'Gestionar aviso de privacidad', grupo: 'Favoritos, sala y privacidad' },
  { valor: 'sessions:read-online', etiqueta: 'Ver sesiones en línea', grupo: 'Funciones previstas' },
  { valor: 'help-requests:read', etiqueta: 'Ver solicitudes de ayuda', grupo: 'Funciones previstas' },
  { valor: 'help-requests:create', etiqueta: 'Enviar solicitudes de ayuda', grupo: 'Funciones previstas' },
  { valor: 'help-requests:manage', etiqueta: 'Atender solicitudes de ayuda', grupo: 'Funciones previstas' },
  { valor: 'doubts:manage', etiqueta: 'Gestionar dudas sin guía', grupo: 'Funciones previstas' },
] as const

export type Permiso = (typeof PERMISOS)[number]['valor']

export const RANGO_MINIMO_POR_PERMISO: Record<Permiso, number> = {
  'users:create': 30,
  'users:read': 20,
  'users:update-role': 30,
  'users:delete': 30,
  'roles:read': 20,
  'roles:create': 30,
  'roles:update-permissions': 30,
  'roles:delete': 30,
  'categories:create': 20,
  'categories:manage': 20,
  'guides:create': 20,
  'guides:manage': 20,
  'favorites:manage': 10,
  'room-info:manage': 20,
  'privacy-terms:manage': 20,
  'sessions:read-online': 20,
  'help-requests:read': 20,
  'help-requests:create': 10,
  'help-requests:manage': 20,
  'doubts:manage': 20,
}

export const PERMISOS_GESTION: Permiso[] = [
  'guides:create',
  'guides:manage',
  'categories:create',
  'categories:manage',
]

export const PERMISOS_USUARIOS: Permiso[] = [
  'users:create',
  'users:read',
  'users:update-role',
  'users:delete',
]

export const PERMISOS_ADMINISTRACION: Permiso[] = [
  ...PERMISOS_USUARIOS,
  ...PERMISOS_GESTION,
  'roles:read',
  'room-info:manage',
  'privacy-terms:manage',
  'doubts:manage',
]

interface ConPermisos {
  permisos?: readonly Permiso[]
}

export function tienePermiso(usuario: ConPermisos | null | undefined, permiso: Permiso): boolean {
  return Boolean(usuario?.permisos?.includes(permiso))
}

export function tieneAlgunPermiso(
  usuario: ConPermisos | null | undefined,
  permisos: readonly Permiso[],
): boolean {
  return permisos.some((permiso) => tienePermiso(usuario, permiso))
}

export function tieneTodosLosPermisos(
  usuario: ConPermisos | null | undefined,
  permisos: readonly Permiso[],
): boolean {
  return permisos.every((permiso) => tienePermiso(usuario, permiso))
}

export function permisosPorRango(rango: number): Permiso[] {
  return PERMISOS.filter((permiso) => rango >= RANGO_MINIMO_POR_PERMISO[permiso.valor]).map(
    (permiso) => permiso.valor,
  )
}

export function rutaPrincipalDeGestion(usuario: ConPermisos | null | undefined): string {
  if (!tieneAlgunPermiso(usuario, PERMISOS_ADMINISTRACION)) return '/'
  if (tieneAlgunPermiso(usuario, PERMISOS_GESTION)) return '/gestion'
  if (tieneAlgunPermiso(usuario, PERMISOS_USUARIOS)) return '/admin'
  if (tienePermiso(usuario, 'roles:read')) return '/roles'
  if (tienePermiso(usuario, 'room-info:manage')) return '/horario'
  if (tienePermiso(usuario, 'privacy-terms:manage')) return '/privacidad'
  if (tienePermiso(usuario, 'doubts:manage')) return '/dudas'
  return '/'
}
