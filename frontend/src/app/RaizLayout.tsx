import { Outlet } from 'react-router-dom'
import { BotonHorarioNormas } from '../features/sala/presentation/components/BotonHorarioNormas'

export function RaizLayout() {
  return (
    <>
      <Outlet />
      <BotonHorarioNormas />
    </>
  )
}