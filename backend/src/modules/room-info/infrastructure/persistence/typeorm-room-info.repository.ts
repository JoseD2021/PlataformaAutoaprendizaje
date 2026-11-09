import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RoomRule } from '../../domain/entities/room-rule.entity';
import type { ScheduleEntry } from '../../domain/entities/schedule-entry.entity';
import { RoomInfoRepository } from '../../domain/repositories/room-info.repository';
import { RoomInfoMapper } from './room-info.mapper';
import { RoomRuleOrmEntity } from './room-rule.orm-entity';
import { RoomScheduleOrmEntity } from './room-schedule.orm-entity';

@Injectable()
export class TypeOrmRoomInfoRepository extends RoomInfoRepository {
  constructor(
    @InjectRepository(RoomScheduleOrmEntity)
    private readonly schedules: Repository<RoomScheduleOrmEntity>,
    @InjectRepository(RoomRuleOrmEntity)
    private readonly rules: Repository<RoomRuleOrmEntity>,
  ) {
    super();
  }

  async findSchedules(): Promise<ScheduleEntry[]> {
    const rows = await this.schedules.find({ order: { displayOrder: 'ASC' } });

    return rows.map((row) => RoomInfoMapper.scheduleToDomain(row));
  }

  async findRules(): Promise<RoomRule[]> {
    const rows = await this.rules.find({ order: { displayOrder: 'ASC' } });

    return rows.map((row) => RoomInfoMapper.ruleToDomain(row));
  }

  async countSchedules(): Promise<number> {
    return this.schedules.count();
  }

  async countRules(): Promise<number> {
    return this.rules.count();
  }

  async saveSchedules(entries: ScheduleEntry[]): Promise<void> {
    await this.schedules.save(entries.map((entry) => RoomInfoMapper.scheduleToOrm(entry)));
  }

  async saveRules(rules: RoomRule[]): Promise<void> {
    await this.rules.save(rules.map((rule) => RoomInfoMapper.ruleToOrm(rule)));
  }
}