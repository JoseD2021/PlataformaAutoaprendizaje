import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListGuidesQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Id de la categoría', example: 'correo' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  categoriaId?: string;

  @ApiPropertyOptional({
    description: 'Palabra clave a buscar en el título de la guía',
    example: 'correo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}