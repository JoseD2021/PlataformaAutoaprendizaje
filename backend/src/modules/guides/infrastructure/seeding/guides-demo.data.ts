export interface DemoStepData {
  shortTitle: string;
  action: string;
  description: string;
}

export interface DemoGuideData {
  id: string;
  title: string;
  categoryId: string;
  estimatedMinutes: number;
  isMostRequested: boolean;
  tag: string | null;
  steps: DemoStepData[];
}

export const GUIDES_DEMO_DATA: DemoGuideData[] = [
  {
    id: 'entrar-correo',
    title: 'Entrar a mi correo',
    categoryId: 'correo',
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
    categoryId: 'correo',
    estimatedMinutes: 3,
    isMostRequested: true,
    tag: null,
    steps: [
      {
        shortTitle: 'Redactar',
        action: 'Haz clic en el botón Redactar',
        description:
          'Está arriba a la izquierda y tiene un lápiz dibujado. Se abrirá una ventana para escribir tu mensaje.',
      },
      {
        shortTitle: 'Para',
        action: 'Escribe a quién se lo envías',
        description:
          'En el campo Para, escribe el correo de la persona. En Asunto, escribe una frase corta, por ejemplo: Fotos.',
      },
      {
        shortTitle: 'Adjuntar',
        action: 'Haz clic en el clip para agregar la foto',
        description:
          'Abajo de la ventana hay un ícono de clip. Haz clic, busca la foto en el computador y presiona Abrir.',
      },
      {
        shortTitle: 'Enviar',
        action: 'Haz clic en el botón Enviar',
        description:
          'Es el botón azul de abajo a la izquierda. Verás un aviso que dice que el mensaje fue enviado.',
      },
    ],
  },
  {
    id: 'responder-correo',
    title: 'Responder un correo',
    categoryId: 'correo',
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
    categoryId: 'correo',
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
    categoryId: 'correo',
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
];