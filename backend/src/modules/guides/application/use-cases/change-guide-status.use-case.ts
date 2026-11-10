import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { GuideNotFoundError } from '../errors/guide.errors';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import {
  toGuideManagementDetailModel,
  type GuideManagementDetailModel,
} from '../models/guide-management.model';

@Injectable()
export class ChangeGuideStatusUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(
    id: string,
    status: GuideStatus,
    actor: GuideActor,
  ): Promise<GuideManagementDetailModel> {
    assertGuidePermission(actor, Permission.GUIDES_MANAGE);

    const guide = await this.guides.findById(id);

    if (!guide) {
      throw new GuideNotFoundError();
    }

    if (status === GuideStatus.PUBLISHED) {
      guide.publish();
    } else {
      guide.unpublish();
    }

    return toGuideManagementDetailModel(await this.guides.save(guide));
  }
}