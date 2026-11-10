import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import type { GuideInput } from '../../application/models/guide-input';
import { ChangeGuideStatusUseCase } from '../../application/use-cases/change-guide-status.use-case';
import { CreateGuideUseCase } from '../../application/use-cases/create-guide.use-case';
import { DeleteGuideUseCase } from '../../application/use-cases/delete-guide.use-case';
import { GetManagedGuideUseCase } from '../../application/use-cases/get-managed-guide.use-case';
import { ListManagedGuidesUseCase } from '../../application/use-cases/list-managed-guides.use-case';
import { UpdateGuideUseCase } from '../../application/use-cases/update-guide.use-case';
import { CambiarEstadoGuiaDto } from '../dtos/cambiar-estado-guia.dto';
import { statusDesdeEstado } from '../dtos/estado-guia';
import {
  GuiaGestionDetalleResponseDto,
  PaginatedGuiasGestionResponseDto,
} from '../dtos/guia-gestion-response.dto';
import { GuiaRequestDto } from '../dtos/guia-request.dto';
import { GuideIdParamDto } from '../dtos/guide-id-param.dto';
import { ListManagedGuidesQueryDto } from '../dtos/list-managed-guides-query.dto';

function toGuideInput(dto: GuiaRequestDto): GuideInput {
  return {
    title: dto.titulo,
    categoryId: dto.categoriaId,
    estimatedMinutes: dto.minutosEstimados,
    isMostRequested: dto.esMasPedida,
    tag: dto.etiqueta,
    steps: dto.pasos.map((paso) => ({
      shortTitle: paso.tituloCorto,
      action: paso.accion,
      description: paso.descripcion,
      imageUrl: paso.imagenUrl,
      imageCaption: paso.pieImagen,
    })),
    keywords: dto.palabrasClave,
  };
}

@ApiTags('Guías (gestión)')
@ApiBearerAuth('access-token')
@Controller('management/guides')
export class GuidesManagementController {
  constructor(
    private readonly listManagedGuides: ListManagedGuidesUseCase,
    private readonly getManagedGuide: GetManagedGuideUseCase,
    private readonly createGuide: CreateGuideUseCase,
    private readonly updateGuide: UpdateGuideUseCase,
    private readonly changeGuideStatus: ChangeGuideStatusUseCase,
    private readonly deleteGuide: DeleteGuideUseCase,
  ) {}

  @Get()
  @RequirePermissions(Permission.GUIDES_MANAGE)
  @ApiOperation({ summary: 'Listar todas las guías, incluidos los borradores' })
  @ApiOkResponse({ type: PaginatedGuiasGestionResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async list(
    @Query() query: ListManagedGuidesQueryDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<PaginatedGuiasGestionResponseDto> {
    const result = await this.listManagedGuides.execute(
      {
        page: query.page,
        limit: query.limit,
        categoryId: query.categoriaId,
        search: query.q,
        status: query.estado ? statusDesdeEstado(query.estado) : undefined,
      },
      { permissions: actor.permissions },
    );

    return PaginatedGuiasGestionResponseDto.from(result);
  }

  @Get(':id')
  @RequirePermissions(Permission.GUIDES_MANAGE)
  @ApiOperation({ summary: 'Ver una guía con su estado, publicada o no' })
  @ApiOkResponse({ type: GuiaGestionDetalleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async detail(
    @Param() params: GuideIdParamDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<GuiaGestionDetalleResponseDto> {
    const guide = await this.getManagedGuide.execute(params.id, { permissions: actor.permissions });

    return GuiaGestionDetalleResponseDto.from(guide);
  }

  @Post()
  @RequirePermissions(Permission.GUIDES_CREATE)
  @ApiOperation({
    summary: 'Crear una guía en borrador',
    description:
      'El identificador se genera desde el título y no cambia al editar. Para mostrarla al público hay que publicarla.',
  })
  @ApiCreatedResponse({ type: GuiaGestionDetalleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async create(
    @Body() dto: GuiaRequestDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<GuiaGestionDetalleResponseDto> {
    const guide = await this.createGuide.execute(toGuideInput(dto), {
      permissions: actor.permissions,
    });

    return GuiaGestionDetalleResponseDto.from(guide);
  }

  @Put(':id')
  @RequirePermissions(Permission.GUIDES_MANAGE)
  @ApiOperation({
    summary: 'Reemplazar una guía y sus pasos',
    description:
      'Reemplaza los datos y la lista completa de pasos; el orden del arreglo es el orden de los pasos. Si esMasPedida o etiqueta se omiten, se restablecen (false y sin etiqueta). El estado no cambia, y una guía publicada no puede quedar sin pasos.',
  })
  @ApiOkResponse({ type: GuiaGestionDetalleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async update(
    @Param() params: GuideIdParamDto,
    @Body() dto: GuiaRequestDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<GuiaGestionDetalleResponseDto> {
    const guide = await this.updateGuide.execute(params.id, toGuideInput(dto), {
      permissions: actor.permissions,
    });

    return GuiaGestionDetalleResponseDto.from(guide);
  }

  @Patch(':id/status')
  @RequirePermissions(Permission.GUIDES_MANAGE)
  @ApiOperation({
    summary: 'Publicar o despublicar una guía',
    description: 'Publicar exige que la guía tenga al menos un paso.',
  })
  @ApiOkResponse({ type: GuiaGestionDetalleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async changeStatus(
    @Param() params: GuideIdParamDto,
    @Body() dto: CambiarEstadoGuiaDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<GuiaGestionDetalleResponseDto> {
    const guide = await this.changeGuideStatus.execute(
      params.id,
      statusDesdeEstado(dto.estado),
      { permissions: actor.permissions },
    );

    return GuiaGestionDetalleResponseDto.from(guide);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.GUIDES_MANAGE)
  @ApiOperation({ summary: 'Eliminar una guía y sus pasos' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async remove(
    @Param() params: GuideIdParamDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteGuide.execute(params.id, { permissions: actor.permissions });
  }
}