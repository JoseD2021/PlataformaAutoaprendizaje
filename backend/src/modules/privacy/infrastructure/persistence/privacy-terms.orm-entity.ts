import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PrivacyTermsSectionOrmEntity } from './privacy-terms-section.orm-entity';

@Entity({ name: 'privacy_terms' })
export class PrivacyTermsOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  version: string;

  @Column({ name: 'effective_date', type: 'varchar', length: 10 })
  effectiveDate: string;

  @Column({ type: 'varchar', length: 160 })
  title: string;

  @OneToMany(() => PrivacyTermsSectionOrmEntity, (section) => section.terms)
  sections: PrivacyTermsSectionOrmEntity[];
}
