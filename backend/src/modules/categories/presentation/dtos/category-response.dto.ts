import { ApiProperty } from '@nestjs/swagger';
import type { Category } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Documentos' })
  name: string;

  @ApiProperty({ example: 'documentos' })
  slug: string;

  @ApiProperty({ example: 'https://example.com/icons/docs.svg' })
  iconUrl: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  static from(category: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.slug = category.slug;
    dto.iconUrl = category.iconUrl;
    dto.displayOrder = category.displayOrder;
    dto.isActive = category.isActive;

    return dto;
  }
}
