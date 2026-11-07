import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

export class RefreshTokenMapper {
  static toDomain(orm: RefreshTokenOrmEntity): RefreshToken {
    return RefreshToken.rehydrate({
      id: orm.id,
      userId: orm.userId,
      tokenHash: orm.tokenHash,
      expiresAt: new Date(orm.expiresAt),
      lastUsedAt: new Date(orm.lastUsedAt),
      createdAt: new Date(orm.createdAt),
      revokedAt: orm.revokedAt ? new Date(orm.revokedAt) : null,
      ipAddress: orm.ipAddress,
      userAgent: orm.userAgent,
    });
  }

  static toOrm(refreshToken: RefreshToken): RefreshTokenOrmEntity {
    const orm = new RefreshTokenOrmEntity();
    orm.id = refreshToken.id;
    orm.userId = refreshToken.userId;
    orm.tokenHash = refreshToken.tokenHash;
    orm.expiresAt = refreshToken.expiresAt;
    orm.revokedAt = refreshToken.revokedAt;
    orm.lastUsedAt = refreshToken.lastUsedAt;
    orm.createdAt = refreshToken.createdAt;
    orm.ipAddress = refreshToken.ipAddress ?? null;
    orm.userAgent = refreshToken.userAgent ?? null;

    return orm;
  }
}
