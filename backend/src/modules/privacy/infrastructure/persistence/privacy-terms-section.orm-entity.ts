import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PrivacyTermsOrmEntity } from './privacy-terms.orm-entity';

@Entity({ name: 'privacy_terms_sections' })
@Index('UQ_privacy_terms_sections_order', ['privacyTermsId', 'displayOrder'], { unique: true })
export class PrivacyTermsSectionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'privacy_terms_id', type: 'uuid' })
  privacyTermsId: string;

  @ManyToOne(() => PrivacyTermsOrmEntity, (terms) => terms.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'privacy_terms_id' })
  terms: PrivacyTermsOrmEntity;

  @Column({ type: 'varchar', length: 160 })
  title: string;

  @Column({ type: 'jsonb' })
  paragraphs: string[];

  @Column({ name: 'display_order', type: 'integer' })
  displayOrder: number;
}
