import { Inject, Injectable } from '@nestjs/common';
import { permisosIncompatiblesConRango } from '../../domain/constants/permission-rank';
import type { RoleDefinition } from '../../domain/entities/role-definition.entity';
import type { Permission } from '../../domain/enums/permission.enum';
import type { Role } from '../../domain/enums/role.enum';
import { CannotGrantPermissionsError, PermissionRankTooHighError } from '../../domain/errors/user.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { RoleNotFoundError } from '../errors/user.errors';

export interface UpdateRolePermissionsInput {
  role: Role;
  permissions: Permission[];
}

export interface UpdateRolePermissionsActor {
  roleRank: number;
  permissions: Permission[];
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

    const incompatibles = permisosIncompatiblesConRango(roleDefinition.rank, input.permissions);

    if (incompatibles.length > 0) {
      throw new PermissionRankTooHighError(incompatibles, roleDefinition.rank);
    }

    const noOtorgables = input.permissions.filter(
      (permission) => !actor.permissions.includes(permission),
    );

    if (noOtorgables.length > 0) {
      throw new CannotGrantPermissionsError(noOtorgables);
    }

    roleDefinition.updatePermissions(input.permissions, actor.roleRank);

    return this.roles.save(roleDefinition);
  }
}
