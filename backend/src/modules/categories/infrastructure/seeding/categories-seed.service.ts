import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';

const DEMO_CATEGORIES = [
  {
    name: 'Correo Gmail',
    iconName: 'mail',
    isFeatured: true,
    description: 'Entrar a tu correo, escribir un mensaje y mandar fotos a tu familia.',
  },
  {
    name: 'Trámites en línea',
    iconName: 'landmark',
    isFeatured: false,
    description: 'Citas médicas, certificados y pagos',
  },
  {
    name: 'Documentos',
    iconName: 'file-text',
    isFeatured: false,
    description: 'Escribir una carta, guardar e imprimir',
  },
  {
    name: 'Redes sociales',
    iconName: 'users',
    isFeatured: false,
    description: 'Facebook y WhatsApp Web',
  },
  {
    name: 'Seguridad en internet',
    iconName: 'shield',
    isFeatured: false,
    description: 'Contraseñas, estafas y cerrar sesión',
  },
];

/** Siembra las categorías de demostración de forma idempotente (SEED_DEMO_DATA=true). */
@Injectable()
export class CategoriesSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CategoriesSeedService.name);

  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categories: CategoryRepository,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get<string>('SEED_DEMO_DATA') !== 'true') {
      return;
    }

    try {
      let created = 0;

      for (const data of DEMO_CATEGORIES) {
        const category = Category.create({ id: randomUUID(), ...data, slug: '' });

        if (await this.categories.findBySlug(category.slug)) {
          continue;
        }

        await this.categories.save(category);
        created += 1;
      }

      this.logger.log(`Categorías de demo sembradas: ${created} nuevas.`);
    } catch (error) {
      this.logger.error(
        'No se pudieron sembrar las categorías de demo.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}