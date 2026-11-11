import { PageLayout } from '../../../../shared/components/PageLayout'
import { SeccionFavoritos } from '../../../favoritos/presentation/components/SeccionFavoritos'
import { CategoriaDestacada } from '../components/CategoriaDestacada'
import { CategoriaItem } from '../components/CategoriaItem'
import { HeroBusqueda } from '../components/HeroBusqueda'
import { useCategorias } from '../hooks/useCategorias'

export function InicioPage() {
  const { data, isLoading, isError } = useCategorias()

  const contenido = () => {
    if (isLoading) return <p role="status">Cargando temas…</p>
    if (isError || !data) return <p role="alert">No pudimos cargar los temas. Pide ayuda a un monitor.</p>

    const destacada = data.find((c) => c.esDestacada)
    const otras = data.filter((c) => !c.esDestacada)
    return (
      <>
        {destacada && <CategoriaDestacada categoria={destacada} />}
        <SeccionFavoritos />
        <h2 className="otros-temas">Otros temas</h2>
        <ul className="temas-lista">
          {otras.map((c) => <li key={c.id}><CategoriaItem categoria={c} /></li>)}
        </ul>
      </>
    )
  }

  return <PageLayout hero={<HeroBusqueda />}>{contenido()}</PageLayout>
}