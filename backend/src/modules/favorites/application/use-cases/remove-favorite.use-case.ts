import { Inject, Injectable } from '@nestjs/common';
import { FAVORITE_REPOSITORY, FavoriteRepository } from '../../domain/repositories/favorite.repository';

export interface RemoveFavoriteInput {
  userId: string;
  guideId: string;
}

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(@Inject(FAVORITE_REPOSITORY) private readonly favorites: FavoriteRepository) {}

  async execute(input: RemoveFavoriteInput): Promise<void> {
    await this.favorites.remove(input.userId, input.guideId);
  }
}
