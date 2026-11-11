import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidesModule } from '../guides/guides.module';
import { FAVORITE_REPOSITORY } from './domain/repositories/favorite.repository';
import { FavoriteOrmEntity } from './infrastructure/persistence/favorite.orm-entity';
import { TypeOrmFavoriteRepository } from './infrastructure/persistence/typeorm-favorite.repository';
import { FavoritesController } from './presentation/controllers/favorites.controller';
import { AddFavoriteUseCase } from './application/use-cases/add-favorite.use-case';
import { ListFavoritesUseCase } from './application/use-cases/list-favorites.use-case';
import { RemoveFavoriteUseCase } from './application/use-cases/remove-favorite.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteOrmEntity]), GuidesModule],
  controllers: [FavoritesController],
  providers: [
    { provide: FAVORITE_REPOSITORY, useClass: TypeOrmFavoriteRepository },
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    ListFavoritesUseCase,
  ],
})
export class FavoritesModule {}
