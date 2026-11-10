import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideImage } from '../../domain/entities/guide-image.entity';
import { GuideImageRepository } from '../../domain/repositories/guide-image.repository';
import { GuideImageMapper } from './guide-image.mapper';
import { GuideImageOrmEntity } from './guide-image.orm-entity';

@Injectable()
export class TypeOrmGuideImageRepository extends GuideImageRepository {
  constructor(
    @InjectRepository(GuideImageOrmEntity)
    private readonly repository: Repository<GuideImageOrmEntity>,
  ) {
    super();
  }

  async save(image: GuideImage): Promise<GuideImage> {
    const saved = await this.repository.save(GuideImageMapper.toOrm(image));

    return GuideImageMapper.toDomain(saved);
  }

  async findById(id: string): Promise<GuideImage | null> {
    const orm = await this.repository.findOne({ where: { id } });

    return orm ? GuideImageMapper.toDomain(orm) : null;
  }
}
