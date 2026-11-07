import { createBrowserRouter } from 'react-router-dom'
import { InicioPage } from '../features/guias/presentation/pages/InicioPage'
import { GuiasDeCategoriaPage } from '../features/guias/presentation/pages/GuiasDeCategoriaPage'
import { GuiaDetallePage } from '../features/guias/presentation/pages/GuiaDetallePage'

export const router = createBrowserRouter([
  { path: '/', element: <InicioPage /> },
  { path: '/categorias/:id', element: <GuiasDeCategoriaPage /> },
  { path: '/guias/:id', element: <GuiaDetallePage /> },
])