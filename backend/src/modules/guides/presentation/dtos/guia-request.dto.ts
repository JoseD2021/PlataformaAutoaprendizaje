import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MAX_GUIDE_STEPS } from '../../domain/constants/guide.limits';
import { PasoGuiaRequestDto } from './paso-guia-request.dto';

export class GuiaRequestDto {
  @ApiProperty({ example: 'Enviar un correo con una foto', maxLength: 160 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  titulo: string;

  @ApiProperty({ format: 'uuid', description: 'Id de la categoría (uuid)' })
  @IsUUID()
  categoriaId: string;

  @ApiProperty({ example: 3, minimum: 1, maximum: 240 })
  @IsInt()
  @Min(1)
  @Max(240)
  minutosEstimados: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  esMasPedida?: boolean;

  @ApiPropertyOptional({ example: 'Importante en computadores públicos', maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  etiqueta?: string;

  @ApiPropertyOptional({
    example: 'imprimir impresora fotocopia hoja',
    maxLength: 1000,
    description:
      'Palabras extra para que la guía aparezca en las búsquedas. El sistema agrega solas las del título y los sinónimos. En el PUT, si se omite se conservan las actuales, y con "" se borran las manuales.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  palabrasClave?: string;

  @ApiProperty({
    type: [PasoGuiaRequestDto],
    maxItems: MAX_GUIDE_STEPS,
    description: 'Pasos completos. El orden del arreglo es el orden de los pasos.',
  })
  @IsArray()
  @ArrayMaxSize(MAX_GUIDE_STEPS)
  @ValidateNested({ each: true })
  @Type(() => PasoGuiaRequestDto)
  pasos: PasoGuiaRequestDto[];
}