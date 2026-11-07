import { Inject, Injectable } from '@nestjs/common';
import { CannotManageUserError } from '../../domain/errors/user.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { RoleNotFoundError, UserNotFoundError } from '../errors/user.errors';

export interface DeleteUserInput {
  targetUserId: string;
}

export interface DeleteUserActor {
  id: string;
  roleRank: number;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
  ) {}

  async execute(input: DeleteUserInput, actor: DeleteUserActor): Promise<void> {
    const target = await this.users.findById(input.targetUserId);

    if (!target) {
      throw new UserNotFoundError();
    }

    if (target.id === actor.id) {
      throw new CannotManageUserError(
        'No puedes eliminar tu propia cuenta desde este endpoint. Usa el cierre de cuenta.',
      );
    }

    const targetRole = await this.roles.findByRole(target.role);

    if (!targetRole) {
      throw new RoleNotFoundError(target.role);
    }

    if (targetRole.rank >= actor.roleRank) {
      throw new CannotManageUserError(
        'No puedes eliminar a un usuario con un rol igual o superior al tuyo.',
      );
    }

    await this.users.delete(target.id);
  }
}
