import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidPrivacyTermsError extends DomainError {
  constructor(message: string) {
    super(message, 'validation');
  }
}

export interface PrivacyTermsSectionProps {
  title: string;
  paragraphs: string[];
}

export interface PrivacyTermsProps {
  id: string;
  version: string;
  effectiveDate: string;
  title: string;
  sections: PrivacyTermsSectionProps[];
}

export class PrivacyTermsSection {
  readonly title: string;
  readonly paragraphs: string[];

  private constructor(props: PrivacyTermsSectionProps) {
    this.title = props.title;
    this.paragraphs = props.paragraphs;
  }

  static create(props: PrivacyTermsSectionProps): PrivacyTermsSection {
    const title = props.title?.trim();
    const paragraphs = Array.isArray(props.paragraphs)
      ? props.paragraphs.map((p) => p?.trim()).filter((p): p is string => Boolean(p))
      : [];

    if (!title) throw new InvalidPrivacyTermsError('El título de la sección es obligatorio');
    if (title.length > 160)
      throw new InvalidPrivacyTermsError('El título de la sección no puede superar 160 caracteres');
    if (paragraphs.length === 0)
      throw new InvalidPrivacyTermsError('Cada sección debe tener al menos un párrafo');
    if (paragraphs.some((p) => p.length > 1000))
      throw new InvalidPrivacyTermsError('Cada párrafo no puede superar 1000 caracteres');

    return new PrivacyTermsSection({ title, paragraphs });
  }
}

export class PrivacyTerms {
  private constructor(private readonly props: PrivacyTermsProps) {}

  static create(props: PrivacyTermsProps): PrivacyTerms {
    const id = props.id?.trim();
    const version = props.version?.trim();
    const effectiveDate = props.effectiveDate?.trim();
    const title = props.title?.trim();
    const sections = Array.isArray(props.sections)
      ? props.sections.map((s) => PrivacyTermsSection.create(s))
      : [];

    if (!id) throw new InvalidPrivacyTermsError('El identificador es obligatorio');
    if (!version) throw new InvalidPrivacyTermsError('La versión es obligatoria');
    if (version.length > 32)
      throw new InvalidPrivacyTermsError('La versión no puede superar 32 caracteres');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate ?? ''))
      throw new InvalidPrivacyTermsError('La fecha de vigencia debe tener formato YYYY-MM-DD');
    if (!title) throw new InvalidPrivacyTermsError('El título es obligatorio');
    if (title.length > 160)
      throw new InvalidPrivacyTermsError('El título no puede superar 160 caracteres');
    if (sections.length === 0)
      throw new InvalidPrivacyTermsError('Debe existir al menos una sección');

    return new PrivacyTerms({
      id,
      version,
      effectiveDate,
      title,
      sections: sections.map((s) => ({ title: s.title, paragraphs: [...s.paragraphs] })),
    });
  }

  get id(): string {
    return this.props.id;
  }
  get version(): string {
    return this.props.version;
  }
  get effectiveDate(): string {
    return this.props.effectiveDate;
  }
  get title(): string {
    return this.props.title;
  }
  get sections(): PrivacyTermsSectionProps[] {
    return this.props.sections.map((s) => ({ title: s.title, paragraphs: [...s.paragraphs] }));
  }
}
