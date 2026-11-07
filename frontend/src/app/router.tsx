import { createBrowserRouter } from 'react-router-dom'
import { InicioPage } from '../features/guias/presentation/pages/InicioPage'
import { GuiasDeCategoriaPage } from '../features/guias/presentation/pages/GuiasDeCategoriaPage'

export const router = createBrowserRouter([
  { path: '/', element: <InicioPage /> },
  { path: '/categorias/:id', element: <GuiasDeCategoriaPage /> },
])