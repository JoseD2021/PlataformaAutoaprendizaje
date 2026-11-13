import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { InvalidTokenError } from '../../application/errors/auth.errors';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { RefreshTokenMapper } from './refresh-token.mapper';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

@Injectable()
export class TypeOrmRefreshTokenRepository extends RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repository: Repository<RefreshTokenOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<RefreshToken | null> {
    const orm = await this.repository.findOne({ where: { id } });

    return orm ? RefreshTokenMapper.toDomain(orm) : null;
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    try {
      const saved = await this.repository.save(
        RefreshTokenMapper.toOrm(refreshToken),
      );

      return RefreshTokenMapper.toDomain(saved);
    } catch (error) {
      if (TypeOrmRefreshTokenRepository.isForeignKeyViolation(error)) {
        // El usuario de la sesión pudo eliminarse entre la validación y el guardado.
        throw new InvalidTokenError();
      }

      throw error;
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private static isForeignKeyViolation(error: unknown): boolean {
    const candidate = error as {
      code?: string;
      driverError?: { code?: string };
    };
    const code = candidate?.driverError?.code ?? candidate?.code;

    return code === '23503';
  }
}
