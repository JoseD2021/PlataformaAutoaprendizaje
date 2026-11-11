import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { BotonFavorito } from '../../../favoritos/presentation/components/BotonFavorito'
import { useGuia } from '../hooks/useGuia'

export function GuiaDetallePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: guia, isLoading, isError } = useGuia(id)
  const [pasoActualIndice, setPasoActualIndice] = useState(0)
  const [guiaCompletada, setGuiaCompletada] = useState(false)

  const volverAtras = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else if (guia?.categoriaId) {
      navigate(`/categorias/${guia.categoriaId}`)
    } else {
      navigate('/')
    }
  }

  const retrocederPaso = () => {
    if (pasoActualIndice > 0) {
      setPasoActualIndice((indicePrevio) => indicePrevio - 1)
      setGuiaCompletada(false)
    }
  }

  const avanzarPaso = () => {
    if (guia && pasoActualIndice < guia.pasos.length - 1) {
      setPasoActualIndice((indicePrevio) => indicePrevio + 1)
    }
  }

  const finalizarGuia = () => {
    setGuiaCompletada(true)
  }

  const renderizarContenido = () => {
    if (isLoading) {
      return (
        <p role="status" className="paso-texto">
          Cargando la guía…
        </p>
      )
    }

    if (isError) {
      return (
        <p role="alert" className="paso-texto">
          No pudimos cargar la guía. Por favor pide ayuda a un monitor de la sala.
        </p>
      )
    }

    if (!guia || guia.pasos.length === 0) {
      return (
        <p role="alert" className="paso-texto">
          Esta guía no existe o aún no tiene pasos disponibles.
        </p>
      )
    }

    const totalPasos = guia.pasos.length
    const pasoActual = guia.pasos[pasoActualIndice]
    const pasosRestantes = totalPasos - (pasoActualIndice + 1)
    const esPrimerPaso = pasoActualIndice === 0
    const esUltimoPaso = pasoActualIndice === totalPasos - 1

    const textoPasosFaltantes = () => {
      if (pasosRestantes === 0) {
        return '¡Este es el último paso!'
      }
      if (pasosRestantes === 1) {
        return 'Falta 1 paso'
      }
      return `Faltan ${pasosRestantes} pasos`
    }

    if (guiaCompletada) {
      return (
        <div className="guia-finalizada" role="status" aria-live="polite">
          <CheckCircle2 size={56} color="#1a3a2a" aria-hidden />
          <h2>¡Felicitaciones! Has completado la guía</h2>
          <p>
            Ya aprendiste a realizar cada paso de <strong>{guia.titulo}</strong>. Si
            deseas practicar de nuevo o aprender otra cosa, puedes volver al inicio.
          </p>
          <div className="guia-paso__acciones" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn--contorno"
              onClick={() => {
                setGuiaCompletada(false)
                setPasoActualIndice(0)
              }}
            >
              Repetir la guía
            </button>
            <button
              type="button"
              className="btn btn--claro"
              onClick={volverAtras}
            >
              <ArrowLeft aria-hidden size={20} /> Volver a la página anterior
            </button>
            <Link to="/" className="btn btn--verde">
              <Home aria-hidden size={20} /> Volver al inicio
            </Link>
          </div>
        </div>
      )
    }

    return (
      <article className="guia-paso" aria-labelledby="titulo-guia">
        <header className="guia-paso__meta">
          <span className="paso-badge">
            Paso {pasoActualIndice + 1} de {totalPasos}
          </span>
          <span className="paso-restantes">{textoPasosFaltantes()}</span>
        </header>

        {/* Región dinámica accesible con aria-live para anunciar el cambio de paso */}
        <section aria-live="polite" aria-atomic="true">
          <h2 className="guia-paso__titulo">{pasoActual.titulo}</h2>

          {pasoActual.imagenUrl && (
            <div className="guia-paso__imagen-marco">
              <img
                src={pasoActual.imagenUrl}
                alt={pasoActual.imagenAlt}
                className="guia-paso__imagen"
              />
            </div>
          )}

          <p className="guia-paso__texto">{pasoActual.texto}</p>
        </section>

        <footer className="guia-paso__acciones">
          <button
            type="button"
            className="btn btn--contorno"
            onClick={retrocederPaso}
            disabled={esPrimerPaso}
            aria-disabled={esPrimerPaso}
          >
            <ArrowLeft aria-hidden size={20} /> Atrás
          </button>

          {esUltimoPaso ? (
            <button
              type="button"
              className="btn btn--marca"
              onClick={finalizarGuia}
            >
              <CheckCircle2 aria-hidden size={20} /> Finalizar guía
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--verde"
              onClick={avanzarPaso}
            >
              Siguiente <ArrowRight aria-hidden size={20} />
            </button>
          )}
        </footer>
      </article>
    )
  }

  return (
    <PageLayout>
      <nav className="navegacion-superior" aria-label="Navegación de retorno">
        <button
          type="button"
          onClick={volverAtras}
          className="btn-enlace"
        >
          <ArrowLeft aria-hidden size={20} /> Volver a la página anterior
        </button>
        <span className="separador-nav" aria-hidden>·</span>
        <Link to="/" className="btn-enlace">
          <Home aria-hidden size={20} /> Volver al inicio
        </Link>
      </nav>
      {guia && (
        <div className="guia-detalle__encabezado">
          <h1 id="titulo-guia">{guia.titulo}</h1>
          <BotonFavorito guiaId={guia.id} />
        </div>
      )}
      {renderizarContenido()}
    </PageLayout>
  )
}
