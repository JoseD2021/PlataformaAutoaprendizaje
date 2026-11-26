import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ActualizarMasPedidaGuiaDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  esMasPedida: boolean;
}
