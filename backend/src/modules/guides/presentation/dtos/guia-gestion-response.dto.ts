import { ApiProperty } from '@nestjs/swagger';
import type {
  GuideManagementDetailModel,
  GuideManagementSummaryModel,
} from '../../application/models/guide-management.model';
import type { ListManagedGuidesResult } from '../../application/use-cases/list-managed-guides.use-case';
import { ESTADOS_GUIA, estadoDesdeStatus, type EstadoGuia } from './estado-guia';
import { GuiaDetalleResponseDto } from './guia-detalle-response.dto';
import { GuiaResumenResponseDto } from './guia-resumen-response.dto';

export class GuiaGestionResumenResponseDto extends GuiaResumenResponseDto {
  @ApiProperty({ enum: ESTADOS_GUIA, example: 'borrador' })
  estado: EstadoGuia;

  static from(source: GuideManagementSummaryModel): GuiaGestionResumenResponseDto {
    return Object.assign(new GuiaGestionResumenResponseDto(), GuiaResumenResponseDto.from(source), {
      estado: estadoDesdeStatus(source.status),
    });
  }
}

export class GuiaGestionDetalleResponseDto extends GuiaDetalleResponseDto {
  @ApiProperty({ enum: ESTADOS_GUIA, example: 'borrador' })
  estado: EstadoGuia;

  @ApiProperty({ example: 'imprimir impresora fotocopia hoja' })
  palabrasClave: string;

  static from(source: GuideManagementDetailModel): GuiaGestionDetalleResponseDto {
    return Object.assign(new GuiaGestionDetalleResponseDto(), GuiaDetalleResponseDto.from(source), {
      estado: estadoDesdeStatus(source.status),
      palabrasClave: source.searchKeywords,
    });
  }
}

export class PaginatedGuiasGestionResponseDto {
  @ApiProperty({ type: [GuiaGestionResumenResponseDto] })
  items: GuiaGestionResumenResponseDto[];

  @ApiProperty({ example: 5 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  static from(result: ListManagedGuidesResult): PaginatedGuiasGestionResponseDto {
    const dto = new PaginatedGuiasGestionResponseDto();
    dto.items = result.items.map((item) => GuiaGestionResumenResponseDto.from(item));
    dto.total = result.total;
    dto.page = result.page;
    dto.limit = result.limit;

    return dto;
  }
}