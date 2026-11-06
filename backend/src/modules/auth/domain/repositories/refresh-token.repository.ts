import type { RefreshToken } from '../entities/refresh-token.entity';

export abstract class RefreshTokenRepository {
  abstract findById(id: string): Promise<RefreshToken | null>;
  abstract save(refreshToken: RefreshToken): Promise<RefreshToken>;
  abstract revokeAllForUser(userId: string): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');
