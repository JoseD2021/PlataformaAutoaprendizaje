import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from '../../application/ports/password-hasher.port';
import { TOKEN_HASHER } from '../../application/ports/token-hasher.port';
import { BcryptPasswordHasher } from './bcrypt-password-hasher';
import { Sha256TokenHasher } from './sha256-token-hasher';

@Module({
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_HASHER, useClass: Sha256TokenHasher },
  ],
  exports: [PASSWORD_HASHER, TOKEN_HASHER],
})
export class SecurityModule {}
