import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { ROLE_SLUG_PATTERN } from '../../domain/constants/role-slug';
import type { Role } from '../../domain/enums/role.enum';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@clena.local', maxLength: 254 })
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(254)
  email: string;

  @ApiProperty({
    example: 'ClaveSegura123',
    minLength: 8,
    maxLength: 72,
    description: 'Debe incluir al menos una mayúscula, una minúscula y un número.',
  })
  @IsString()
  @Length(8, 72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe incluir al menos una mayúscula, una minúscula y un número.',
  })
  password: string;

  @ApiProperty({ example: 'María Pérez', minLength: 2, maxLength: 120 })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 120)
  fullName: string;

  @ApiPropertyOptional({
    example: 'usuario',
    maxLength: 32,
    description: 'Rol existente que se asignará. Por defecto, "usuario".',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsString()
  @Length(1, 32)
  @Matches(ROLE_SLUG_PATTERN, {
    message:
      'El identificador del rol debe comenzar con una letra y solo puede contener minúsculas, números, guiones y guiones bajos.',
  })
  role?: Role;
}
