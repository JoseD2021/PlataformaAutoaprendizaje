import { Inject, Injectable } from '@nestjs/common';
import type { RoleDefinition } from '../../domain/entities/role-definition.entity';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class ListRolesUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(): Promise<RoleDefinition[]> {
    const roles = await this.roles.findAll();

    return roles.sort((a, b) => a.rank - b.rank);
  }
}
