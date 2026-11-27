import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { DudasSinGuiaPanel } from '../components/DudasSinGuiaPanel'
import '../dudas.css'

export function DudasSinGuiaPage() {
  return (
    <PageLayout>
      <div className="dudas-pagina">
        <NavegacionVolver conAtras={false} conAccionesAdmin />
        <h1>Dudas sin guía</h1>
        <p>
          Anota las preguntas que todavía no tienen guía. Cada semestre el equipo las convierte en guías nuevas.
        </p>
        <DudasSinGuiaPanel />
      </div>
    </PageLayout>
  )
}
