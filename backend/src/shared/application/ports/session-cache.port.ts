import type { RefreshToken } from '../../../modules/auth/domain/entities/refresh-token.entity';

export abstract class SessionCache {
  abstract findActive(sessionId: string): Promise<RefreshToken | null>;
  abstract invalidate(sessionId: string): void;
}

export const SESSION_CACHE = Symbol('SESSION_CACHE');
