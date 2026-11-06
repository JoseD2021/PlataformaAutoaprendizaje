import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Documentos', minLength: 2, maxLength: 80 })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(2, 80)
  name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icons/docs.svg',
    maxLength: 255,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  iconUrl?: string;

  @ApiPropertyOptional({ example: 1, minimum: 0, maximum: 100000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  displayOrder?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}