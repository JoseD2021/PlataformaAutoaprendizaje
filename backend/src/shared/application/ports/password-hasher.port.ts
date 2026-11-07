export abstract class PasswordHasher {
  abstract hash(plainPassword: string): Promise<string>;
  abstract compare(plainPassword: string, passwordHash: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
