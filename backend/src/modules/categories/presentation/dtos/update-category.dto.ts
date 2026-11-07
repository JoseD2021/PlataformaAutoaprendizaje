import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Documentos académicos', minLength: 2, maxLength: 80 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(2, 80)
  name?: string;

  @ApiPropertyOptional({ example: 'book-open', maxLength: 255 })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  iconName?: string;

  @ApiPropertyOptional({ example: 'Material académico y documentos' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
