export interface PrivacyTermsSection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyTermsDocument {
  version: string;
  effectiveDate: string;
  title: string;
  sections: PrivacyTermsSection[];
}

// El contenido vigente se almacena en base de datos y se siembra desde
// backend/src/modules/privacy/infrastructure/seeding/privacy-terms-seed.service.ts.
