import { createBrowserRouter } from 'react-router-dom'
import { InicioPage } from '../features/guias/presentation/pages/InicioPage'
import { BusquedaPage } from '../features/guias/presentation/pages/BusquedaPage'
import { GuiasDeCategoriaPage } from '../features/guias/presentation/pages/GuiasDeCategoriaPage'
import { GuiaDetallePage } from '../features/guias/presentation/pages/GuiaDetallePage'
import { LoginPage } from '../features/auth/presentation/pages/LoginPage'
import { RegistroPage } from '../features/auth/presentation/pages/RegistroPage'
import { AdminPanelPage } from '../features/admin/presentation/pages/AdminPanelPage'
import { FavoritosPage } from '../features/favoritos/presentation/pages/FavoritosPage'
import { GestionPage } from '../features/gestion/presentation/pages/GestionPage'
import { GuiaFormPage } from '../features/gestion/presentation/pages/GuiaFormPage'
import { RutaProtegida } from '../features/gestion/presentation/components/RutaProtegida'
import type { Rol } from '../features/auth/domain/entities'
import { RaizLayout } from './RaizLayout'

const ROLES_GESTION: Rol[] = ['personal_clena', 'administrador']

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
      { path: '/admin', element: <AdminPanelPage /> },
      { path: '/favoritos', element: <FavoritosPage /> },
      {
        path: '/gestion',
        element: (
          <RutaProtegida roles={ROLES_GESTION}>
            <GestionPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/gestion/guias/nueva',
        element: (
          <RutaProtegida roles={ROLES_GESTION}>
            <GuiaFormPage />
          </RutaProtegida>
        ),
      },
      {
        path: '/gestion/guias/:id',
        element: (
          <RutaProtegida roles={ROLES_GESTION}>
            <GuiaFormPage />
          </RutaProtegida>
        ),
      },
    ],
  },
])