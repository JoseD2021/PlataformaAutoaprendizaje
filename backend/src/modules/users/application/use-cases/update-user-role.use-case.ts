import { Inject, Injectable } from '@nestjs/common';
import type { Role } from '../../domain/enums/role.enum';
import { CannotAssignRoleError, CannotManageUserError } from '../../domain/errors/user.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { RoleNotFoundError, UserNotFoundError } from '../errors/user.errors';

export interface UpdateUserRoleInput {
  targetUserId: string;
  role: Role;
}

export interface UpdateUserRoleActor {
  id: string;
  roleRank: number;
}

@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
  ) {}

  async execute(input: UpdateUserRoleInput, actor: UpdateUserRoleActor) {
    const target = await this.users.findById(input.targetUserId);

    if (!target) {
      throw new UserNotFoundError();
    }

    if (target.id === actor.id) {
      throw new CannotManageUserError('No puedes cambiar tu propio rol.');
    }

    const currentRole = await this.roles.findByRole(target.role);

    if (!currentRole) {
      throw new RoleNotFoundError(target.role);
    }

    if (currentRole.rank > actor.roleRank) {
      throw new CannotManageUserError('No puedes administrar a un usuario con un rol superior al tuyo.');
    }

    const newRole = await this.roles.findByRole(input.role);

    if (!newRole) {
      throw new RoleNotFoundError(input.role);
    }

    if (newRole.rank > actor.roleRank) {
      throw new CannotAssignRoleError(input.role);
    }

    target.changeRole(newRole.role);

    return this.users.save(target);
  }
}
