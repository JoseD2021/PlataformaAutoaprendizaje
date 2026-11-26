import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'ClaveActual123',
    minLength: 1,
    maxLength: 72,
    description: 'Contraseña vigente del usuario.',
  })
  @IsString()
  @MinLength(1, { message: 'La contraseña actual es obligatoria.' })
  @MaxLength(72)
  currentPassword: string;

  @ApiProperty({
    example: 'ClaveNueva123',
    minLength: 8,
    maxLength: 72,
    description: 'Debe incluir al menos una mayúscula, una minúscula y un número.',
  })
  @IsString()
  @Length(8, 72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe incluir al menos una mayúscula, una minúscula y un número.',
  })
  newPassword: string;
}
