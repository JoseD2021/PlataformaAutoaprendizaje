import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { rutaDeBusqueda } from './busqueda-route'

const MIN_CARACTERES = 2

export function HeroBusqueda({ valorInicial = '' }: { valorInicial?: string }) {
  const [texto, setTexto] = useState(valorInicial)
  const [aviso, setAviso] = useState('')
  const navigate = useNavigate()

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    const consulta = texto.trim()

    if (consulta.length < MIN_CARACTERES) {
      setAviso('Escribe al menos dos letras para buscar.')
      return
    }

    setAviso('')
    navigate(rutaDeBusqueda(consulta))
  }

  return (
    <>
      <h1>¿Qué quieres aprender hoy?</h1>
      <form role="search" onSubmit={buscar}>
        <div className="buscador">
          <Search aria-hidden size={20} />
          <input
            id="buscar"
            type="search"
            placeholder="Por ejemplo: adjuntar una foto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-label="Buscar guías"
            aria-describedby={aviso ? 'buscar-aviso' : undefined}
          />
          <button type="submit" className="btn btn--verde">Buscar</button>
        </div>
      </form>
      {aviso && (
        <p id="buscar-aviso" className="buscador-aviso" role="alert">
          {aviso}
        </p>
      )}
    </>
  )
}
