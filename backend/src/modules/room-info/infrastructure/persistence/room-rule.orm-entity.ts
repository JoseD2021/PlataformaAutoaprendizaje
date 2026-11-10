import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'room_rules' })
@Index('UQ_room_rules_display_order', ['displayOrder'], { unique: true })
export class RoomRuleOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  text: string;

  @Column({ name: 'display_order', type: 'integer' })
  displayOrder: number;
}