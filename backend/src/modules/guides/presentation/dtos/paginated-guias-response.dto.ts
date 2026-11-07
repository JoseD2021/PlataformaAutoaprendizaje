import { ApiProperty } from '@nestjs/swagger';
import type { ListGuidesResult } from '../../application/use-cases/list-guides.use-case';
import { GuiaResumenResponseDto } from './guia-resumen-response.dto';

export class PaginatedGuiasResponseDto {
  @ApiProperty({ type: [GuiaResumenResponseDto] })
  items: GuiaResumenResponseDto[];

  @ApiProperty({ example: 5 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  static from(result: ListGuidesResult): PaginatedGuiasResponseDto {
    const dto = new PaginatedGuiasResponseDto();
    dto.items = result.items.map((item) => GuiaResumenResponseDto.from(item));
    dto.total = result.total;
    dto.page = result.page;
    dto.limit = result.limit;

    return dto;
  }
}