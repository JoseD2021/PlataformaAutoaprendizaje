import { Outlet, useLocation } from 'react-router-dom'
import { BotonHorarioNormas } from '../features/sala/presentation/components/BotonHorarioNormas'

export function RaizLayout() {
  const { pathname } = useLocation()
  const enGestion = pathname.startsWith('/gestion') || pathname.startsWith('/admin')

  return (
    <>
      <Outlet />
      {!enGestion && <BotonHorarioNormas />}
    </>
  )
}