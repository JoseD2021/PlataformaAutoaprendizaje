import { GetPrivacyTermsUseCase } from './get-privacy-terms.use-case';
import { PrivacyTerms } from '../../domain/entities/privacy-terms.entity';
import { PrivacyTermsRepository } from '../../domain/repositories/privacy-terms.repository';

class InMemoryPrivacyTermsRepository extends PrivacyTermsRepository {
  constructor(private current: PrivacyTerms | null) {
    super();
  }
  async findCurrent(): Promise<PrivacyTerms | null> {
    return this.current;
  }
  async save(terms: PrivacyTerms): Promise<PrivacyTerms> {
    this.current = terms;
    return terms;
  }
}

describe('GetPrivacyTermsUseCase', () => {
  it('devuelve la versión vigente del aviso de privacidad', async () => {
    const current = PrivacyTerms.create({
      id: 'id-1',
      version: '1.0',
      effectiveDate: '2026-11-12',
      title: 'Aviso',
      sections: [{ title: 'Sección', paragraphs: ['Texto'] }],
    });
    const terms = await new GetPrivacyTermsUseCase(new InMemoryPrivacyTermsRepository(current)).execute();

    expect(terms.version).toBe('1.0');
    expect(terms.sections.length).toBe(1);
  });
});
