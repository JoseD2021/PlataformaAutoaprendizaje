import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { GuideAlreadyMostRequestedError, GuideNotFoundError } from '../errors/guide.errors';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import {
  toGuideManagementDetailModel,
  type GuideManagementDetailModel,
} from '../models/guide-management.model';

@Injectable()
export class ChangeGuideMostRequestedUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(
    id: string,
    isMostRequested: boolean,
    actor: GuideActor,
  ): Promise<GuideManagementDetailModel> {
    assertGuidePermission(actor, Permission.GUIDES_MANAGE);

    const guide = await this.guides.findById(id);

    if (!guide) {
      throw new GuideNotFoundError();
    }
    if (
      isMostRequested &&
      (await this.guides.findMostRequestedByCategory(guide.categoryId, id))
    ) {
      throw new GuideAlreadyMostRequestedError();
    }

    guide.changeIsMostRequested(isMostRequested);

    return toGuideManagementDetailModel(await this.guides.save(guide));
  }
}
