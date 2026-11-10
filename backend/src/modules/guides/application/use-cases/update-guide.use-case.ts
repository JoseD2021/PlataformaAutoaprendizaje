import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { Guide } from '../../domain/entities/guide.entity';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { CATEGORY_LOOKUP, CategoryLookup } from '../ports/category-lookup.port';
import { GuideCategoryNotFoundError, GuideNotFoundError } from '../errors/guide.errors';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import { buildGuideSteps, type GuideInput } from '../models/guide-input';
import {
  toGuideManagementDetailModel,
  type GuideManagementDetailModel,
} from '../models/guide-management.model';
import { generateGuideKeywords } from '../../domain/services/guide-keywords-generator';

@Injectable()
export class UpdateGuideUseCase {
  constructor(
    @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
    @Inject(CATEGORY_LOOKUP) private readonly categories: CategoryLookup,
  ) {}

  async execute(
    id: string,
    input: GuideInput,
    actor: GuideActor,
  ): Promise<GuideManagementDetailModel> {
    assertGuidePermission(actor, Permission.GUIDES_MANAGE);

    const existing = await this.guides.findById(id);

    if (!existing) {
      throw new GuideNotFoundError();
    }

    const guide = Guide.create({
      id: existing.id,
      title: input.title,
      categoryId: input.categoryId,
      estimatedMinutes: input.estimatedMinutes,
      isMostRequested: input.isMostRequested,
      tag: input.tag,
      status: existing.status,
      steps: buildGuideSteps(input.steps),
      searchKeywords: generateGuideKeywords({
        title: input.title,
        tag: input.tag,
        manualKeywords: input.keywords ?? existing.searchKeywords,
      }),
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    if (!(await this.categories.existsById(guide.categoryId))) {
      throw new GuideCategoryNotFoundError();
    }

    return toGuideManagementDetailModel(await this.guides.save(guide));
  }
}