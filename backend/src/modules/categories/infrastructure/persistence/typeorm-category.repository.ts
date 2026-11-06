import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryMapper } from './category.mapper';
import { CategoryOrmEntity } from './category.orm-entity';

@Injectable()
export class TypeOrmCategoryRepository extends CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<Category | null> {
    const orm = await this.repository.findOne({ where: { id } });

    return orm ? CategoryMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.repository.find({
      order: { displayOrder: 'ASC', name: 'ASC' },
    });

    return categories.map((category) => CategoryMapper.toDomain(category));
  }

  async save(category: Category): Promise<void> {
    await this.repository.save(CategoryMapper.toOrm(category));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}