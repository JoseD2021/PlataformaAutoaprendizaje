import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { GuideNotFoundError } from '../errors/guide.errors';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import {
  toGuideManagementDetailModel,
  type GuideManagementDetailModel,
} from '../models/guide-management.model';

@Injectable()
export class GetManagedGuideUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(id: string, actor: GuideActor): Promise<GuideManagementDetailModel> {
    assertGuidePermission(actor, Permission.GUIDES_MANAGE);

    const guide = await this.guides.findById(id);

    if (!guide) {
      throw new GuideNotFoundError();
    }

    return toGuideManagementDetailModel(guide);
  }
}