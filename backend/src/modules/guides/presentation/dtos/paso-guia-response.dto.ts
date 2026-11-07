import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { GuideStepModel } from '../../application/models/guide-view.model';

export class PasoGuiaResponseDto {
  @ApiProperty({ example: 1, description: 'Posición del paso, empieza en 1' })
  orden: number;

  @ApiProperty({ example: 'Redactar', description: 'Una palabra para la barra de progreso' })
  tituloCorto: string;

  @ApiProperty({ example: 'Haz clic en el botón Redactar' })
  accion: string;

  @ApiProperty({ example: 'Está arriba a la izquierda y tiene un lápiz dibujado.' })
  descripcion: string;

  @ApiPropertyOptional({ example: '/img/redactar.png' })
  imagenUrl?: string;

  @ApiPropertyOptional({ example: 'Así se verá en tu pantalla. Busca el recuadro rojo.' })
  pieImagen?: string;

  static from(source: GuideStepModel): PasoGuiaResponseDto {
    const dto = new PasoGuiaResponseDto();
    dto.orden = source.position;
    dto.tituloCorto = source.shortTitle;
    dto.accion = source.action;
    dto.descripcion = source.description;
    dto.imagenUrl = source.imageUrl ?? undefined;
    dto.pieImagen = source.imageCaption ?? undefined;

    return dto;
  }
}