import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyTerms } from '../../domain/entities/privacy-terms.entity';
import { PrivacyTermsRepository } from '../../domain/repositories/privacy-terms.repository';
import { PrivacyTermsMapper } from './privacy-terms.mapper';
import { PrivacyTermsSectionOrmEntity } from './privacy-terms-section.orm-entity';
import { PrivacyTermsOrmEntity } from './privacy-terms.orm-entity';

@Injectable()
export class TypeOrmPrivacyTermsRepository extends PrivacyTermsRepository {
  constructor(
    @InjectRepository(PrivacyTermsOrmEntity)
    private readonly terms: Repository<PrivacyTermsOrmEntity>,
    @InjectRepository(PrivacyTermsSectionOrmEntity)
    private readonly sections: Repository<PrivacyTermsSectionOrmEntity>,
  ) {
    super();
  }

  async findCurrent(): Promise<PrivacyTerms | null> {
    const row = await this.terms.find({ take: 1, order: { id: 'ASC' } });
    const current = row[0];
    if (!current) return null;
    const sectionRows = await this.sections.find({
      where: { privacyTermsId: current.id },
      order: { displayOrder: 'ASC' },
    });
    return PrivacyTermsMapper.toDomain(current, sectionRows);
  }

  async save(terms: PrivacyTerms): Promise<PrivacyTerms> {
    return this.terms.manager.transaction(async (manager) => {
      const termsRepo = manager.getRepository(PrivacyTermsOrmEntity);
      const sectionsRepo = manager.getRepository(PrivacyTermsSectionOrmEntity);

      const existingSections = await sectionsRepo.find({
        where: { privacyTermsId: terms.id },
        order: { displayOrder: 'ASC' },
      });

      await termsRepo.save(PrivacyTermsMapper.toOrm(terms));
      await sectionsRepo.delete({ privacyTermsId: terms.id });
      const nextSections = PrivacyTermsMapper.sectionsToOrm(
        terms,
        existingSections.map((s) => s.id),
      );
      if (nextSections.length > 0) await sectionsRepo.save(nextSections);

      return terms;
    });
  }
}
