import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { RoomRule } from '../../domain/entities/room-rule.entity';
import { ScheduleEntry } from '../../domain/entities/schedule-entry.entity';
import {
  CannotManageRoomInfoError,
  InvalidRoomInfoError,
} from '../../domain/errors/room-info.errors';
import {
  ROOM_INFO_REPOSITORY,
  RoomInfoRepository,
} from '../../domain/repositories/room-info.repository';
import { MAX_ROOM_RULES, MAX_ROOM_SCHEDULES } from '../../domain/room-info.limits';
import type { RoomInfoModel } from '../models/room-info-view.model';

export interface UpdateRoomInfoInput {
  schedules: { days: string; hours: string }[];
  rules: string[];
}

export interface UpdateRoomInfoActor {
  permissions: Permission[];
}

@Injectable()
export class UpdateRoomInfoUseCase {
  constructor(@Inject(ROOM_INFO_REPOSITORY) private readonly roomInfo: RoomInfoRepository) {}

  async execute(input: UpdateRoomInfoInput, actor: UpdateRoomInfoActor): Promise<RoomInfoModel> {
    if (!actor.permissions.includes(Permission.ROOM_INFO_MANAGE)) {
      throw new CannotManageRoomInfoError();
    }
    if (input.schedules.length > MAX_ROOM_SCHEDULES) {
      throw new InvalidRoomInfoError(`No puede haber más de ${MAX_ROOM_SCHEDULES} horarios`);
    }
    if (input.rules.length > MAX_ROOM_RULES) {
      throw new InvalidRoomInfoError(`No puede haber más de ${MAX_ROOM_RULES} normas`);
    }

    const schedules = input.schedules.map((data, index) =>
      ScheduleEntry.create({ id: randomUUID(), order: index + 1, ...data }),
    );
    const rules = input.rules.map((text, index) =>
      RoomRule.create({ id: randomUUID(), order: index + 1, text }),
    );

    await this.roomInfo.replaceAll(schedules, rules);

    return {
      schedules: schedules.map((entry) => ({ days: entry.days, hours: entry.hours })),
      rules: rules.map((rule) => rule.text),
    };
  }
}