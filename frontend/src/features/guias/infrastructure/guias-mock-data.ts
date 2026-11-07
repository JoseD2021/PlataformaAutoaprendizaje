import type { Categoria, GuiaDetalle, GuiaResumen } from '../domain/entities'

export const categoriasMock: Categoria[] = [
  {
    id: 'correo',
    nombre: 'Correo Gmail',
    icono: 'mail',
    esDestacada: true,
    descripcion: 'Entrar a tu correo, escribir un mensaje y mandar fotos a tu familia.',
  },
  {
    id: 'tramites',
    nombre: 'Trámites en línea',
    icono: 'landmark',
    esDestacada: false,
    descripcion: 'Citas médicas, certificados y pagos',
  },
  {
    id: 'documentos',
    nombre: 'Documentos',
    icono: 'file-text',
    esDestacada: false,
    descripcion: 'Escribir una carta, guardar e imprimir',
  },
  {
    id: 'redes',
    nombre: 'Redes sociales',
    icono: 'users',
    esDestacada: false,
    descripcion: 'Facebook y WhatsApp Web',
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad en internet',
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
    pasos: [
      {
        id: 'paso-1',
        numero: 1,
        titulo: 'Abre la ventana para escribir',
        texto:
          "Busca arriba a la izquierda el botón grande que dice 'Redactar' con un símbolo de lápiz o cruz de colores. Haz clic una sola vez con el botón izquierdo del ratón.",
        imagenUrl: '/guias/enviar-foto-paso-1.svg',
        imagenAlt:
          'Ilustración del botón Redactar en la esquina superior izquierda de la pantalla de Gmail',
      },
      {
        id: 'paso-2',
        numero: 2,
        titulo: 'Escribe a quién se lo mandas y el asunto',
        texto:
          "En la casilla 'Para', escribe el correo electrónico de tu familiar o amigo. Debajo, en 'Asunto', escribe una palabra que resuma el mensaje, como por ejemplo: Fotos del paseo.",
        imagenUrl: '/guias/enviar-foto-paso-2.svg',
        imagenAlt:
          'Campos de texto Para y Asunto en la ventana de nuevo mensaje',
      },
      {
        id: 'paso-3',
        numero: 3,
        titulo: 'Adjunta la fotografía',
        texto:
          "En la parte de abajo de la ventana, busca el dibujo de un gancho o clip sujetapapeles. Haz clic en él, busca la foto en tu computador y presiona el botón 'Abrir'.",
        imagenUrl: '/guias/enviar-foto-paso-3.svg',
        imagenAlt:
          'Icono de clip sujetapapeles para adjuntar archivos en la parte inferior del mensaje',
      },
      {
        id: 'paso-4',
        numero: 4,
        titulo: 'Revisa y presiona Enviar',
        texto:
          "Comprueba que el nombre de la foto aparezca abajo en color azul. Cuando estés listo, haz clic en el botón azul grande que dice 'Enviar'. ¡Y listo, tu mensaje fue enviado!",
        imagenUrl: '/guias/enviar-foto-paso-4.svg',
        imagenAlt:
          'Botón azul de Enviar resaltado en la parte inferior de la ventana',
      },
    ],
  },
  {
    id: 'entrar-correo',
    titulo: 'Entrar a mi correo',
    categoriaId: 'correo',
    pasos: [
      {
        id: 'paso-1',
        numero: 1,
        titulo: 'Abre la página de Gmail',
        texto:
          'Abre el navegador de internet y escribe gmail.com en la barra de arriba, o presiona el acceso directo en la pantalla.',
        imagenUrl: '/guias/enviar-foto-paso-1.svg',
        imagenAlt: 'Pantalla de acceso a Gmail',
      },
      {
        id: 'paso-2',
        numero: 2,
        titulo: 'Escribe tu dirección de correo',
        texto:
          'Escribe tu correo electrónico completo (por ejemplo tunombre@gmail.com) y haz clic en el botón azul que dice Siguiente.',
        imagenUrl: '/guias/enviar-foto-paso-2.svg',
        imagenAlt: 'Campo para ingresar el correo electrónico',
      },
      {
        id: 'paso-3',
        numero: 3,
        titulo: 'Escribe tu contraseña',
        texto:
          'Escribe cuidadosamente tu contraseña secreta y presiona Siguiente para entrar a ver tus mensajes.',
        imagenUrl: '/guias/enviar-foto-paso-4.svg',
        imagenAlt: 'Campo para ingresar la contraseña y botón Siguiente',
      },
    ],
  },
]
