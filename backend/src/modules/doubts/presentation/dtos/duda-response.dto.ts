import { ApiProperty } from '@nestjs/swagger';
import type { DoubtModel } from '../../application/models/doubt-view.model';

export class DudaResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '¿Cómo puedo enviar un correo con una foto?' })
  duda: string;

  @ApiProperty({ example: 'Correo' })
  tema: string;

  @ApiProperty({ example: 3, description: 'Veces que se ha repetido la duda' })
  veces: number;

  @ApiProperty({ example: '2026-11-26T15:30:00.000Z' })
  ultimaVez: string;

  static from(source: DoubtModel): DudaResponseDto {
    const dto = new DudaResponseDto();
    dto.id = source.id;
    dto.duda = source.question;
    dto.tema = source.topic;
    dto.veces = source.times;
    dto.ultimaVez = source.lastAskedAt.toISOString();

    return dto;
  }
}
