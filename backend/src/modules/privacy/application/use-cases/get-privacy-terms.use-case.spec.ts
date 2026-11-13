import { GetPrivacyTermsUseCase } from './get-privacy-terms.use-case';
import { CURRENT_PRIVACY_TERMS } from '../../domain/privacy-terms';

describe('GetPrivacyTermsUseCase', () => {
  it('devuelve la versión vigente del aviso de privacidad', () => {
    const terms = new GetPrivacyTermsUseCase().execute();

    expect(terms).toBe(CURRENT_PRIVACY_TERMS);
    expect(terms.version).toBeTruthy();
    expect(terms.sections.length).toBeGreaterThan(0);
  });
});
