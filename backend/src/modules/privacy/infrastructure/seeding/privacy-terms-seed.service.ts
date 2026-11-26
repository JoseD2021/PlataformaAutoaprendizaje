import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrivacyTerms } from '../../domain/entities/privacy-terms.entity';
import { PrivacyTermsRepository } from '../../domain/repositories/privacy-terms.repository';

export const DEFAULT_PRIVACY_TERMS = {
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

/** Siembra el aviso de privacidad inicial si no existe, de forma idempotente. */
@Injectable()
export class PrivacyTermsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PrivacyTermsSeedService.name);

  constructor(private readonly repository: PrivacyTermsRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const current = await this.repository.findCurrent();
      if (current) return;

      await this.repository.save(
        PrivacyTerms.create({
          id: randomUUID(),
          ...DEFAULT_PRIVACY_TERMS,
        }),
      );
      this.logger.log('Aviso de privacidad inicial sembrado.');
    } catch (error) {
      this.logger.error(
        'No se pudo sembrar el aviso de privacidad inicial. ¿Se ejecutó la migración?',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
