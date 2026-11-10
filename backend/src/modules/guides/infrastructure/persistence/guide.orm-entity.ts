import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  type Relation,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { GuideStepOrmEntity } from './guide-step.orm-entity';
import { CategoryOrmEntity } from '../../../categories/infrastructure/persistence/category.orm-entity';

@Index('idx_guides_search_doc_trgm', { synchronize: false })
@Entity('guides')
export class GuideOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  id: string;

  @Column({ type: 'varchar', length: 160 })
  title: string;

    @Index('IDX_guides_category_id')
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => CategoryOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id', foreignKeyConstraintName: 'FK_guides_category' })
  category: Relation<CategoryOrmEntity>;

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

  @Column({ name: 'search_keywords', type: 'text', default: '' })
  searchKeywords: string;

  @Column({
    name: 'search_doc',
    type: 'text',
    generatedType: 'STORED',
    asExpression: "f_unaccent(lower(title || ' ' || search_keywords))",
    select: false,
    insert: false,
    update: false,
  })
  searchDoc: string;
}