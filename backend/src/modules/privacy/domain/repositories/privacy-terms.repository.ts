import type { PrivacyTerms } from '../entities/privacy-terms.entity';

export abstract class PrivacyTermsRepository {
  abstract findCurrent(): Promise<PrivacyTerms | null>;
  abstract save(terms: PrivacyTerms): Promise<PrivacyTerms>;
}
