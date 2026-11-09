import type { RoomRule } from '../entities/room-rule.entity';
import type { ScheduleEntry } from '../entities/schedule-entry.entity';

export abstract class RoomInfoRepository {
  abstract findSchedules(): Promise<ScheduleEntry[]>;
  abstract findRules(): Promise<RoomRule[]>;
  abstract countSchedules(): Promise<number>;
  abstract countRules(): Promise<number>;
  abstract saveSchedules(entries: ScheduleEntry[]): Promise<void>;
  abstract saveRules(rules: RoomRule[]): Promise<void>;
}

export const ROOM_INFO_REPOSITORY = Symbol('ROOM_INFO_REPOSITORY');