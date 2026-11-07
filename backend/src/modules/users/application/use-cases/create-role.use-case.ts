import { Inject, Injectable } from '@nestjs/common';
import { RoleDefinition } from '../../domain/entities/role-definition.entity';
import type { Permission } from '../../domain/enums/permission.enum';
import type { Role } from '../../domain/enums/role.enum';
import { CannotGrantPermissionsError, CannotManageRoleError } from '../../domain/errors/user.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { RoleAlreadyExistsError } from '../errors/user.errors';

export interface CreateRoleInput {
  role: Role;
  name: string;
  rank: number;
  permissions?: Permission[];
}

export interface CreateRoleActor {
  roleRank: number;
  permissions: Permission[];
}

@Injectable()
export class CreateRoleUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(input: CreateRoleInput, actor: CreateRoleActor): Promise<RoleDefinition> {
    const roleDefinition = RoleDefinition.create({
      role: input.role,
      name: input.name,
      rank: input.rank,
      permissions: input.permissions,
    });

    if (roleDefinition.rank >= actor.roleRank) {
      throw new CannotManageRoleError(
        'Solo puedes crear roles con una jerarquía estrictamente inferior a la tuya.',
      );
    }

    const grantedPermissions = roleDefinition.permissions.filter(
      (permission) => !actor.permissions.includes(permission),
    );

    if (grantedPermissions.length > 0) {
      throw new CannotGrantPermissionsError(grantedPermissions);
    }

    if (await this.roles.findByRole(roleDefinition.role)) {
      throw new RoleAlreadyExistsError(roleDefinition.role);
    }

    return this.roles.save(roleDefinition);
  }
}
