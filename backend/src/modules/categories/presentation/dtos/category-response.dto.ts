import { ApiProperty } from '@nestjs/swagger';
import type { Category } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Documentos' })
  name: string;

  @ApiProperty({ example: 'documentos' })
  slug: string;

  @ApiProperty({ example: 'book-open' })
  iconName: string;

  @ApiProperty({ example: 'Material de estudio y documentos' })
  description: string;

  @ApiProperty({ example: false })
  isFeatured: boolean;

  static from(category: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.slug = category.slug;
    dto.iconName = category.iconName;
    dto.description = category.description;
    dto.isFeatured = category.isFeatured;

    return dto;
  }
}
