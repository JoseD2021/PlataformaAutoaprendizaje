import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionCache } from '../../../../shared/application/ports/session-cache.port';
import type { RefreshToken } from '../../domain/entities/refresh-token.entity';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';

interface CachedSession {
  session: RefreshToken;
  expiresAt: number;
}

const DEFAULT_SESSION_CACHE_TTL_SECONDS = 5;

@Injectable()
export class SessionCacheService extends SessionCache {
  private readonly cache = new Map<string, CachedSession>();
  private readonly ttlMilliseconds: number;

  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    config: ConfigService,
  ) {
    super();

    const configuredTtl = Number(config.get<string>('AUTH_SESSION_CACHE_TTL_SECONDS'));
    const ttlSeconds =
      Number.isFinite(configuredTtl) && configuredTtl > 0
        ? configuredTtl
        : DEFAULT_SESSION_CACHE_TTL_SECONDS;

    this.ttlMilliseconds = ttlSeconds * 1000;
  }

  async findActive(sessionId: string): Promise<RefreshToken | null> {
    const now = Date.now();
    const cached = this.cache.get(sessionId);

    if (cached) {
      if (cached.expiresAt > now && cached.session.isActive()) {
        return cached.session;
      }

      this.cache.delete(sessionId);
    }

    const session = await this.refreshTokens.findById(sessionId);

    if (!session || !session.isActive()) {
      return null;
    }

    this.cache.set(sessionId, {
      session,
      expiresAt: now + this.ttlMilliseconds,
    });

    return session;
  }

  invalidate(sessionId: string): void {
    this.cache.delete(sessionId);
  }
}
