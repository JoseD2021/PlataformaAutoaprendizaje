import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { GuideStepOrmEntity } from './guide-step.orm-entity';

@Entity({ name: 'guides' })
export class GuideOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  id: string;

  @Column({ type: 'varchar', length: 160 })
  title: string;

  @Index('IDX_guides_category_id')
  @Column({ name: 'category_id', type: 'varchar', length: 64 })
  categoryId: string;

  @Column({ name: 'estimated_minutes', type: 'integer' })
  estimatedMinutes: number;

  @Column({ name: 'is_most_requested', type: 'boolean', default: false })
  isMostRequested: boolean;

  @Column({ type: 'varchar', length: 120, nullable: true })
  tag: string | null;

  @Index('IDX_guides_status')
  @Column({ type: 'varchar', length: 16, default: 'draft' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => GuideStepOrmEntity, (step) => step.guide, { cascade: true })
  steps: Relation<GuideStepOrmEntity>[];
}