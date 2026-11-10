import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { Guide } from '../../domain/entities/guide.entity';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { slugFromTitle } from '../../domain/services/guide-slug';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { CATEGORY_LOOKUP, CategoryLookup } from '../ports/category-lookup.port';
import { GuideAlreadyExistsError, GuideCategoryNotFoundError } from '../errors/guide.errors';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import { buildGuideSteps, type GuideInput } from '../models/guide-input';
import {
  toGuideManagementDetailModel,
  type GuideManagementDetailModel,
} from '../models/guide-management.model';
import { generateGuideKeywords } from '../../domain/services/guide-keywords-generator';

@Injectable()
export class CreateGuideUseCase {
  constructor(
    @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
    @Inject(CATEGORY_LOOKUP) private readonly categories: CategoryLookup,
  ) {}

  async execute(input: GuideInput, actor: GuideActor): Promise<GuideManagementDetailModel> {
    assertGuidePermission(actor, Permission.GUIDES_CREATE);

    const guide = Guide.create({
      id: slugFromTitle(input.title),
      title: input.title,
      categoryId: input.categoryId,
      estimatedMinutes: input.estimatedMinutes,
      isMostRequested: input.isMostRequested,
      tag: input.tag,
      status: GuideStatus.DRAFT,
      steps: buildGuideSteps(input.steps),
      searchKeywords: generateGuideKeywords({
        title: input.title,
        tag: input.tag,
        manualKeywords: input.keywords,
      }),
    });

    if (!(await this.categories.existsById(guide.categoryId))) {
      throw new GuideCategoryNotFoundError();
    }
    if (await this.guides.existsById(guide.id)) {
      throw new GuideAlreadyExistsError();
    }

    return toGuideManagementDetailModel(await this.guides.save(guide));
  }
}