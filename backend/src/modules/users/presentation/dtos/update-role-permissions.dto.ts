import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayUnique, IsArray, IsEnum } from 'class-validator';
import { ALL_PERMISSIONS, Permission } from '../../domain/enums/permission.enum';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    enum: Permission,
    isArray: true,
    example: [Permission.FAVORITES_MANAGE, Permission.HELP_REQUESTS_CREATE],
  })
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(ALL_PERMISSIONS.length)
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
