import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'doubts' })
@Index('UQ_doubts_question_category', ['normalizedQuestion', 'categoryId'], {
  unique: true,
})
@Index('IDX_doubts_mas_preguntadas', ['timesCount', 'lastAskedAt'])
export class DoubtOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 300 })
  question: string;

  @Column({ name: 'normalized_question', type: 'varchar', length: 300 })
  normalizedQuestion: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @Column({ type: 'varchar', length: 80 })
  topic: string;

  @Column({ name: 'times_count', type: 'integer', default: 1 })
  timesCount: number;

  @Column({ name: 'last_asked_at', type: 'timestamptz' })
  lastAskedAt: Date;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
