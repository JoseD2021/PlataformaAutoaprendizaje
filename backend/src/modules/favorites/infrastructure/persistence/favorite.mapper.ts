import { Favorite } from '../../domain/entities/favorite.entity';
import { FavoriteOrmEntity } from './favorite.orm-entity';

export class FavoriteMapper {
  static toDomain(orm: FavoriteOrmEntity): Favorite {
    return Favorite.rehydrate({
      userId: orm.userId,
      guideId: orm.guideId,
      createdAt: orm.createdAt,
    });
  }

  static toOrm(favorite: Favorite): FavoriteOrmEntity {
    const orm = new FavoriteOrmEntity();
    orm.userId = favorite.userId;
    orm.guideId = favorite.guideId;
    orm.createdAt = favorite.createdAt;

    return orm;
  }
}
