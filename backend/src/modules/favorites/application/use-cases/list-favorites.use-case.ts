import { Inject, Injectable } from '@nestjs/common';
import {
  GUIDE_REPOSITORY,
  GuideRepository,
} from '../../../guides/domain/repositories/guide.repository';
import { GuideStatus } from '../../../guides/domain/enums/guide-status.enum';
import {
  toGuideSummaryModel,
  type GuideSummaryModel,
} from '../../../guides/application/models/guide-view.model';
import { FAVORITE_REPOSITORY, FavoriteRepository } from '../../domain/repositories/favorite.repository';

@Injectable()
export class ListFavoritesUseCase {
  constructor(
    @Inject(FAVORITE_REPOSITORY) private readonly favorites: FavoriteRepository,
    @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
  ) {}

  async execute(userId: string): Promise<GuideSummaryModel[]> {
    const guideIds = await this.favorites.listGuideIdsByUser(userId);
    const guides = await Promise.all(guideIds.map((id) => this.guides.findById(id)));

    return guides
      .filter((guide) => guide !== null && guide.status === GuideStatus.PUBLISHED)
      .map((guide) => toGuideSummaryModel(guide!));
  }
}
