import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'room_schedules' })
@Index('UQ_room_schedules_display_order', ['displayOrder'], { unique: true })
export class RoomScheduleOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  days: string;

  @Column({ type: 'varchar', length: 80 })
  hours: string;

  @Column({ name: 'display_order', type: 'integer' })
  displayOrder: number;
}