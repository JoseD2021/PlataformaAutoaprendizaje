import type { User } from '../../../users/domain/entities/user.entity';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}
