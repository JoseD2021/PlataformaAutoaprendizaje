import type { Role } from '../enums/role.enum';
import { InvalidUserError } from '../errors/user.errors';
import { Email } from '../value-objects/email.vo';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 120;

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  privacyTermsAcceptedAt: Date | null;
  privacyTermsVersion: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
  isActive?: boolean;
  privacyTermsAcceptedAt?: Date | null;
  privacyTermsVersion?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: CreateUserProps): User {
    const email = Email.create(props.email);
    const fullName = User.normalizeFullName(props.fullName);

    if (!props.id) {
      throw new InvalidUserError('El usuario debe tener un identificador.');
    }

    if (!props.passwordHash) {
      throw new InvalidUserError('El usuario debe tener una contraseña cifrada.');
    }

    const now = props.createdAt ?? new Date();
    const privacyTermsAcceptedAt = props.privacyTermsAcceptedAt ?? null;
    const privacyTermsVersion = User.normalizePrivacyTermsVersion(props.privacyTermsVersion);

    if (privacyTermsAcceptedAt !== null && Number.isNaN(privacyTermsAcceptedAt.getTime())) {
      throw new InvalidUserError('La fecha de aceptación del aviso de privacidad no es válida.');
    }

    if ((privacyTermsAcceptedAt === null) !== (privacyTermsVersion === null)) {
      throw new InvalidUserError(
        'La aceptación del aviso de privacidad debe incluir la fecha y la versión.',
      );
    }

    return new User({
      id: props.id,
      email: email.value,
      passwordHash: props.passwordHash,
      fullName,
      role: props.role,
      isActive: props.isActive ?? true,
      privacyTermsAcceptedAt,
      privacyTermsVersion,
      createdAt: now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  static rehydrate(props: UserProps): User {
    return new User({ ...props });
  }

  private static normalizeFullName(rawFullName: string): string {
    const fullName = typeof rawFullName === 'string' ? rawFullName.trim() : '';

    if (fullName.length < MIN_NAME_LENGTH || fullName.length > MAX_NAME_LENGTH) {
      throw new InvalidUserError(
        `El nombre completo debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres.`,
      );
    }

    return fullName;
  }

  private static normalizePrivacyTermsVersion(rawVersion: string | null | undefined): string | null {
    if (typeof rawVersion !== 'string') {
      return null;
    }

    const version = rawVersion.trim();

    return version.length > 0 ? version : null;
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get role(): Role {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get privacyTermsAcceptedAt(): Date | null {
    return this.props.privacyTermsAcceptedAt;
  }

  get privacyTermsVersion(): string | null {
    return this.props.privacyTermsVersion;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeRole(role: Role, now: Date = new Date()): void {
    if (role === this.props.role) {
      return;
    }

    this.props.role = role;
    this.props.updatedAt = now;
  }
}
