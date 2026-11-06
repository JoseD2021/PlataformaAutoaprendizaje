import { ApiProperty } from '@nestjs/swagger';
import type { RoleDefinition } from '../../domain/entities/role-definition.entity';
import type { Permission } from '../../domain/enums/permission.enum';
import type { Role } from '../../domain/enums/role.enum';

export class RoleResponseDto {
  @ApiProperty({ example: 'administrador' })
  role: Role;

  @ApiProperty({ example: 'Administrador' })
  name: string;

  @ApiProperty({ example: 30 })
  rank: number;

  @ApiProperty({ isArray: true, example: ['users:create', 'roles:update-permissions'] })
  permissions: Permission[];

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  static from(role: RoleDefinition): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.role = role.role;
    dto.name = role.name;
    dto.rank = role.rank;
    dto.permissions = role.permissions;
    dto.updatedAt = role.updatedAt;

    return dto;
  }
}
