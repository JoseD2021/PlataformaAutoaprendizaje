import type { RoleDefinition } from '../entities/role-definition.entity';
import type { Role } from '../enums/role.enum';

export abstract class RoleRepository {
  abstract findAll(): Promise<RoleDefinition[]>;
  abstract findByRole(role: Role): Promise<RoleDefinition | null>;
  abstract save(roleDefinition: RoleDefinition): Promise<RoleDefinition>;
  abstract delete(role: Role): Promise<void>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
