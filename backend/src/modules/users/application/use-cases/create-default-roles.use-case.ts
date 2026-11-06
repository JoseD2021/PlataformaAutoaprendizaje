import { Inject, Injectable } from '@nestjs/common';
import { RoleDefinition } from '../../domain/entities/role-definition.entity';
import { DEFAULT_ROLES } from '../../domain/constants/default-roles';
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from '../../domain/repositories/role.repository';

@Injectable()
export class CreateDefaultRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
  ) {}

  async execute(): Promise<RoleDefinition[]> {
    const existingRoles = new Map(
      (await this.roles.findAll()).map((roleDefinition) => [
        roleDefinition.role,
        roleDefinition,
      ]),
    );

    for (const defaultRole of DEFAULT_ROLES) {
      if (existingRoles.has(defaultRole.role)) {
        continue;
      }

      const roleDefinition = RoleDefinition.create(defaultRole);
      const savedRole = await this.roles.save(roleDefinition);
      existingRoles.set(savedRole.role, savedRole);
    }

    return DEFAULT_ROLES.map((defaultRole) =>
      existingRoles.get(defaultRole.role),
    ).filter((role): role is RoleDefinition => role !== undefined);
  }
}
