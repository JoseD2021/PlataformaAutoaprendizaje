import { Inject, Injectable } from '@nestjs/common';
import {
  ROOM_INFO_REPOSITORY,
  RoomInfoRepository,
} from '../../domain/repositories/room-info.repository';
import type { RoomInfoModel } from '../models/room-info-view.model';

@Injectable()
export class GetRoomInfoUseCase {
  constructor(@Inject(ROOM_INFO_REPOSITORY) private readonly roomInfo: RoomInfoRepository) {}

  async execute(): Promise<RoomInfoModel> {
    const [schedules, rules] = await Promise.all([
      this.roomInfo.findSchedules(),
      this.roomInfo.findRules(),
    ]);

    return {
      schedules: schedules.map((entry) => ({ days: entry.days, hours: entry.hours })),
      rules: rules.map((rule) => rule.text),
    };
  }
}