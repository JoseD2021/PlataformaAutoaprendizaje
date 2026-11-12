export interface DemoStepData {
  shortTitle: string;
  action: string;
  description: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface DemoGuideData {
  id: string;
  title: string;
  categorySlug: string;
  estimatedMinutes: number;
  isMostRequested: boolean;
  tag: string | null;
  steps: DemoStepData[];
}

export const GUIDES_DEMO_DATA: DemoGuideData[] = [
  {
    id: 'entrar-correo',
    title: 'Entrar a mi correo',
    categorySlug: 'correo-gmail',
    estimatedMinutes: 2,
    isMostRequested: false,
    tag: null,
    steps: [
      {
        shortTitle: 'Navegador',
        action: 'Abre el navegador de internet',
        description: 'Busca en el escritorio el ícono de Google Chrome y haz doble clic sobre él.',
      },
      {
        shortTitle: 'Gmail',
        action: 'Escribe la dirección de Gmail',
        description:
          'Arriba, en la barra larga, escribe gmail.com y presiona la tecla Enter del teclado.',
      },
      {
        shortTitle: 'Entrar',
        action: 'Escribe tu correo y tu contraseña',
        description:
          'Escribe tu correo y presiona Siguiente. Luego escribe tu contraseña y presiona Siguiente.',
      },
    ],
  },
  {
    id: 'enviar-correo-foto',
    title: 'Enviar un correo con una foto',
    categorySlug: 'correo-gmail',
    estimatedMinutes: 3,
    isMostRequested: true,
    tag: null,
    steps: [
      {
        shortTitle: 'Redactar',
        action: 'Haz clic en el botón Redactar',
        description:
          'Está arriba a la izquierda y tiene un lápiz dibujado. Se abrirá una ventana para escribir tu mensaje.',
        imageUrl: '/guias/enviar-foto/paso-1.svg',
        imageCaption: 'Ilustración con una vista de Gmail. El botón Redactar está arriba a la izquierda y tiene un lápiz dibujado.',
      },
      {
        shortTitle: 'Para',
        action: 'Escribe a quién se lo envías en "Para"/"Destinatario"',
        description:
          'Escríbelo por completo, por ejemplo: nieta.ana@correo.com. Después escribe un asunto corto y tu mensaje.',
        imageUrl: '/guias/enviar-foto/paso-2.svg',
        imageCaption: 'En la ventana de Mensaje nuevo, arriba hay un campo que dice Para/destinatario. Escribe ahí el correo de la persona a la que le envías el mensaje.',
      },
      {
        shortTitle: 'Adjuntar',
        action: 'Haz clic en el clip para agregar la foto',
        description:
          'Abajo de la ventana hay un ícono de clip. Haz clic, busca la foto en el computador y presiona Abrir.',
        imageUrl: '/guias/enviar-foto/paso-3.svg',
        imageCaption: 'En la ventana de Mensaje nuevo, abajo hay una fila de íconos. El clip es el que estás buscando.',
      },
      {
        shortTitle: 'Enviar',
        action: 'Revisa la foto y haz clic en Enviar',
        description:
          'Debes ver el nombre de la foto dentro del mensaje. Si aparece, haz clic en el botón azul Enviar. Verás un aviso que dice que el mensaje fue enviado.',
        imageUrl: '/guias/enviar-foto/paso-4.svg',
        imageCaption: 'El botón Enviar está en la parte inferior de la ventana de Mensaje nuevo. Es azul y dice Enviar. Seguramente está cerca al clip.',
      },
    ],
  },
  {
    id: 'responder-correo',
    title: 'Responder un correo',
    categorySlug: 'correo-gmail',
    estimatedMinutes: 2,
    isMostRequested: false,
    tag: null,
    steps: [
      {
        shortTitle: 'Abrir',
        action: 'Abre el correo que quieres responder',
        description: 'En la lista de Recibidos, haz clic sobre el mensaje para leerlo.',
      },
      {
        shortTitle: 'Responder',
        action: 'Haz clic en Responder',
        description:
          'Abajo del mensaje hay un botón que dice Responder. Haz clic y escribe tu respuesta en el cuadro.',
      },
      {
        shortTitle: 'Enviar',
        action: 'Haz clic en Enviar',
        description: 'Cuando termines de escribir, presiona el botón azul Enviar.',
      },
    ],
  },
  {
    id: 'crear-cuenta-gmail',
    title: 'Crear una cuenta de Gmail',
    categorySlug: 'correo-gmail',
    estimatedMinutes: 10,
    isMostRequested: false,
    tag: null,
    steps: [
      {
        shortTitle: 'Abrir',
        action: 'Entra a la página de Google',
        description:
          'Abre el navegador, escribe accounts.google.com en la barra de arriba y presiona Enter.',
      },
      {
        shortTitle: 'Crear',
        action: 'Haz clic en Crear cuenta',
        description: 'Elige la opción Para uso personal.',
      },
      {
        shortTitle: 'Nombre',
        action: 'Escribe tu nombre y apellido',
        description: 'Llena los dos campos con tu nombre y presiona Siguiente.',
      },
      {
        shortTitle: 'Datos',
        action: 'Escribe tu fecha de nacimiento y tu género',
        description: 'Elige el día, el mes y el año, y luego tu género. Presiona Siguiente.',
      },
      {
        shortTitle: 'Dirección',
        action: 'Elige el nombre de tu correo',
        description:
          'Escribe el nombre que tendrá tu correo, por ejemplo maria.perez1950. Si ya existe, Google te propondrá otros.',
      },
      {
        shortTitle: 'Contraseña',
        action: 'Crea una contraseña segura',
        description:
          'Escribe una contraseña de al menos 8 caracteres con letras y números. Anótala en un lugar seguro y no la dejes guardada en el computador de la sala.',
      },
      {
        shortTitle: 'Terminar',
        action: 'Termina el registro',
        description:
          'Sigue las indicaciones de la pantalla y acepta las condiciones. Cuando veas tu bandeja de entrada, tu cuenta ya está lista.',
      },
    ],
  },
  {
    id: 'cerrar-sesion',
    title: 'Cerrar sesión al terminar',
    categorySlug: 'correo-gmail',
    estimatedMinutes: 1,
    isMostRequested: false,
    tag: 'Importante en computadores públicos',
    steps: [
      {
        shortTitle: 'Cuenta',
        action: 'Haz clic en tu foto o tu inicial',
        description: 'Está arriba a la derecha: es un círculo con tu inicial o tu foto.',
      },
      {
        shortTitle: 'Salir',
        action: 'Haz clic en Cerrar sesión',
        description:
          'Aparecerá un cuadro. Presiona Cerrar sesión y, antes de irte, cierra también el navegador.',
      },
    ],
  },
  {
    id: 'imprimir-documento',
    title: 'Cómo imprimir un documento',
    categorySlug: 'documentos',
    estimatedMinutes: 3,
    isMostRequested: false,
    tag: null,
    steps: [
      {
        shortTitle: 'Abrir',
        action: 'Abre el documento que quieres imprimir',
        description:
          'Puede ser un recibo, un PDF o un archivo de Word. Haz doble clic sobre él y espera a que se vea completo en la pantalla.',
        imageUrl: '/guias/imprimir-documento/paso-1.svg',
        imageCaption:
          'Ilustración de un documento abierto en la pantalla del computador, con el texto del recibo visible.',
      },
      {
        shortTitle: 'Imprimir',
        action: 'Presiona las teclas Ctrl + P al mismo tiempo',
        description:
          'Mantén apretada la tecla Ctrl y, sin soltarla, presiona la letra P. También puedes hacer clic en el ícono de la impresora que aparece arriba en el programa, si está disponible.',
        imageUrl: '/guias/imprimir-documento/paso-2.svg',
        imageCaption:
          'Ilustración de un teclado con las teclas Ctrl y P resaltadas, junto al ícono de una impresora gris con una hoja saliendo.',
      },
      {
        shortTitle: 'Revisar',
        action: 'Revisa la impresora y las copias',
        description:
          'Se abrirá una ventana de impresión. Mira que arriba aparezca la impresora de la sala y que en "Copias" diga 1, a menos que necesites más.',
        imageUrl: '/guias/imprimir-documento/paso-3.svg',
        imageCaption:
          'Ilustración de la ventana de impresión. Arriba hay un recuadro con el nombre de la impresora y debajo un campo con el número de copias.',
      },
      {
        shortTitle: 'Confirmar',
        action: 'Haz clic en el botón Imprimir',
        description:
          'Está abajo en la ventana. Antes de hacer clic, asegúrate de que ya haya una hoja en la bandeja de entrada de la impresora. Luego de hacer clic, espera unos segundos mientras la impresora prepara tu hoja.',
        imageUrl: '/guias/imprimir-documento/paso-4.svg',
        imageCaption:
          'Ilustración de la parte inferior de la ventana de impresión. El botón Imprimir está junto al botón Cancelar.',
      },
      {
        shortTitle: 'Retirar',
        action: 'Recoge tu hoja de la bandeja de la impresora',
        description:
          'Cuando la impresora se detenga, toma la hoja de la bandeja con cuidado, sin meter la mano dentro de la máquina. Si no sale nada después de un minuto, avísale al monitor.',
        imageUrl: '/guias/imprimir-documento/paso-5.svg',
        imageCaption:
          'Ilustración de una hoja en la bandeja de salida de la impresora, por la parte exterior.',
      },
    ],
  },
  {
    id: 'escribir-guardar-word',
    title: 'Escribir y guardar un documento en Word',
    categorySlug: 'documentos',
    estimatedMinutes: 5,
    isMostRequested: false,
    tag: null,
    steps: [
      {
        shortTitle: 'Abrir',
        action: 'Abre el programa Word',
        description:
          'Haz clic en el botón de inicio de Windows, abajo a la izquierda, escribe la palabra Word y haz clic en el programa que aparece con una letra W azul.',
        imageUrl: '/guias/escribir-guardar-word/paso-1.png',
        imageCaption:
          'Ilustración del menú de inicio de Windows con la palabra Word escrita y el ícono azul de Word resaltado.',
      },
      {
        shortTitle: 'Nuevo',
        action: 'Haz clic en Documento en blanco',
        description:
          'Al abrir Word verás varias opciones. Elige la primera, que es una hoja blanca llamada "Documento en blanco".',
        imageUrl: '/guias/escribir-guardar-word/paso-2.png',
        imageCaption:
          'Ilustración de la pantalla de inicio de Word con el recuadro "Documento en blanco" resaltado.',
      },
      {
        shortTitle: 'Escribir',
        action: 'Escribe tu texto en la hoja',
        description:
          'Haz clic dentro de la hoja blanca. Verás una rayita que parpadea: ahí aparecerá lo que escribas con el teclado. Para dejar un espacio entre palabras usa la barra larga del teclado.',
        imageUrl: '/guias/escribir-guardar-word/paso-3.png',
        imageCaption:
          'Ilustración de una hoja de Word con un texto corto escrito y el cursor parpadeando al final.',
      },
      {
        shortTitle: 'Corregir',
        action: 'Borra con la tecla Retroceso si te equivocas',
        description:
          'Si escribes una letra que no querías, presiona la tecla Retroceso, que tiene una flecha hacia la izquierda y está arriba de la tecla Enter. Esto borra la letra que está antes de la rayita.',
        imageUrl: '/guias/escribir-guardar-word/paso-4.svg',
        imageCaption:
          'Ilustración de un teclado con la tecla Retroceso resaltada, junto a una palabra con una letra tachada.',
      },
      {
        shortTitle: 'Guardar',
        action: 'Presiona las teclas Ctrl + S al mismo tiempo',
        description:
          'Mantén apretada la tecla Ctrl y, sin soltarla, presiona la letra S. Se abrirá una ventana para guardar tu documento. Hazlo antes de terminar para no perder tu trabajo.',
        imageUrl: '/guias/escribir-guardar-word/paso-5.svg',
        imageCaption:
          'Ilustración de un teclado con las teclas Ctrl y S resaltadas y, al lado, el ícono de un disquete.',
      },
      {
        shortTitle: 'Nombre',
        action: 'Ponle un nombre y elige dónde guardarlo',
        description:
          'En el recuadro "Nombre de archivo" escribe un nombre que recuerdes, como "Carta para mi hija". Elige la carpeta Documentos en la lista y haz clic en el botón Guardar. Cuando veas el nombre arriba de la hoja, tu archivo quedó guardado. Si usas una memoria USB, guárdalo también allí o envíalo a tu correo.',
        imageUrl: '/guias/escribir-guardar-word/paso-6.png',
        imageCaption:
          'Ilustración de la ventana Guardar como, con el nombre del archivo escrito, la carpeta Documentos seleccionada y el botón Guardar resaltado.',
      },
    ],
  }
];