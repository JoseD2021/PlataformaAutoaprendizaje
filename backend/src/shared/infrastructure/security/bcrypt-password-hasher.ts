import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  private readonly rounds: number;

  constructor(config: ConfigService) {
    super();
    const configured = Number(config.get<string>('BCRYPT_ROUNDS') ?? 12);
    this.rounds = Number.isInteger(configured) ? Math.min(15, Math.max(4, configured)) : 12;
  }

  hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.rounds);
  }

  compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
