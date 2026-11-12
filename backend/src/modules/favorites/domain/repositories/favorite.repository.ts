import type { Favorite } from '../entities/favorite.entity';

export abstract class FavoriteRepository {
  abstract exists(userId: string, guideId: string): Promise<boolean>;
  abstract add(favorite: Favorite): Promise<void>;
  abstract remove(userId: string, guideId: string): Promise<void>;
  /** Ids de guía favoritas del usuario, de la más reciente a la más antigua. */
  abstract listGuideIdsByUser(userId: string): Promise<string[]>;
}

export const FAVORITE_REPOSITORY = Symbol('FAVORITE_REPOSITORY');
