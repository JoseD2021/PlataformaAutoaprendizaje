import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from '../../domain/entities/guide.entity';
import {
  GuideFilters,
  GuideRepository,
  PaginatedGuides,
  PaginationOptions,
} from '../../domain/repositories/guide.repository';
import { GuideMapper } from './guide.mapper';
import { GuideOrmEntity } from './guide.orm-entity';
import { GuideStepOrmEntity } from './guide-step.orm-entity';

@Injectable()
export class TypeOrmGuideRepository extends GuideRepository {
  constructor(
    @InjectRepository(GuideOrmEntity)
    private readonly repository: Repository<GuideOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<Guide | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { steps: true },
      order: { steps: { position: 'ASC' } },
    });

    return orm ? GuideMapper.toDomain(orm) : null;
  }

  async existsById(id: string): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  async save(guide: Guide): Promise<Guide> {
    return this.repository.manager.transaction(async (manager) => {
      await manager.delete(GuideStepOrmEntity, { guideId: guide.id });
      const saved = await manager.save(GuideOrmEntity, GuideMapper.toOrm(guide));

      return GuideMapper.toDomain(saved);
    });
  }

  async paginate(filters: GuideFilters, options: PaginationOptions): Promise<PaginatedGuides> {
    const query = this.repository
      .createQueryBuilder('guide')
      .leftJoinAndSelect('guide.steps', 'step');

    if (filters.categoryId) {
      query.andWhere('guide.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters.status) {
      query.andWhere('guide.status = :status', { status: filters.status });
    }
    if (filters.search) {
      const escaped = filters.search.replace(/[\\%_]/g, '\\$&');
      query.andWhere('guide.title ILIKE :search', { search: `%${escaped}%` });
    }

    const [items, total] = await query
      .orderBy('guide.isMostRequested', 'DESC')
      .addOrderBy('guide.title', 'ASC')
      .addOrderBy('step.position', 'ASC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit)
      .getManyAndCount();

    return { items: items.map((item) => GuideMapper.toDomain(item)), total };
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}