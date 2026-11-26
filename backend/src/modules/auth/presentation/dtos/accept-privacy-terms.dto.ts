import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Equals } from 'class-validator';

export class AcceptPrivacyTermsDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @Equals(true, { message: 'Debes aceptar el aviso de privacidad para continuar.' })
  privacyTermsAccepted: boolean;

  @ApiProperty({ example: '1.1', maxLength: 32 })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 32)
  privacyTermsVersion: string;
}
