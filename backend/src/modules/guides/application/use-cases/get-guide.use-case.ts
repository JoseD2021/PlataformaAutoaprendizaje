import { Inject, Injectable } from '@nestjs/common';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { GuideNotFoundError } from '../errors/guide.errors';
import type { GuideDetailModel } from '../models/guide-view.model';
import { toGuideDetailModel } from '../models/guide-view.model';

@Injectable()
export class GetGuideUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(id: string): Promise<GuideDetailModel> {
    const guide = await this.guides.findById(id);

    if (!guide || guide.status !== GuideStatus.PUBLISHED) {
      throw new GuideNotFoundError();
    }

    return toGuideDetailModel(guide);
  }
}