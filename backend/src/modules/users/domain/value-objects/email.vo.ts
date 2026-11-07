import { InvalidEmailError } from '../errors/user.errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export class Email {
  private constructor(readonly value: string) {}

  static create(rawEmail: string): Email {
    if (typeof rawEmail !== 'string') {
      throw new InvalidEmailError();
    }

    const normalized = rawEmail.trim().toLowerCase();

    if (!normalized || normalized.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(normalized)) {
      throw new InvalidEmailError();
    }

    return new Email(normalized);
  }
}
