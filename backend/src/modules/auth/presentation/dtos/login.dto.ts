import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@clena.local' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'ClaveSegura123', maxLength: 72 })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;
}
