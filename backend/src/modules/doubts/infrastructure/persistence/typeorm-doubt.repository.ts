import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doubt } from '../../domain/entities/doubt.entity';
import { DoubtRepository } from '../../domain/repositories/doubt.repository';
import { DoubtMapper } from './doubt.mapper';
import { DoubtOrmEntity } from './doubt.orm-entity';

@Injectable()
export class TypeOrmDoubtRepository extends DoubtRepository {
  constructor(
    @InjectRepository(DoubtOrmEntity)
    private readonly repository: Repository<DoubtOrmEntity>,
  ) {
    super();
  }

  async findByQuestionAndCategory(
    normalizedQuestion: string,
    categoryId: string,
  ): Promise<Doubt | null> {
    const row = await this.repository.findOne({
      where: { normalizedQuestion, categoryId },
    });

    return row ? DoubtMapper.toDomain(row) : null;
  }

  async findById(id: string): Promise<Doubt | null> {
    const row = await this.repository.findOne({ where: { id } });

    return row ? DoubtMapper.toDomain(row) : null;
  }

  async findAll(): Promise<Doubt[]> {
    const rows = await this.repository.find({
      order: { timesCount: 'DESC', lastAskedAt: 'DESC' },
    });

    return rows.map((row) => DoubtMapper.toDomain(row));
  }

  async save(doubt: Doubt): Promise<void> {
    await this.repository.save(DoubtMapper.toOrm(doubt));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
