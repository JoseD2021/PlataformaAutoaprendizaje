import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleInUseError } from '../../application/errors/user.errors';
import { RoleDefinition } from '../../domain/entities/role-definition.entity';
import type { Role } from '../../domain/enums/role.enum';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleMapper } from './role.mapper';
import { RoleOrmEntity } from './role.orm-entity';

@Injectable()
export class TypeOrmRoleRepository extends RoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repository: Repository<RoleOrmEntity>,
  ) {
    super();
  }

  async findAll(): Promise<RoleDefinition[]> {
    const roles = await this.repository.find({ order: { rank: 'ASC' } });

    return roles.map((role) => RoleMapper.toDomain(role));
  }

  async findByRole(role: Role): Promise<RoleDefinition | null> {
    const orm = await this.repository.findOne({ where: { role } });

    return orm ? RoleMapper.toDomain(orm) : null;
  }

  async save(roleDefinition: RoleDefinition): Promise<RoleDefinition> {
    const saved = await this.repository.save(RoleMapper.toOrm(roleDefinition));

    return RoleMapper.toDomain(saved);
  }

  async delete(role: Role): Promise<void> {
    try {
      await this.repository.delete({ role });
    } catch (error) {
      if (TypeOrmRoleRepository.isForeignKeyViolation(error)) {
        throw new RoleInUseError(role);
      }

      throw error;
    }
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
