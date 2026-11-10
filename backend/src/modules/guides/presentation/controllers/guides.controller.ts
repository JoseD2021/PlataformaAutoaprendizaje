import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { GetGuideUseCase } from '../../application/use-cases/get-guide.use-case';
import { ListGuidesUseCase } from '../../application/use-cases/list-guides.use-case';
import { SearchGuidesUseCase } from '../../application/use-cases/search-guides.use-case';
import { GuiaDetalleResponseDto } from '../dtos/guia-detalle-response.dto';
import { GuiasBusquedaResponseDto } from '../dtos/guia-busqueda-response.dto';
import { SearchGuidesQueryDto } from '../dtos/guia-busqueda-query.dto';
import { GuideIdParamDto } from '../dtos/guide-id-param.dto';
import { ListGuidesQueryDto } from '../dtos/list-guides-query.dto';
import { PaginatedGuiasResponseDto } from '../dtos/paginated-guias-response.dto';

@ApiTags('Guías')
@Controller('guides')
export class GuidesController {
  constructor(
    private readonly listGuidesUseCase: ListGuidesUseCase,
    private readonly getGuideUseCase: GetGuideUseCase,
    private readonly searchGuidesUseCase: SearchGuidesUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Listar guías publicadas',
    description:
      'Paginado. Filtra por categoría (categoriaId) y por palabra clave en el título (q). Las más pedidas aparecen primero.',
  })
  @ApiOkResponse({ type: PaginatedGuiasResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  async list(@Query() query: ListGuidesQueryDto): Promise<PaginatedGuiasResponseDto> {
    const result = await this.listGuidesUseCase.execute({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoriaId,
      search: query.q,
    });

    return PaginatedGuiasResponseDto.from(result);
  }

  @Get('search')
  @Public()
  @ApiOperation({
    summary: 'Buscar guías publicadas con texto libre (tolera tildes y errores pequeños)',
  })
  @ApiOkResponse({ type: GuiasBusquedaResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  async search(@Query() query: SearchGuidesQueryDto): Promise<GuiasBusquedaResponseDto> {
    return this.searchGuidesUseCase.execute(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Ver una guía publicada con sus pasos' })
  @ApiOkResponse({ type: GuiaDetalleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async detail(@Param() params: GuideIdParamDto): Promise<GuiaDetalleResponseDto> {
    const guide = await this.getGuideUseCase.execute(params.id);

    return GuiaDetalleResponseDto.from(guide);
  }
}