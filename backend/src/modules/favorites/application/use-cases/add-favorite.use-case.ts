import { Inject, Injectable } from '@nestjs/common';
import {
  GUIDE_REPOSITORY,
  GuideRepository,
} from '../../../guides/domain/repositories/guide.repository';
import { GuideStatus } from '../../../guides/domain/enums/guide-status.enum';
import { Favorite } from '../../domain/entities/favorite.entity';
import { FAVORITE_REPOSITORY, FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { FavoriteGuideNotFoundError } from '../errors/favorite.errors';

export interface AddFavoriteInput {
  userId: string;
  guideId: string;
}

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @Inject(FAVORITE_REPOSITORY) private readonly favorites: FavoriteRepository,
    @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
  ) {}

  async execute(input: AddFavoriteInput): Promise<void> {
    const guide = await this.guides.findById(input.guideId);

    if (!guide || guide.status !== GuideStatus.PUBLISHED) {
      throw new FavoriteGuideNotFoundError();
    }

    const alreadyFavorite = await this.favorites.exists(input.userId, input.guideId);

    if (alreadyFavorite) {
      return;
    }

    await this.favorites.add(Favorite.create({ userId: input.userId, guideId: input.guideId }));
  }
}
