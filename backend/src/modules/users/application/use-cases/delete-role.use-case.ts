import { Inject, Injectable } from '@nestjs/common';
import type { Role } from '../../domain/enums/role.enum';
import { RESERVED_ROLES } from '../../domain/enums/role.enum';
import { CannotManageRoleError, ReservedRoleError } from '../../domain/errors/user.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { RoleInUseError, RoleNotFoundError } from '../errors/user.errors';

export interface DeleteRoleInput {
  role: Role;
}

export interface DeleteRoleActor {
  roleRank: number;
}

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: DeleteRoleInput, actor: DeleteRoleActor): Promise<void> {
    const roleDefinition = await this.roles.findByRole(input.role);

    if (!roleDefinition) {
      throw new RoleNotFoundError(input.role);
    }

    if (RESERVED_ROLES.includes(roleDefinition.role)) {
      throw new ReservedRoleError(roleDefinition.role);
    }

    if (roleDefinition.rank >= actor.roleRank) {
      throw new CannotManageRoleError(
        'Solo puedes eliminar roles con una jerarquía estrictamente inferior a la tuya.',
      );
    }

    if ((await this.users.countByRole(roleDefinition.role)) > 0) {
      throw new RoleInUseError(roleDefinition.role);
    }

    await this.roles.delete(roleDefinition.role);
  }
}
