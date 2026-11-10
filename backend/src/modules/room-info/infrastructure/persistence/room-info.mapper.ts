import { RoomRule } from '../../domain/entities/room-rule.entity';
import { ScheduleEntry } from '../../domain/entities/schedule-entry.entity';
import { RoomRuleOrmEntity } from './room-rule.orm-entity';
import { RoomScheduleOrmEntity } from './room-schedule.orm-entity';

export class RoomInfoMapper {
  static scheduleToDomain(orm: RoomScheduleOrmEntity): ScheduleEntry {
    return ScheduleEntry.create({
      id: orm.id,
      days: orm.days,
      hours: orm.hours,
      order: orm.displayOrder,
    });
  }

  static scheduleToOrm(entry: ScheduleEntry): RoomScheduleOrmEntity {
    const orm = new RoomScheduleOrmEntity();
    orm.id = entry.id;
    orm.days = entry.days;
    orm.hours = entry.hours;
    orm.displayOrder = entry.order;

    return orm;
  }

  static ruleToDomain(orm: RoomRuleOrmEntity): RoomRule {
    return RoomRule.create({ id: orm.id, text: orm.text, order: orm.displayOrder });
  }

  static ruleToOrm(rule: RoomRule): RoomRuleOrmEntity {
    const orm = new RoomRuleOrmEntity();
    orm.id = rule.id;
    orm.text = rule.text;
    orm.displayOrder = rule.order;

    return orm;
  }
}