import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HorarioSalaRequestDto {
  @ApiProperty({ example: 'Lunes a viernes', maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  dias: string;

  @ApiProperty({ example: '8:00 a.m. a 5:00 p.m.', maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  horas: string;
}