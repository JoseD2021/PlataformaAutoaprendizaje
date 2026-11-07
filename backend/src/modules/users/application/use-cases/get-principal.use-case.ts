import { Inject, Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { RoleNotFoundError } from '../errors/user.errors';

@Injectable()
export class GetPrincipalUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
  ) {}

  async execute(userId: string): Promise<AuthenticatedUser> {
    const user = await this.users.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('La sesión ya no es válida.');
    }

    const roleDefinition = await this.roles.findByRole(user.role);

    if (!roleDefinition) {
      throw new RoleNotFoundError(user.role);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      roleName: roleDefinition.name,
      roleRank: roleDefinition.rank,
      permissions: roleDefinition.permissions,
    };
  }
}
