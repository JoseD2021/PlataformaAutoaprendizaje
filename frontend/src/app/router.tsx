import { createBrowserRouter } from 'react-router-dom'
import { InicioPage } from '../features/guias/presentation/pages/InicioPage'
import { BusquedaPage } from '../features/guias/presentation/pages/BusquedaPage'
import { GuiasDeCategoriaPage } from '../features/guias/presentation/pages/GuiasDeCategoriaPage'
import { GuiaDetallePage } from '../features/guias/presentation/pages/GuiaDetallePage'
import { LoginPage } from '../features/auth/presentation/pages/LoginPage'
import { RegistroPage } from '../features/auth/presentation/pages/RegistroPage'
import { PerfilPage } from '../features/auth/presentation/pages/PerfilPage'
import { AdminPanelPage } from '../features/admin/presentation/pages/AdminPanelPage'
import { RolesPage } from '../features/roles/presentation/pages/RolesPage'
import { FavoritosPage } from '../features/favoritos/presentation/pages/FavoritosPage'
import { GestionPage } from '../features/gestion/presentation/pages/GestionPage'
import { GuiaFormPage } from '../features/gestion/presentation/pages/GuiaFormPage'
import { RutaProtegida } from '../features/gestion/presentation/components/RutaProtegida'
import { HorarioSalaPage } from '../features/sala/presentation/pages/HorarioSalaPage'
import { PrivacidadAdminPage } from '../features/privacidad/presentation/pages/PrivacidadAdminPage'
import { DudasSinGuiaPage } from '../features/dudas/presentation/pages/DudasSinGuiaPage'
import {
  PERMISOS_GESTION,
  PERMISOS_USUARIOS,
  type Permiso,
} from '../shared/permisos'
import { RaizLayout } from './RaizLayout'

const PERMISOS_FORMULARIO: Permiso[] = ['guides:create', 'guides:manage']

export const router = createBrowserRouter([
  {
    element: <RaizLayout />,
    children: [
      { path: '/', element: <InicioPage /> },
      { path: '/buscar', element: <BusquedaPage /> },
      { path: '/categorias/:id', element: <GuiasDeCategoriaPage /> },
      { path: '/guias/:id', element: <GuiaDetallePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegistroPage /> },
      {
        path: '/admin',
        element: (
          <RutaProtegida permisos={PERMISOS_USUARIOS}>
            <AdminPanelPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/roles',
        element: (
          <RutaProtegida permisos={['roles:read']}>
            <RolesPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/horario',
        element: (
          <RutaProtegida permisos={['room-info:manage']}>
            <HorarioSalaPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/privacidad',
        element: (
          <RutaProtegida permisos={['privacy-terms:manage']}>
            <PrivacidadAdminPage />
          </RutaProtegida>
        ),
      },
      { path: '/favoritos', element: <FavoritosPage /> },
      {
        path: '/perfil',
        element: (
          <RutaProtegida>
            <PerfilPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/gestion',
        element: (
          <RutaProtegida permisos={PERMISOS_GESTION}>
            <GestionPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/dudas',
        element: (
          <RutaProtegida permisos={['doubts:manage']}>
            <DudasSinGuiaPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/gestion/guias/nueva',
        element: (
          <RutaProtegida permisos={PERMISOS_FORMULARIO}>
            <GuiaFormPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/gestion/guias/:id',
        element: (
          <RutaProtegida permisos={PERMISOS_FORMULARIO}>
            <GuiaFormPage />
          </RutaProtegida>
        ),
      },
    ],
  },
])
