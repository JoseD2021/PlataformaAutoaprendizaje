import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import {
  PaginatedUsers,
  PaginationOptions,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { EmailAlreadyInUseError } from '../../application/errors/user.errors';
import { UserMapper } from './user.mapper';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { id } });

    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { email: email.trim().toLowerCase() } });

    return orm ? UserMapper.toDomain(orm) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repository.existsBy({ email: email.trim().toLowerCase() });
  }

  async save(user: User): Promise<User> {
    try {
      const saved = await this.repository.save(UserMapper.toOrm(user));

      return UserMapper.toDomain(saved);
    } catch (error) {
      if (TypeOrmUserRepository.isUniqueViolation(error)) {
        throw new EmailAlreadyInUseError(user.email);
      }

      throw error;
    }
  }

  async paginate(options: PaginationOptions): Promise<PaginatedUsers> {
    const [items, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return { items: items.map((item) => UserMapper.toDomain(item)), total };
  }

  async countByRole(role: string): Promise<number> {
    return this.repository.countBy({ role });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private static isUniqueViolation(error: unknown): boolean {
    const candidate = error as { code?: string; driverError?: { code?: string } };
    const code = candidate?.driverError?.code ?? candidate?.code;

    return code === '23505';
  }
}
