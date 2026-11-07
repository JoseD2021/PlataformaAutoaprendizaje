import { Inject, Injectable } from '@nestjs/common';
import type { RoleDefinition } from '../../domain/entities/role-definition.entity';
import type { Permission } from '../../domain/enums/permission.enum';
import type { Role } from '../../domain/enums/role.enum';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { RoleNotFoundError } from '../errors/user.errors';

export interface UpdateRolePermissionsInput {
  role: Role;
  permissions: Permission[];
}

export interface UpdateRolePermissionsActor {
  roleRank: number;
}

@Injectable()
export class UpdateRolePermissionsUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(
    input: UpdateRolePermissionsInput,
    actor: UpdateRolePermissionsActor,
  ): Promise<RoleDefinition> {
    const roleDefinition = await this.roles.findByRole(input.role);

    if (!roleDefinition) {
      throw new RoleNotFoundError(input.role);
    }

    roleDefinition.updatePermissions(input.permissions, actor.roleRank);

    return this.roles.save(roleDefinition);
  }
}
