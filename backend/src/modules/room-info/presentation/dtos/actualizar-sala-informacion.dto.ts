import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { MAX_ROOM_RULES, MAX_ROOM_SCHEDULES } from '../../domain/constants/room-info.limits';
import { HorarioSalaRequestDto } from './horario-sala-request.dto';

export class ActualizarSalaInformacionDto {
  @ApiProperty({
    type: [HorarioSalaRequestDto],
    maxItems: MAX_ROOM_SCHEDULES,
    description: 'Lista completa de horarios. El orden del arreglo es el orden de visualización.',
  })
  @IsArray()
  @ArrayMaxSize(MAX_ROOM_SCHEDULES)
  @ValidateNested({ each: true })
  @Type(() => HorarioSalaRequestDto)
  horarios: HorarioSalaRequestDto[];

  @ApiProperty({
    type: [String],
    maxItems: MAX_ROOM_RULES,
    description: 'Lista completa de normas. El orden del arreglo es el orden de visualización.',
  })
  @IsArray()
  @ArrayMaxSize(MAX_ROOM_RULES)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(300, { each: true })
  normas: string[];
}