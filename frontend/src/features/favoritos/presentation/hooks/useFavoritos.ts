import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import { useAuth } from '../../../auth/presentation/context/AuthContext'

export const FAVORITOS_QUERY_KEY = ['favoritos']

export function useFavoritos() {
  const { usuario } = useAuth()

  return useQuery({
    queryKey: FAVORITOS_QUERY_KEY,
    queryFn: () => container.listarFavoritos.execute(),
    enabled: usuario !== null,
  })
}
