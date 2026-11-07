import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { GuideOrmEntity } from './guide.orm-entity';

@Entity({ name: 'guide_steps' })
@Index('UQ_guide_steps_guide_position', ['guideId', 'position'], { unique: true })
export class GuideStepOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'guide_id', type: 'varchar', length: 80 })
  guideId: string;

  @Column({ type: 'integer' })
  position: number;

  @Column({ name: 'short_title', type: 'varchar', length: 20 })
  shortTitle: string;

  @Column({ type: 'varchar', length: 200 })
  action: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'image_url', type: 'varchar', length: 512, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'image_caption', type: 'varchar', length: 255, nullable: true })
  imageCaption: string | null;

  @ManyToOne(() => GuideOrmEntity, (guide) => guide.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guide_id', foreignKeyConstraintName: 'FK_guide_steps_guide' })
  guide: Relation<GuideOrmEntity>;
}