import { ApiProperty } from '@nestjs/swagger';
import type { ScheduleModel } from '../../application/models/room-info-view.model';

export class HorarioSalaResponseDto {
  @ApiProperty({ example: 'Lunes a viernes' })
  dias: string;

  @ApiProperty({ example: '8:00 a.m. a 5:00 p.m.' })
  horas: string;

  static from(source: ScheduleModel): HorarioSalaResponseDto {
    const dto = new HorarioSalaResponseDto();
    dto.dias = source.days;
    dto.horas = source.hours;

    return dto;
  }
}