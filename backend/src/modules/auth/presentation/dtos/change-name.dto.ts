import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class ChangeNameDto {
  @ApiProperty({ example: 'María Pérez', minLength: 2, maxLength: 120 })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 120)
  fullName: string;
}
