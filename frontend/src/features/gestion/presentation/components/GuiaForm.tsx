import { useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import type { CategoriaGestion, DatosGuia, PasoEditable } from '../../domain/entities'

interface PasoForm extends PasoEditable {
  clave: number
}

let contadorClaves = 0
const nuevaClave = () => ++contadorClaves
const pasoVacio = (): PasoForm => ({
  clave: nuevaClave(),
  tituloCorto: '',
  accion: '',
  descripcion: '',
  imagenUrl: '',
  pieImagen: '',
})

interface Props {
  inicial: DatosGuia
  categorias: CategoriaGestion[]
  enviando: boolean
  error: string | null
  textoBoton: string
  onGuardar: (datos: DatosGuia) => void
}

export function GuiaForm({ inicial, categorias, enviando, error, textoBoton, onGuardar }: Props) {
  const [titulo, setTitulo] = useState(inicial.titulo)
  const [categoriaId, setCategoriaId] = useState(inicial.categoriaId)
  const [minutos, setMinutos] = useState(String(inicial.minutosEstimados || ''))
  const [esMasPedida, setEsMasPedida] = useState(inicial.esMasPedida)
  const [etiqueta, setEtiqueta] = useState(inicial.etiqueta)
  const [palabrasClave, setPalabrasClave] = useState(inicial.palabrasClave)
  const [pasos, setPasos] = useState<PasoForm[]>(() =>
    inicial.pasos.length > 0
      ? inicial.pasos.map((p) => ({ ...p, clave: nuevaClave() }))
      : [pasoVacio()],
  )

  function cambiarPaso(clave: number, campo: keyof PasoEditable, valor: string) {
    setPasos((actuales) => actuales.map((p) => (p.clave === clave ? { ...p, [campo]: valor } : p)))
  }

  function moverPaso(indice: number, delta: -1 | 1) {
    setPasos((actuales) => {
      const destino = indice + delta
      if (destino < 0 || destino >= actuales.length) return actuales
      const copia = [...actuales]
      ;[copia[indice], copia[destino]] = [copia[destino], copia[indice]]
      return copia
    })
  }

  function quitarPaso(clave: number) {
    setPasos((actuales) => (actuales.length > 1 ? actuales.filter((p) => p.clave !== clave) : actuales))
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    onGuardar({
      titulo,
      categoriaId,
      minutosEstimados: Number(minutos),
      esMasPedida,
      etiqueta,
      palabrasClave,
      pasos: pasos.map(({ clave: _clave, ...paso }) => paso),
    })
  }

  return (
    <form className="gestion-form" onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="guia-titulo">Título de la guía</label>
        <input
          id="guia-titulo"
          type="text"
          required
          maxLength={120}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="guia-categoria">Categoría</label>
        <select
          id="guia-categoria"
          required
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="gestion-fila">
        <div className="campo">
          <label htmlFor="guia-minutos">Minutos estimados</label>
          <input
            id="guia-minutos"
            type="number"
            required
            min={1}
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="guia-etiqueta">Etiqueta (opcional)</label>
          <input
            id="guia-etiqueta"
            type="text"
            maxLength={80}
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
          />
        </div>
      </div>

      <div className="campo">
        <label htmlFor="guia-palabras">Palabras clave para la búsqueda (opcional)</label>
        <input
          id="guia-palabras"
          type="text"
          value={palabrasClave}
          onChange={(e) => setPalabrasClave(e.target.value)}
        />
        <small>Separadas por espacios. Ejemplo: imprimir impresora fotocopia hoja</small>
      </div>

      <div className="campo campo--check">
        <input
          id="guia-mas-pedida"
          type="checkbox"
          checked={esMasPedida}
          onChange={(e) => setEsMasPedida(e.target.checked)}
        />
        <label htmlFor="guia-mas-pedida">Marcar como «La más pedida»</label>
      </div>

      <h2>Pasos</h2>
      {pasos.map((p, i) => (
        <fieldset key={p.clave} className="gestion-paso">
          <legend>Paso {i + 1}</legend>

          <div className="campo">
            <label htmlFor={`paso-${p.clave}-corto`}>Título corto</label>
            <input
              id={`paso-${p.clave}-corto`}
              type="text"
              required
              maxLength={40}
              value={p.tituloCorto}
              onChange={(e) => cambiarPaso(p.clave, 'tituloCorto', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor={`paso-${p.clave}-accion`}>Qué debe hacer la persona</label>
            <input
              id={`paso-${p.clave}-accion`}
              type="text"
              required
              value={p.accion}
              onChange={(e) => cambiarPaso(p.clave, 'accion', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor={`paso-${p.clave}-desc`}>Explicación</label>
            <textarea
              id={`paso-${p.clave}-desc`}
              required
              rows={3}
              value={p.descripcion}
              onChange={(e) => cambiarPaso(p.clave, 'descripcion', e.target.value)}
            />
          </div>
          <div className="gestion-fila">
            <div className="campo">
              <label htmlFor={`paso-${p.clave}-img`}>Imagen (ruta o dirección, opcional)</label>
              <input
                id={`paso-${p.clave}-img`}
                type="text"
                placeholder="/img/redactar.png"
                value={p.imagenUrl}
                onChange={(e) => cambiarPaso(p.clave, 'imagenUrl', e.target.value)}
              />
            </div>
            <div className="campo">
              <label htmlFor={`paso-${p.clave}-pie`}>Texto de la imagen (opcional)</label>
              <input
                id={`paso-${p.clave}-pie`}
                type="text"
                value={p.pieImagen}
                onChange={(e) => cambiarPaso(p.clave, 'pieImagen', e.target.value)}
              />
            </div>
          </div>

          <div className="gestion-acciones">
            <button type="button" className="btn btn--claro btn-sm" onClick={() => moverPaso(i, -1)} disabled={i === 0}>
              <ArrowUp aria-hidden size={16} /> Subir
            </button>
            <button
              type="button"
              className="btn btn--claro btn-sm"
              onClick={() => moverPaso(i, 1)}
              disabled={i === pasos.length - 1}
            >
              <ArrowDown aria-hidden size={16} /> Bajar
            </button>
            <button
              type="button"
              className="btn btn--peligro btn-sm"
              onClick={() => quitarPaso(p.clave)}
              disabled={pasos.length === 1}
            >
              <Trash2 aria-hidden size={16} /> Quitar paso
            </button>
          </div>
        </fieldset>
      ))}

      <button type="button" className="btn btn--claro btn-sm" onClick={() => setPasos([...pasos, pasoVacio()])}>
        <Plus aria-hidden size={16} /> Agregar paso
      </button>

      {error && <p role="alert" className="gestion-mensaje">{error}</p>}

      <div className="gestion-acciones">
        <button type="submit" className="btn btn--verde" disabled={enviando}>
          <Save aria-hidden size={18} /> {enviando ? 'Guardando…' : textoBoton}
        </button>
      </div>
    </form>
  )
}
