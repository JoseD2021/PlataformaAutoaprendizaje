import type { Role } from '../../../modules/users/domain/enums/role.enum';

export interface AccessTokenClaims {
  sub: string;
  sid: string;
  role: Role;
  type: 'access';
  iat?: number;
  exp?: number;
}

export interface RefreshTokenClaims {
  sub: string;
  sid: string;
  type: 'refresh';
  iat?: number;
  exp?: number;
}

export interface IssuedToken {
  token: string;
  expiresIn: number;
  expiresAt: Date;
}

export abstract class TokenService {
  abstract signAccessToken(input: {
    userId: string;
    sessionId: string;
    role: Role;
  }): Promise<IssuedToken>;
  abstract signRefreshToken(input: { userId: string; sessionId: string }): Promise<IssuedToken>;
  abstract verifyAccessToken(token: string): Promise<AccessTokenClaims>;
  abstract verifyRefreshToken(token: string): Promise<RefreshTokenClaims>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
