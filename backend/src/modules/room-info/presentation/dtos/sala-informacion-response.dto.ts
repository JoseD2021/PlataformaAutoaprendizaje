import { ApiProperty } from '@nestjs/swagger';
import type { RoomInfoModel } from '../../application/models/room-info-view.model';
import { HorarioSalaResponseDto } from './horario-sala-response.dto';

export class SalaInformacionResponseDto {
  @ApiProperty({ type: [HorarioSalaResponseDto] })
  horarios: HorarioSalaResponseDto[];

  @ApiProperty({
    type: [String],
    example: ['Pide ayuda a un monitor si te pierdes.', 'Mantén el volumen bajo o usa audífonos.'],
  })
  normas: string[];

  static from(source: RoomInfoModel): SalaInformacionResponseDto {
    const dto = new SalaInformacionResponseDto();
    dto.horarios = source.schedules.map((entry) => HorarioSalaResponseDto.from(entry));
    dto.normas = [...source.rules];

    return dto;
  }
}