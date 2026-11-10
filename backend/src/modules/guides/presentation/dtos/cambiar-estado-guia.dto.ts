import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { ESTADOS_GUIA, type EstadoGuia } from './estado-guia';

export class CambiarEstadoGuiaDto {
  @ApiProperty({ enum: ESTADOS_GUIA, example: 'publicada' })
  @IsIn(ESTADOS_GUIA)
  estado: EstadoGuia;
}