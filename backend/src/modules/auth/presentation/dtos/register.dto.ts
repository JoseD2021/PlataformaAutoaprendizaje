import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@clena.local', maxLength: 254 })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
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

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario aceptó el aviso de privacidad vigente.',
  })
  @IsBoolean()
  @Equals(true, {
    message: 'Debes aceptar el aviso de privacidad para crear una cuenta.',
  })
  privacyTermsAccepted: boolean;

  @ApiProperty({
    example: '1.0',
    maxLength: 32,
    description:
      'Versión del aviso de privacidad que el usuario revisó y aceptó. Debe coincidir con la vigente.',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 32)
  privacyTermsVersion: string;
}
