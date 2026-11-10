import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { CATEGORY_LOOKUP, CategoryLookup } from '../../application/ports/category-lookup.port';
import { GuideStep } from '../../domain/entities/guide-step.entity';
import { Guide } from '../../domain/entities/guide.entity';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { GUIDES_DEMO_DATA } from './guides-demo.data';
import { generateGuideKeywords } from '../../domain/services/guide-keywords-generator';

/**
 * Siembra las guías de demostración de forma idempotente.
 *
 * Solo actúa cuando SEED_DEMO_DATA=true. Necesita que las categorías de demo existan.
 */
@Injectable()
export class GuidesSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(GuidesSeedService.name);

  constructor(
    @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
    @Inject(CATEGORY_LOOKUP) private readonly categories: CategoryLookup,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get<string>('SEED_DEMO_DATA') !== 'true') {
      return;
    }

    try {
      let created = 0;

      for (const data of GUIDES_DEMO_DATA) {
        if (await this.guides.existsById(data.id)) {
          continue;
        }

        const categoryId = await this.categories.findIdBySlug(data.categorySlug);

        if (!categoryId) {
          this.logger.warn(
            `Se omite la guía "${data.id}": no existe la categoría "${data.categorySlug}".`,
          );
          continue;
        }

        const guide = Guide.create({
          id: data.id,
          title: data.title,
          categoryId,
          estimatedMinutes: data.estimatedMinutes,
          isMostRequested: data.isMostRequested,
          tag: data.tag,
          status: GuideStatus.PUBLISHED,
          steps: data.steps.map((step, index) =>
            GuideStep.create({ id: randomUUID(), position: index + 1, ...step }),
          ),
          searchKeywords: generateGuideKeywords({
            title: data.title,
            tag: data.tag
          }),
        });

        await this.guides.save(guide);
        created += 1;
      }

      this.logger.log(`Guías de demo sembradas: ${created} nuevas.`);
    } catch (error) {
      this.logger.error(
        'No se pudieron sembrar las guías de demo. ¿Se ejecutó la migración?',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}