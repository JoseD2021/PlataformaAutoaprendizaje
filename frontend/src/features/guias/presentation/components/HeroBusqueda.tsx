import { Search } from 'lucide-react'

export function HeroBusqueda() {
  return (
    <>
      <h1>¿Qué quieres aprender hoy?</h1>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="buscador">
          <Search aria-hidden size={20} />
          <input id="buscar" type="search" placeholder="Por ejemplo: adjuntar una foto" />
          <button type="submit" className="btn btn--verde">Buscar</button>
        </div>
      </form>
    </>
  )
}