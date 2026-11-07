import { ApiProperty } from '@nestjs/swagger';
import type { GuideDetailModel } from '../../application/models/guide-view.model';
import { GuiaResumenResponseDto } from './guia-resumen-response.dto';
import { PasoGuiaResponseDto } from './paso-guia-response.dto';

export class GuiaDetalleResponseDto extends GuiaResumenResponseDto {
  @ApiProperty({ type: [PasoGuiaResponseDto] })
  pasos: PasoGuiaResponseDto[];

  static from(source: GuideDetailModel): GuiaDetalleResponseDto {
    return Object.assign(new GuiaDetalleResponseDto(), GuiaResumenResponseDto.from(source), {
      pasos: source.steps.map((step) => PasoGuiaResponseDto.from(step)),
    });
  }
}