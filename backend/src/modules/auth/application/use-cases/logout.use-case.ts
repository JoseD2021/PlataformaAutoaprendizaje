import { Inject, Injectable, Optional } from '@nestjs/common';
import { SESSION_CACHE, SessionCache } from '../../../../shared/application/ports/session-cache.port';
import { TOKEN_SERVICE, TokenService } from '../../../../shared/application/ports/token-service.port';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';

export interface LogoutInput {
  refreshToken: string;
}

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
    @Optional() @Inject(SESSION_CACHE) private readonly sessionCache?: SessionCache,
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const claims = await this.tokenService.verifyRefreshToken(input.refreshToken);
    const session = await this.refreshTokens.findById(claims.sid);

    if (!session || session.userId !== claims.sub) {
      return;
    }

    session.revoke();
    await this.refreshTokens.save(session);
    this.sessionCache?.invalidate(session.id);
  }
}
