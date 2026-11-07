import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import {
  type AccessTokenClaims,
  type IssuedToken,
  type RefreshTokenClaims,
  TokenService,
} from '../../../../shared/application/ports/token-service.port';
import { InvalidTokenError } from '../../application/errors/auth.errors';
import type { Role } from '../../../users/domain/enums/role.enum';

const DEFAULT_ACCESS_TTL_SECONDS = 900;
const DEFAULT_REFRESH_TTL_SECONDS = 604_800;

@Injectable()
export class JwtTokenService extends TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtlSeconds: number;
  private readonly refreshTtlSeconds: number;

  constructor(
    private readonly jwtService: JwtService,
    config: ConfigService,
  ) {
    super();

    this.accessSecret = config.get<string>('JWT_ACCESS_SECRET') ?? '';
    this.refreshSecret = config.get<string>('JWT_REFRESH_SECRET') ?? '';

    if (!this.accessSecret || !this.refreshSecret) {
      throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET son obligatorios.');
    }

    this.accessTtlSeconds = this.parseTtl(
      config.get<string>('JWT_ACCESS_TTL_SECONDS'),
      DEFAULT_ACCESS_TTL_SECONDS,
    );
    this.refreshTtlSeconds = this.parseTtl(
      config.get<string>('JWT_REFRESH_TTL_SECONDS'),
      DEFAULT_REFRESH_TTL_SECONDS,
    );
  }

  async signAccessToken(input: {
    userId: string;
    sessionId: string;
    role: Role;
  }): Promise<IssuedToken> {
    return this.sign(
      { sub: input.userId, sid: input.sessionId, role: input.role, type: 'access' },
      this.accessSecret,
      this.accessTtlSeconds,
    );
  }

  async signRefreshToken(input: { userId: string; sessionId: string }): Promise<IssuedToken> {
    return this.sign(
      { sub: input.userId, sid: input.sessionId, type: 'refresh' },
      this.refreshSecret,
      this.refreshTtlSeconds,
    );
  }

  async verifyAccessToken(token: string): Promise<AccessTokenClaims> {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenClaims>(token, {
        secret: this.accessSecret,
      });

      if (payload.type !== 'access' || !payload.sub) {
        throw new Error('Tipo de token inválido');
      }

      return payload;
    } catch {
      throw new InvalidTokenError();
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenClaims> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenClaims>(token, {
        secret: this.refreshSecret,
      });

      if (payload.type !== 'refresh' || !payload.sub || !payload.sid) {
        throw new Error('Tipo de token inválido');
      }

      return payload;
    } catch {
      throw new InvalidTokenError();
    }
  }

  private async sign(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: number,
  ): Promise<IssuedToken> {
    const token = await this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      { secret, expiresIn },
    );

    return {
      token,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    };
  }

  private parseTtl(value: string | undefined, fallback: number): number {
    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
