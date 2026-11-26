import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { GuiaForm } from './GuiaForm'
import type { CategoriaGestion, DatosGuia } from '../../domain/entities'

const inicial: DatosGuia = {
  titulo: 'Imprimir',
  categoriaId: 'cat-1',
  minutosEstimados: 2,
  esMasPedida: false,
  etiqueta: '',
  palabrasClave: '',
  pasos: [
    {
      tituloCorto: 'Abrir',
      accion: 'Abrir el archivo',
      descripcion: 'Haz clic en Abrir',
      imagenUrl: '',
      pieImagen: '',
    },
  ],
}

function renderizar(onSubirImagen: (archivo: File) => Promise<string>) {
  render(
    <GuiaForm
      inicial={inicial}
      categorias={[] as CategoriaGestion[]}
      enviando={false}
      error={null}
      textoBoton="Crear"
      onGuardar={vi.fn()}
      onSubirImagen={onSubirImagen}
    />,
  )
}

describe('GuiaForm', () => {
  it('coloca automáticamente la URL devuelta al subir una imagen', async () => {
    const url = '/api/v1/guides/images/img-1'
    const onSubirImagen = vi.fn().mockResolvedValue(url)
    renderizar(onSubirImagen)
    const archivo = new File(['contenido'], 'paso.png', { type: 'image/png' })

    fireEvent.change(screen.getByLabelText('Subir imagen desde el equipo'), {
      target: { files: [archivo] },
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Imagen (ruta o dirección, opcional)')).toHaveValue(url)
    })
    expect(onSubirImagen).toHaveBeenCalledWith(archivo)
  })
})
