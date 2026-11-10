import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { GuideNotFoundError } from '../errors/guide.errors';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';

@Injectable()
export class DeleteGuideUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(id: string, actor: GuideActor): Promise<void> {
    assertGuidePermission(actor, Permission.GUIDES_MANAGE);

    if (!(await this.guides.existsById(id))) {
      throw new GuideNotFoundError();
    }

    await this.guides.delete(id);
  }
}