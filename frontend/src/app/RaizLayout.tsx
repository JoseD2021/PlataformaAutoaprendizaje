import { Outlet, useLocation } from 'react-router-dom'
import { BotonHorarioNormas } from '../features/sala/presentation/components/BotonHorarioNormas'
import { AvisosAyuda } from '../features/ayuda/presentation/components/AvisosAyuda'

export function RaizLayout() {
  const { pathname } = useLocation()
  const enGestion = pathname.startsWith('/gestion') || pathname.startsWith('/admin')

  return (
    <>
      <Outlet />
      {!enGestion && <BotonHorarioNormas />}
      <AvisosAyuda />
    </>
  )
}