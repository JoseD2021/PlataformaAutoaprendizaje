import { createBrowserRouter } from 'react-router-dom'
import { InicioPage } from '../features/guias/presentation/pages/InicioPage'
import { BusquedaPage } from '../features/guias/presentation/pages/BusquedaPage'
import { GuiasDeCategoriaPage } from '../features/guias/presentation/pages/GuiasDeCategoriaPage'
import { GuiaDetallePage } from '../features/guias/presentation/pages/GuiaDetallePage'

export const router = createBrowserRouter([
  { path: '/', element: <InicioPage /> },
  { path: '/buscar', element: <BusquedaPage /> },
  { path: '/categorias/:id', element: <GuiasDeCategoriaPage /> },
  { path: '/guias/:id', element: <GuiaDetallePage /> },
])