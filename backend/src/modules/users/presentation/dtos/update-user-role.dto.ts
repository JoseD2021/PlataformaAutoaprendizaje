import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import { ROLE_SLUG_PATTERN } from '../../domain/constants/role-slug';
import type { Role } from '../../domain/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'personal_clena', maxLength: 32 })
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
}
