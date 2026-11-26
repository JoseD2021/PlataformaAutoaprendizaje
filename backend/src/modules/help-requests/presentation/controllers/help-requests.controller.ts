import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
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
import { OptionalAuth } from '../../../../shared/presentation/decorators/optional-auth.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CreateHelpRequestUseCase } from '../../application/use-cases/create-help-request.use-case';
import { ListPendingHelpRequestsUseCase } from '../../application/use-cases/list-pending-help-requests.use-case';
import { ResolveHelpRequestUseCase } from '../../application/use-cases/resolve-help-request.use-case';
import { CrearSolicitudAyudaDto } from '../dtos/crear-solicitud-ayuda.dto';
import { HelpRequestIdParamDto } from '../dtos/help-request-id-param.dto';
import { SolicitudAyudaResponseDto } from '../dtos/solicitud-ayuda-response.dto';

@ApiTags('Solicitudes de ayuda')
@Controller('help-requests')
export class HelpRequestsController {
  constructor(
    private readonly createHelpRequestUseCase: CreateHelpRequestUseCase,
    private readonly listPendingHelpRequestsUseCase: ListPendingHelpRequestsUseCase,
    private readonly resolveHelpRequestUseCase: ResolveHelpRequestUseCase,
  ) {}

  @Post()
  @OptionalAuth()
  @ApiOperation({
    summary: 'Pedir ayuda a la asistente',
    description:
      'Público. Si se envía un token válido, la solicitud muestra el nombre del usuario. ' +
      'Si el puesto o el usuario ya tienen una solicitud pendiente, devuelve esa misma.',
  })
  @ApiCreatedResponse({ type: SolicitudAyudaResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  async create(
    @Body() body: CrearSolicitudAyudaDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ): Promise<SolicitudAyudaResponseDto> {
    const created = await this.createHelpRequestUseCase.execute({
      stationNumber: body.puesto,
      guideId: body.guiaId,
      stepNumber: body.paso,
      requester: user ? { id: user.id, fullName: user.fullName } : null,
    });

    return SolicitudAyudaResponseDto.from(created);
  }

  @Get('pending')
  @ApiBearerAuth('access-token')
  @RequirePermissions(Permission.HELP_REQUESTS_READ)
  @ApiOperation({ summary: 'Listar solicitudes de ayuda pendientes (de la más antigua a la más reciente)' })
  @ApiOkResponse({ type: [SolicitudAyudaResponseDto] })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async listPending(): Promise<SolicitudAyudaResponseDto[]> {
    const pending = await this.listPendingHelpRequestsUseCase.execute();

    return pending.map((helpRequest) => SolicitudAyudaResponseDto.from(helpRequest));
  }

  @Patch(':id/resolve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @RequirePermissions(Permission.HELP_REQUESTS_MANAGE)
  @ApiOperation({ summary: 'Marcar una solicitud de ayuda como atendida' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async resolve(
    @Param() params: HelpRequestIdParamDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.resolveHelpRequestUseCase.execute({ helpRequestId: params.id, resolvedBy: user.id });
  }
}
