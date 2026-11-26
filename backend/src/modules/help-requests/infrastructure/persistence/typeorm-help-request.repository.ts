import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere } from 'typeorm';
import { HelpRequest } from '../../domain/entities/help-request.entity';
import { HelpRequestStatus } from '../../domain/enums/help-request-status.enum';
import { HelpRequestRepository } from '../../domain/repositories/help-request.repository';
import { HelpRequestMapper } from './help-request.mapper';
import { HelpRequestOrmEntity } from './help-request.orm-entity';

@Injectable()
export class TypeOrmHelpRequestRepository extends HelpRequestRepository {
  constructor(
    @InjectRepository(HelpRequestOrmEntity)
    private readonly repository: Repository<HelpRequestOrmEntity>,
  ) {
    super();
  }

  async save(helpRequest: HelpRequest): Promise<void> {
    await this.repository.save(HelpRequestMapper.toOrm(helpRequest));
  }

  async findById(id: string): Promise<HelpRequest | null> {
    const row = await this.repository.findOne({ where: { id } });

    return row ? HelpRequestMapper.toDomain(row) : null;
  }

  async findPendingByStationOrUser(
    stationNumber: number | null,
    userId: string | null,
  ): Promise<HelpRequest | null> {
    const where: FindOptionsWhere<HelpRequestOrmEntity>[] = [];

    if (stationNumber !== null) {
      where.push({ status: HelpRequestStatus.PENDING, stationNumber });
    }

    if (userId !== null) {
      where.push({ status: HelpRequestStatus.PENDING, userId });
    }

    if (where.length === 0) {
      return null;
    }

    const row = await this.repository.findOne({ where, order: { createdAt: 'ASC' } });

    return row ? HelpRequestMapper.toDomain(row) : null;
  }

  async listPending(): Promise<HelpRequest[]> {
    const rows = await this.repository.find({
      where: { status: HelpRequestStatus.PENDING },
      order: { createdAt: 'ASC' },
    });

    return rows.map((row) => HelpRequestMapper.toDomain(row));
  }
}
