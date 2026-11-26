import { randomUUID } from 'node:crypto';
import { PrivacyTerms } from '../../domain/entities/privacy-terms.entity';
import { PrivacyTermsSectionOrmEntity } from './privacy-terms-section.orm-entity';
import { PrivacyTermsOrmEntity } from './privacy-terms.orm-entity';

export class PrivacyTermsMapper {
  static toDomain(orm: PrivacyTermsOrmEntity, sections: PrivacyTermsSectionOrmEntity[]): PrivacyTerms {
    return PrivacyTerms.create({
      id: orm.id,
      version: orm.version,
      effectiveDate: orm.effectiveDate,
      title: orm.title,
      sections: [...sections]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((s) => ({ title: s.title, paragraphs: [...s.paragraphs] })),
    });
  }

  static toOrm(terms: PrivacyTerms): PrivacyTermsOrmEntity {
    const orm = new PrivacyTermsOrmEntity();
    orm.id = terms.id;
    orm.version = terms.version;
    orm.effectiveDate = terms.effectiveDate;
    orm.title = terms.title;
    return orm;
  }

  static sectionsToOrm(
    terms: PrivacyTerms,
    existingIds: string[] = [],
  ): PrivacyTermsSectionOrmEntity[] {
    return terms.sections.map((section, index) => {
      const orm = new PrivacyTermsSectionOrmEntity();
      orm.id = existingIds[index] ?? randomUUID();
      orm.privacyTermsId = terms.id;
      orm.title = section.title;
      orm.paragraphs = [...section.paragraphs];
      orm.displayOrder = index + 1;
      return orm;
    });
  }
}
