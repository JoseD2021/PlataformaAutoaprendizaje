export interface PrivacyTermsSection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyTermsDocument {
  version: string;
  effectiveDate: string;
  title: string;
  sections: PrivacyTermsSection[];
}

/**
 * Fuente única de verdad del aviso de privacidad.
 *
 * Al publicar una nueva versión se debe actualizar `version` y `effectiveDate`.
 * La versión aceptada por cada usuario queda registrada en la entidad User.
 */
export const CURRENT_PRIVACY_TERMS: PrivacyTermsDocument = {
  version: '1.0',
  effectiveDate: '2026-11-12',
  title: 'Aviso de privacidad de Aprende Fácil',
  sections: [
    {
      title: 'Quiénes somos',
      paragraphs: [
        'Aprende Fácil es una plataforma de autoaprendizaje de la Biblioteca CLENA, pensada para acompañar a las personas en el uso de herramientas digitales básicas.',
        'Este aviso explica qué datos personales recopilamos cuando creas una cuenta, para qué los usamos y cómo puedes ejercer tus derechos.',
      ],
    },
    {
      title: 'Qué datos personales recopilamos',
      paragraphs: [
        'Al registrarte nos proporcionas tu nombre completo y tu correo electrónico. También eliges una contraseña, que guardamos cifrada y nunca mostramos en texto plano.',
        'Dentro de la plataforma guardamos las guías que marcas como favoritas. Además, por motivos de seguridad, registramos datos técnicos de la sesión, como la dirección IP y el navegador utilizado.',
      ],
    },
    {
      title: 'Para qué usamos tus datos',
      paragraphs: [
        'Usamos tus datos para crear y mantener tu cuenta, permitirte iniciar sesión, mostrar tus guías favoritas y proteger la plataforma frente a accesos no autorizados.',
        'No utilizamos tus datos para publicidad ni los vendemos o compartimos con terceros ajenos a la Biblioteca CLENA.',
      ],
    },
    {
      title: 'Cuánto tiempo los conservamos',
      paragraphs: [
        'Conservamos tus datos mientras tu cuenta permanezca activa. Si cierras tu cuenta desde la plataforma, eliminamos tu usuario y revocamos las sesiones asociadas.',
      ],
    },
    {
      title: 'Cómo protegemos tus datos',
      paragraphs: [
        'Aplicamos medidas técnicas y organizativas para proteger tu información. El acceso a los datos está limitado al personal autorizado de la Biblioteca CLENA.',
      ],
    },
    {
      title: 'Tus derechos',
      paragraphs: [
        'Puedes solicitar el acceso, la corrección o la eliminación de tus datos personales. También puedes cerrar tu cuenta cuando lo desees.',
        'Para ejercer estos derechos, acércate al personal de la sala o utiliza los canales de atención de la Biblioteca CLENA.',
      ],
    },
    {
      title: 'Aceptación y cambios',
      paragraphs: [
        'Al marcar la casilla de aceptación durante el registro, confirmas que leíste y aceptas este aviso de privacidad.',
        'Guardamos la versión aceptada y la fecha de aceptación. Si publicamos una nueva versión del aviso, te pediremos que la revises y la aceptes nuevamente.',
      ],
    },
  ],
};
