import type { Categoria, GuiaDetalle, GuiaResumen } from '../domain/entities'

export const categoriasMock: Categoria[] = [
  {
    id: 'correo',
    nombre: 'Correo Gmail',
    slug: 'correo-gmail',
    icono: 'mail',
    esDestacada: true,
    descripcion: 'Entrar a tu correo, escribir un mensaje y mandar fotos a tu familia.',
  },
  {
    id: 'tramites',
    nombre: 'Trámites en línea',
    slug: 'tramites-en-linea',
    icono: 'landmark',
    esDestacada: false,
    descripcion: 'Citas médicas, certificados y pagos',
  },
  {
    id: 'documentos',
    nombre: 'Documentos',
    slug: 'documentos',
    icono: 'file-text',
    esDestacada: false,
    descripcion: 'Escribir una carta, guardar e imprimir',
  },
  {
    id: 'redes',
    nombre: 'Redes sociales',
    slug: 'redes-sociales',
    icono: 'users',
    esDestacada: false,
    descripcion: 'Facebook y WhatsApp Web',
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad en internet',
    slug: 'seguridad-en-internet',
    icono: 'shield',
    esDestacada: false,
    descripcion: 'Contraseñas, estafas y cerrar sesión',
  },
]

export const guiasResumenMock: GuiaResumen[] = [
  {
    id: 'entrar-correo',
    titulo: 'Entrar a mi correo',
    categoriaId: 'correo',
    totalPasos: 3,
    minutosEstimados: 2,
    esMasPedida: false,
  },
  {
    id: 'enviar-correo-foto',
    titulo: 'Enviar un correo con una foto',
    categoriaId: 'correo',
    totalPasos: 4,
    minutosEstimados: 3,
    esMasPedida: true,
  },
  {
    id: 'responder-correo',
    titulo: 'Responder un correo',
    categoriaId: 'correo',
    totalPasos: 3,
    minutosEstimados: 2,
    esMasPedida: false,
  },
  {
    id: 'crear-cuenta-gmail',
    titulo: 'Crear una cuenta de Gmail',
    categoriaId: 'correo',
    totalPasos: 7,
    minutosEstimados: 10,
    esMasPedida: false,
  },
  {
    id: 'cerrar-sesion',
    titulo: 'Cerrar sesión al terminar',
    categoriaId: 'correo',
    totalPasos: 2,
    minutosEstimados: 1,
    esMasPedida: false,
    etiqueta: 'Importante en computadores públicos',
  },
]

export const guiasDetalleMock: GuiaDetalle[] = [
  {
    id: 'enviar-correo-foto',
    titulo: 'Enviar un correo con una foto',
    categoriaId: 'correo',
    totalPasos: 4,
    minutosEstimados: 3,
    esMasPedida: true,
    pasos: [
      {
        id: '1',
        numero: 1,
        titulo: 'Haz clic en el botón Redactar',
        texto:
          'Está arriba a la izquierda y tiene un lápiz dibujado. Se abrirá una ventana para escribir tu mensaje.',
        imagenUrl: '/guias/enviar-foto-paso-1.svg',
        imagenAlt: 'Ilustración del paso 1: Haz clic en el botón Redactar',
      },
      {
        id: '2',
        numero: 2,
        titulo: 'Escribe a quién se lo envías',
        texto:
          'En el campo Para, escribe el correo de la persona. En Asunto, escribe una frase corta, por ejemplo: Fotos.',
        imagenUrl: '/guias/enviar-foto-paso-2.svg',
        imagenAlt: 'Ilustración del paso 2: Escribe a quién se lo envías',
      },
      {
        id: '3',
        numero: 3,
        titulo: 'Haz clic en el clip para agregar la foto',
        texto:
          'Abajo de la ventana hay un ícono de clip. Haz clic, busca la foto en el computador y presiona Abrir.',
        imagenUrl: '/guias/enviar-foto-paso-3.svg',
        imagenAlt: 'Ilustración del paso 3: Haz clic en el clip para agregar la foto',
      },
      {
        id: '4',
        numero: 4,
        titulo: 'Haz clic en el botón Enviar',
        texto:
          'Es el botón azul de abajo a la izquierda. Verás un aviso que dice que el mensaje fue enviado.',
        imagenUrl: '/guias/enviar-foto-paso-4.svg',
        imagenAlt: 'Ilustración del paso 4: Haz clic en el botón Enviar',
      },
    ],
  },
  {
    id: 'entrar-correo',
    titulo: 'Entrar a mi correo',
    categoriaId: 'correo',
    totalPasos: 3,
    minutosEstimados: 2,
    esMasPedida: false,
    pasos: [
      {
        id: '1',
        numero: 1,
        titulo: 'Abre el navegador de internet',
        texto: 'Busca en el escritorio el ícono de Google Chrome y haz doble clic sobre él.',
        imagenUrl: '/guias/enviar-foto-paso-1.svg',
        imagenAlt: 'Ilustración del paso 1: Abre el navegador de internet',
      },
      {
        id: '2',
        numero: 2,
        titulo: 'Escribe la dirección de Gmail',
        texto:
          'Arriba, en la barra larga, escribe gmail.com y presiona la tecla Enter del teclado.',
        imagenUrl: '/guias/enviar-foto-paso-2.svg',
        imagenAlt: 'Ilustración del paso 2: Escribe la dirección de Gmail',
      },
      {
        id: '3',
        numero: 3,
        titulo: 'Escribe tu correo y tu contraseña',
        texto:
          'Escribe tu correo y presiona Siguiente. Luego escribe tu contraseña y presiona Siguiente.',
        imagenUrl: '/guias/enviar-foto-paso-4.svg',
        imagenAlt: 'Ilustración del paso 3: Escribe tu correo y tu contraseña',
      },
    ],
  },
]
