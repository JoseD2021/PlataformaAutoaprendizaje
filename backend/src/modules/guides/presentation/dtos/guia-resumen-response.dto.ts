import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { GuideSummaryModel } from '../../application/models/guide-view.model';

export class GuiaResumenResponseDto {
  @ApiProperty({ example: 'enviar-correo-foto' })
  id: string;

  @ApiProperty({ example: 'Enviar un correo con una foto' })
  titulo: string;

  @ApiProperty({ example: 'correo' })
  categoriaId: string;

  @ApiProperty({ example: 4 })
  totalPasos: number;

  @ApiProperty({ example: 3 })
  minutosEstimados: number;

  @ApiProperty({ example: true })
  esMasPedida: boolean;

  @ApiPropertyOptional({ example: 'Importante en computadores públicos' })
  etiqueta?: string;

  static from(source: GuideSummaryModel): GuiaResumenResponseDto {
    const dto = new GuiaResumenResponseDto();
    dto.id = source.id;
    dto.titulo = source.title;
    dto.categoriaId = source.categoryId;
    dto.totalPasos = source.totalSteps;
    dto.minutosEstimados = source.estimatedMinutes;
    dto.esMasPedida = source.isMostRequested;
    dto.etiqueta = source.tag ?? undefined;

    return dto;
  }
}