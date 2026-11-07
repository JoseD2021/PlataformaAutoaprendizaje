import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_HASHER, TokenHasher } from '../../../../shared/application/ports/token-hasher.port';
import { TOKEN_SERVICE, TokenService } from '../../../../shared/application/ports/token-service.port';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';
import { InvalidTokenError } from '../errors/auth.errors';
import type { AuthResult } from '../models/auth-result.model';

export interface RefreshTokenInput {
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(TOKEN_HASHER) private readonly tokenHasher: TokenHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<AuthResult> {
    const claims = await this.tokenService.verifyRefreshToken(input.refreshToken);
    const session = await this.refreshTokens.findById(claims.sid);

    if (!session || session.userId !== claims.sub || !session.isActive()) {
      throw new InvalidTokenError();
    }

    if (!this.tokenHasher.matches(input.refreshToken, session.tokenHash)) {
      // Posible reutilización de un token ya rotado: se invalida la sesión.
      session.revoke();
      await this.refreshTokens.save(session);
      throw new InvalidTokenError();
    }

    const user = await this.users.findById(claims.sub);

    if (!user || !user.isActive) {
      throw new InvalidTokenError();
    }

    const access = await this.tokenService.signAccessToken({
      userId: user.id,
      sessionId: session.id,
      role: user.role,
    });
    const refresh = await this.tokenService.signRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    session.rotate(this.tokenHasher.hash(refresh.token), refresh.expiresAt);
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
