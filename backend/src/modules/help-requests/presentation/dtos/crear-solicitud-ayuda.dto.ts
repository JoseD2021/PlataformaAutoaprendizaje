import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { MAX_STATION_NUMBER } from '../../domain/entities/help-request.entity';

export class CrearSolicitudAyudaDto {
  @ApiPropertyOptional({ example: 5, description: 'Número del computador de la sala' })
  @IsOptional()
  @IsInt({ message: 'El número de puesto debe ser un número entero.' })
  @Min(1, { message: 'El número de puesto debe ser mayor que 0.' })
  @Max(MAX_STATION_NUMBER, { message: `El número de puesto no puede ser mayor que ${MAX_STATION_NUMBER}.` })
  puesto?: number;

  @ApiPropertyOptional({ example: 'enviar-correo-foto', description: 'Guía en la que se quedó' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'El id de la guía solo admite minúsculas, números y guiones.',
  })
  guiaId?: string;

  @ApiPropertyOptional({ example: 3, description: 'Paso de la guía en el que se quedó (desde 1)' })
  @IsOptional()
  @IsInt({ message: 'El paso debe ser un número entero.' })
  @Min(1, { message: 'El paso debe ser mayor que 0.' })
  paso?: number;
}
