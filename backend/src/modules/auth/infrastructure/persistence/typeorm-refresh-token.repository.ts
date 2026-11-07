import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
    const saved = await this.repository.save(RefreshTokenMapper.toOrm(refreshToken));

    return RefreshTokenMapper.toDomain(saved);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }
}
