import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../domain/entities/favorite.entity';
import { FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { FavoriteMapper } from './favorite.mapper';
import { FavoriteOrmEntity } from './favorite.orm-entity';

@Injectable()
export class TypeOrmFavoriteRepository extends FavoriteRepository {
  constructor(
    @InjectRepository(FavoriteOrmEntity)
    private readonly repository: Repository<FavoriteOrmEntity>,
  ) {
    super();
  }

  async exists(userId: string, guideId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { userId, guideId } });

    return count > 0;
  }

  async add(favorite: Favorite): Promise<void> {
    await this.repository.upsert(FavoriteMapper.toOrm(favorite), ['userId', 'guideId']);
  }

  async remove(userId: string, guideId: string): Promise<void> {
    await this.repository.delete({ userId, guideId });
  }

  async listGuideIdsByUser(userId: string): Promise<string[]> {
    const rows = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return rows.map((row) => row.guideId);
  }
}
