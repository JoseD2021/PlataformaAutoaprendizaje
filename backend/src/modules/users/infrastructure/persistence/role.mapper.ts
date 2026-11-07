import { RoleDefinition } from '../../domain/entities/role-definition.entity';
import type { Permission } from '../../domain/enums/permission.enum';
import type { Role } from '../../domain/enums/role.enum';
import { RoleOrmEntity } from './role.orm-entity';

export class RoleMapper {
  static toDomain(orm: RoleOrmEntity): RoleDefinition {
    return RoleDefinition.rehydrate({
      role: orm.role as Role,
      name: orm.name,
      rank: orm.rank,
      permissions: (orm.permissions ?? []) as Permission[],
      updatedAt: new Date(orm.updatedAt),
    });
  }

  static toOrm(roleDefinition: RoleDefinition): RoleOrmEntity {
    const orm = new RoleOrmEntity();
    orm.role = roleDefinition.role;
    orm.name = roleDefinition.name;
    orm.rank = roleDefinition.rank;
    orm.permissions = roleDefinition.permissions;
    orm.updatedAt = roleDefinition.updatedAt;

    return orm;
  }
}
