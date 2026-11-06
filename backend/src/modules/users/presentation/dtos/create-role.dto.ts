import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ROLE_SLUG_PATTERN } from '../../domain/constants/role-slug';
import { ALL_PERMISSIONS, Permission } from '../../domain/enums/permission.enum';
import type { Role } from '../../domain/enums/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    example: 'colaborador',
    maxLength: 32,
    description: 'Identificador único del rol en minúsculas.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(1, 32)
  @Matches(ROLE_SLUG_PATTERN, {
    message:
      'El identificador del rol debe comenzar con una letra y solo puede contener minúsculas, números, guiones y guiones bajos.',
  })
  role: Role;

  @ApiProperty({ example: 'Colaborador', minLength: 2, maxLength: 80 })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 80)
  name: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 1000,
    description: 'Debe ser estrictamente menor que la jerarquía del usuario que lo crea.',
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  rank: number;

  @ApiPropertyOptional({
    enum: Permission,
    isArray: true,
    example: [Permission.FAVORITES_MANAGE],
    description: 'Solo se pueden otorgar permisos que el creador ya posee.',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(ALL_PERMISSIONS.length)
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];
}
