import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PASSWORD_HASHER, PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { TOKEN_HASHER, TokenHasher } from '../../../../shared/application/ports/token-hasher.port';
import { TOKEN_SERVICE, TokenService } from '../../../../shared/application/ports/token-service.port';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { Email } from '../../../users/domain/value-objects/email.vo';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';
import { InvalidCredentialsError } from '../errors/auth.errors';
import type { AuthResult } from '../models/auth-result.model';

export interface LoginInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_HASHER) private readonly tokenHasher: TokenHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<AuthResult> {
    const email = Email.create(input.email);
    const user = await this.users.findByEmail(email.value);
    const passwordMatches =
      user !== null && (await this.passwordHasher.compare(input.password, user.passwordHash));

    if (!user || !user.isActive || !passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const sessionId = randomUUID();
    const access = await this.tokenService.signAccessToken({
      userId: user.id,
      sessionId,
      role: user.role,
    });
    const refresh = await this.tokenService.signRefreshToken({
      userId: user.id,
      sessionId,
    });

    const session = RefreshToken.create({
      id: sessionId,
      userId: user.id,
      tokenHash: this.tokenHasher.hash(refresh.token),
      expiresAt: refresh.expiresAt,
      ipAddress: input.ipAddress?.slice(0, 64),
      userAgent: input.userAgent?.slice(0, 512),
    });

    await this.refreshTokens.save(session);

    return {
      user,
      tokens: {
        accessToken: access.token,
        refreshToken: refresh.token,
        tokenType: 'Bearer',
        accessTokenExpiresIn: access.expiresIn,
        refreshTokenExpiresIn: refresh.expiresIn,
      },
    };
  }
}
