import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { HelpRequestStatus } from '../../domain/enums/help-request-status.enum';

@Entity({ name: 'help_requests' })
export class HelpRequestOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'station_number', type: 'smallint', nullable: true })
  stationNumber: number | null;

  @Column({ name: 'guide_id', type: 'varchar', length: 80, nullable: true })
  guideId: string | null;

  @Column({ name: 'guide_title', type: 'varchar', length: 160, nullable: true })
  guideTitle: string | null;

  @Column({ name: 'step_number', type: 'smallint', nullable: true })
  stepNumber: number | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'requester_name', type: 'varchar', length: 120, nullable: true })
  requesterName: string | null;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status: HelpRequestStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt: Date | null;

  @Column({ name: 'resolved_by', type: 'uuid', nullable: true })
  resolvedBy: string | null;
}
