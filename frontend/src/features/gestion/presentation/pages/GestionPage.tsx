import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { CategoriasGestionPanel } from '../components/CategoriasGestionPanel'
import { GuiasGestionPanel } from '../components/GuiasGestionPanel'
import '../gestion.css'

type Pestana = 'publicadas' | 'borradores' | 'categorias'

const PESTANAS: { id: Pestana; texto: string }[] = [
  { id: 'publicadas', texto: 'Publicadas' },
  { id: 'borradores', texto: 'Borradores' },
  { id: 'categorias', texto: 'Categorías' },
]

export function GestionPage() {
  const { usuario } = useAuth()
  const [pestana, setPestana] = useState<Pestana>('publicadas')

  return (
    <PageLayout>
      <div className="gestion">
        <NavegacionVolver conAtras={false} />
        <h1>Gestión de contenidos</h1>

        <div className="gestion-barra">
          <nav aria-label="Secciones de gestión" className="gestion-pestanas">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="btn btn--claro btn-sm gestion-pestana"
                aria-current={pestana === p.id ? 'page' : undefined}
                onClick={() => setPestana(p.id)}
              >
                {p.texto}
              </button>
            ))}
          </nav>

          <div className="gestion-acciones">
            {usuario?.rol === 'administrador' && (
              <Link to="/admin" className="btn btn--claro btn-sm">
                <Users aria-hidden size={16} /> Usuarios y roles
              </Link>
            )}
            <Link to="/gestion/guias/nueva" className="btn btn--verde btn-sm">
              <Plus aria-hidden size={16} /> Nueva guía
            </Link>
          </div>
        </div>

        {pestana === 'categorias' ? (
          <CategoriasGestionPanel />
        ) : (
          <GuiasGestionPanel estado={pestana === 'publicadas' ? 'publicada' : 'borrador'} />
        )}
      </div>
    </PageLayout>
  )
}
