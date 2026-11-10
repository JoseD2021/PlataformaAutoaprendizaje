import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class PasoGuiaRequestDto {
  @ApiProperty({ example: 'Redactar', maxLength: 20, description: 'Una palabra para la barra de progreso' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tituloCorto: string;

  @ApiProperty({ example: 'Haz clic en el botón Redactar', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  accion: string;

  @ApiProperty({ example: 'Está arriba a la izquierda y tiene un lápiz dibujado.', maxLength: 2000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  descripcion: string;

  @ApiPropertyOptional({ example: '/img/redactar.png', maxLength: 512 })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  imagenUrl?: string;

  @ApiPropertyOptional({
    example: 'Así se verá en tu pantalla.',
    maxLength: 255,
    description: 'Requiere imagenUrl',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pieImagen?: string;
}