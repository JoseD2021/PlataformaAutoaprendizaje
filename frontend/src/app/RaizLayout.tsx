import { Outlet, useLocation } from 'react-router-dom'
import { BotonHorarioNormas } from '../features/sala/presentation/components/BotonHorarioNormas'
import { AvisosAyuda } from '../features/ayuda/presentation/components/AvisosAyuda'
import { DialogoAceptarTerminosActualizados } from '../features/privacidad/presentation/components/DialogoAceptarTerminosActualizados'

export function RaizLayout() {
  const { pathname } = useLocation()
  const enGestion =
    pathname.startsWith('/gestion') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/horario') ||
    pathname.startsWith('/privacidad')

  return (
    <>
      <Outlet />
      {!enGestion && <BotonHorarioNormas />}
      <AvisosAyuda />
      <DialogoAceptarTerminosActualizados />
    </>
  )
}